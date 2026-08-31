import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import {
    GeminiNotSignedInError,
    isGeminiSignedIn,
    runGeminiWebWithFallback,
    saveFirstGeminiImageFromOutput,
} from './client.js';
import { getGeminiCookieMapViaChrome } from './chrome-auth.js';
import {
    hasRequiredGeminiCookies,
    readGeminiCookieMapFromDisk,
    writeGeminiCookieMapToDisk,
} from './cookie-store.js';
import { resolveGeminiWebChromeProfileDir, resolveGeminiWebCookiePath } from './paths.js';
import { readSession, writeSession, listSessions } from './session-store.js';

function printUsage(exitCode = 0): never {
    const cookiePath = resolveGeminiWebCookiePath();
    const profileDir = resolveGeminiWebChromeProfileDir();

    console.log(`Usage:
  npx -y bun skills/genimg-gemini-web/scripts/main.ts --prompt "Hello"
  npx -y bun skills/genimg-gemini-web/scripts/main.ts "Hello"
  npx -y bun skills/genimg-gemini-web/scripts/main.ts --prompt "A cute cat" --image generated.png
  npx -y bun skills/genimg-gemini-web/scripts/main.ts --promptfiles system.md content.md --image out.png

Multi-turn conversation (agent generates unique sessionId):
  npx -y bun skills/genimg-gemini-web/scripts/main.ts "Remember 42" --sessionId abc123
  npx -y bun skills/genimg-gemini-web/scripts/main.ts "What number?" --sessionId abc123

Options:
  -p, --prompt <text>       Prompt text
  --promptfiles <files...>  Read prompt from one or more files (concatenated in order)
  -m, --model <id>          gemini-3-pro | gemini-2.5-pro | gemini-2.5-flash (default: gemini-3-pro)
  --json                    Output JSON
  --image [path]            Generate an image and save it (default: ./generated.png)
  --reference <files...>    Reference images for vision input
  --sessionId <id>          Session ID for multi-turn conversation (agent should generate unique ID)
  --list-sessions           List saved sessions (max 100, sorted by update time)
  --login                   Sign in / refresh cookies, then exit (fails if still signed out)
  --force                   With --login, always open the browser even if cookies look valid
  --cookie-path <path>      Cookie file path (default: ${cookiePath})
  --profile-dir <path>      Chrome profile dir (default: ${profileDir})
  -h, --help                Show help

Env overrides:
  GEMINI_WEB_DATA_DIR, GEMINI_WEB_COOKIE_PATH, GEMINI_WEB_CHROME_PROFILE_DIR, GEMINI_WEB_CHROME_PATH
  GEMINI_WEB_BASE_URL       Override the Gemini origin (default: https://gemini.google.com)
`);

    process.exit(exitCode);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readPromptFromStdin(): Promise<string | null> {
    if (process.stdin.isTTY) return null;
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const text = Buffer.concat(chunks).toString('utf8').trim();
    return text ? text : null;
}

function readPromptFiles(filePaths: string[]): string {
    const contents: string[] = [];
    for (const filePath of filePaths) {
        const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
        if (!fs.existsSync(resolved)) {
            throw new Error(`Prompt file not found: ${resolved}`);
        }
        const content = fs.readFileSync(resolved, 'utf8').trim();
        contents.push(content);
    }
    return contents.join('\n\n');
}

function parseArgs(argv: string[]): {
    prompt?: string;
    promptFiles?: string[];
    model?: string;
    json?: boolean;
    imagePath?: string;
    loginOnly?: boolean;
    cookiePath?: string;
    profileDir?: string;
    referenceImages?: string[];
    sessionId?: string;
    listSessions?: boolean;
    force?: boolean;
} {
    const out: ReturnType<typeof parseArgs> = {};
    const positional: string[] = [];

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i] ?? '';
        if (arg === '--help' || arg === '-h') printUsage(0);
        if (arg === '--json') {
            out.json = true;
            continue;
        }
        if (arg === '--image' || arg === '--generate-image') {
            const next = argv[i + 1];
            if (next && !next.startsWith('-')) {
                out.imagePath = next;
                i += 1;
            } else {
                out.imagePath = 'generated.png';
            }
            continue;
        }
        if (arg.startsWith('--image=')) {
            out.imagePath = arg.slice('--image='.length);
            continue;
        }
        if (arg.startsWith('--generate-image=')) {
            out.imagePath = arg.slice('--generate-image='.length);
            continue;
        }
        if (arg === '--login') {
            out.loginOnly = true;
            continue;
        }
        if (arg === '--force') {
            out.force = true;
            continue;
        }
        if (arg === '--prompt' || arg === '-p') {
            out.prompt = argv[i + 1] ?? '';
            i += 1;
            continue;
        }
        if (arg.startsWith('--prompt=')) {
            out.prompt = arg.slice('--prompt='.length);
            continue;
        }
        if (arg === '--promptfiles') {
            out.promptFiles = [];
            while (i + 1 < argv.length) {
                const next = argv[i + 1];
                if (next && !next.startsWith('-')) {
                    out.promptFiles.push(next);
                    i += 1;
                } else {
                    break;
                }
            }
            continue;
        }
        if (arg === '--model' || arg === '-m') {
            out.model = argv[i + 1] ?? '';
            i += 1;
            continue;
        }
        if (arg.startsWith('--model=')) {
            out.model = arg.slice('--model='.length);
            continue;
        }
        if (arg === '--cookie-path') {
            out.cookiePath = argv[i + 1] ?? '';
            i += 1;
            continue;
        }
        if (arg.startsWith('--cookie-path=')) {
            out.cookiePath = arg.slice('--cookie-path='.length);
            continue;
        }
        if (arg === '--profile-dir') {
            out.profileDir = argv[i + 1] ?? '';
            i += 1;
            continue;
        }
        if (arg.startsWith('--profile-dir=')) {
            out.profileDir = arg.slice('--profile-dir='.length);
            continue;
        }
        if (arg === '--reference' || arg === '--ref') {
            out.referenceImages = [];
            while (i + 1 < argv.length) {
                const next = argv[i + 1];
                if (next && !next.startsWith('-')) {
                    out.referenceImages.push(next);
                    i += 1;
                } else {
                    break;
                }
            }
            continue;
        }
        if (arg === '--sessionId' || arg === '--session-id') {
            out.sessionId = argv[i + 1] ?? '';
            i += 1;
            continue;
        }
        if (arg.startsWith('--sessionId=') || arg.startsWith('--session-id=')) {
            out.sessionId = arg.split('=')[1] ?? '';
            continue;
        }
        if (arg === '--list-sessions') {
            out.listSessions = true;
            continue;
        }

        if (arg.startsWith('-')) {
            throw new Error(`Unknown option: ${arg}`);
        }
        positional.push(arg);
    }

    if (!out.prompt && positional.length > 0) {
        out.prompt = positional.join(' ').trim();
    }

    if (out.prompt != null) out.prompt = out.prompt.trim();
    if (out.model != null) out.model = out.model.trim();
    if (out.imagePath != null) out.imagePath = out.imagePath.trim();
    if (out.cookiePath != null) out.cookiePath = out.cookiePath.trim();
    if (out.profileDir != null) out.profileDir = out.profileDir.trim();

    if (out.imagePath === '') delete out.imagePath;
    if (out.cookiePath === '') delete out.cookiePath;
    if (out.profileDir === '') delete out.profileDir;
    if (out.promptFiles?.length === 0) delete out.promptFiles;
    if (out.referenceImages?.length === 0) delete out.referenceImages;
    if (out.sessionId != null) out.sessionId = out.sessionId.trim();
    if (out.sessionId === '') delete out.sessionId;

    return out;
}

/**
 * A cookie map is only "valid" when it resolves to a *signed-in* session.
 *
 * Presence of the cookies is not enough: expired __Secure-1PSID cookies still
 * load /app fine, Google just serves the anonymous free tier, which cannot
 * generate images. Checking sign-in here is what makes `--login` actually
 * re-open Chrome instead of exiting on stale cookies.
 */
async function isCookieMapValid(cookieMap: Record<string, string>): Promise<boolean> {
    if (!hasRequiredGeminiCookies(cookieMap)) return false;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    try {
        return await isGeminiSignedIn(cookieMap, controller.signal);
    } finally {
        clearTimeout(timer);
    }
}

async function ensureGeminiCookieMap(options: {
    cookiePath: string;
    profileDir: string;
    force?: boolean;
}): Promise<Record<string, string>> {
    const log = (msg: string) => console.error(msg);

    let cookieMap = await readGeminiCookieMapFromDisk({ cookiePath: options.cookiePath, log });
    if (!options.force && (await isCookieMapValid(cookieMap))) return cookieMap;

    log(
        options.force
            ? '[gemini-web] --force: opening browser to re-sync Gemini cookies...'
            : '[gemini-web] Cookies are missing or signed out. Opening browser to sync Gemini cookies...',
    );
    cookieMap = await getGeminiCookieMapViaChrome({ userDataDir: options.profileDir, log });
    await writeGeminiCookieMapToDisk(cookieMap, { cookiePath: options.cookiePath, log });
    return cookieMap;
}

/**
 * Warns when Google served a weaker model than the one requested.
 *
 * The x-goog-ext model ids rotate; a stale id is ignored rather than rejected,
 * so "I asked for Pro and got Flash" is otherwise invisible — and Flash-tier
 * models decline image generation.
 */
function warnOnModelDrift(requested: string, servedModel: string | null | undefined): void {
    if (!servedModel) return;
    const wantedPro = requested.includes('pro');
    if (wantedPro && !/Pro|Ultra/i.test(servedModel)) {
        console.error(
            `[gemini-web] Requested "${requested}" but Gemini served "${servedModel}". ` +
                'The model id for this alias is stale (Google rotates them); image generation may be unavailable. ' +
                'Use -m gemini-3-pro, which is currently mapped correctly.',
        );
    }
}

function resolveModel(value: string): 'gemini-3-pro' | 'gemini-2.5-pro' | 'gemini-2.5-flash' {
    const desired = value.trim();
    if (!desired) return 'gemini-3-pro';
    switch (desired) {
        case 'gemini-3-pro':
        case 'gemini-3.0-pro':
            return 'gemini-3-pro';
        case 'gemini-2.5-pro':
            return 'gemini-2.5-pro';
        case 'gemini-2.5-flash':
            return 'gemini-2.5-flash';
        default:
            console.error(`[gemini-web] Unsupported model "${desired}", falling back to gemini-3-pro.`);
            return 'gemini-3-pro';
    }
}

function resolveImageOutputPath(value: string | undefined): string | null {
    if (value == null) return null;
    const trimmed = value.trim();
    const raw = trimmed || 'generated.png';
    const resolved = path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);

    if (resolved.endsWith(path.sep)) return path.join(resolved, 'generated.png');
    try {
        if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
            return path.join(resolved, 'generated.png');
        }
    } catch {
        // ignore
    }
    return resolved;
}

async function main(): Promise<void> {
    const args = parseArgs(process.argv.slice(2));
    const cookiePath = args.cookiePath ?? resolveGeminiWebCookiePath();
    const profileDir = args.profileDir ?? resolveGeminiWebChromeProfileDir();

    if (args.listSessions) {
        const sessions = await listSessions();
        if (sessions.length === 0) {
            console.log('No saved sessions.');
        } else {
            for (const { id, updatedAt } of sessions) {
                console.log(`${id}\t${updatedAt}`);
            }
        }
        return;
    }

    if (args.loginOnly) {
        const map = await ensureGeminiCookieMap({ cookiePath, profileDir, force: args.force });
        const ok = await isCookieMapValid(map);
        console.error(
            ok
                ? '[gemini-web] Signed in to Gemini. Image generation is available.'
                : '[gemini-web] Still signed out after the browser flow — image generation will not work.',
        );
        if (!ok) process.exit(1);
        return;
    }

    const promptFromFiles = args.promptFiles ? readPromptFiles(args.promptFiles) : null;
    const promptFromArgs = promptFromFiles || args.prompt;
    const prompt = promptFromArgs || (await readPromptFromStdin());
    if (!prompt) printUsage(1);

    const sessionData = args.sessionId ? await readSession(args.sessionId) : null;
    const chatMetadata = sessionData?.metadata ?? null;

    let cookieMap = await ensureGeminiCookieMap({ cookiePath, profileDir });

    const desiredModel = resolveModel(args.model || 'gemini-3-pro');
    const imagePath = resolveImageOutputPath(args.imagePath);
    const referenceImages = (args.referenceImages ?? []).map((p) =>
        path.isAbsolute(p) ? p : path.resolve(process.cwd(), p),
    );

    try {
        const controller = new AbortController();
        const timeoutMs = imagePath ? 300_000 : 120_000;
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const effectivePrompt = imagePath ? `Generate an image: ${prompt}` : prompt;
            const out = await runGeminiWebWithFallback({
                prompt: effectivePrompt,
                files: referenceImages,
                model: desiredModel,
                cookieMap,
                chatMetadata,
                signal: controller.signal,
            });

            warnOnModelDrift(desiredModel, out.servedModel);

            if (args.sessionId && out.metadata) {
                await writeSession(args.sessionId, out.metadata, prompt, out.text ?? '', out.errorMessage);
            }

            let imageSaved = false;
            let imageCount = 0;
            if (imagePath) {
                const save = await saveFirstGeminiImageFromOutput(out, cookieMap, imagePath, controller.signal);
                imageSaved = save.saved;
                imageCount = save.imageCount;
                if (!imageSaved) {
                    throw new Error(`No images generated. Response text:\n${out.text || '(empty response)'}`);
                }
            }

            if (args.json) {
                const jsonOut = { ...out, ...(imagePath && { imageSaved, imageCount, imagePath }), ...(args.sessionId && { sessionId: args.sessionId }) };
                process.stdout.write(`${JSON.stringify(jsonOut, null, 2)}\n`);
                if (out.errorMessage) process.exit(1);
                return;
            }

            if (out.errorMessage) {
                throw new Error(out.errorMessage);
            }

            process.stdout.write(out.text ?? '');
            if (!out.text?.endsWith('\n')) process.stdout.write('\n');
            if (imagePath) {
                process.stdout.write(`Saved image (${imageCount || 1}) to: ${imagePath}\n`);
            }
            return;
        } finally {
            clearTimeout(timeout);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        if (message.includes('Unable to locate Gemini access token')) {
            console.error('[gemini-web] Cookies may be expired. Re-opening browser to refresh cookies...');
            await sleep(500);
            cookieMap = await getGeminiCookieMapViaChrome({ userDataDir: profileDir, log: (m) => console.error(m) });
            await writeGeminiCookieMapToDisk(cookieMap, { cookiePath, log: (m) => console.error(m) });

            const controller = new AbortController();
            const timeoutMs = imagePath ? 300_000 : 120_000;
            const timeout = setTimeout(() => controller.abort(), timeoutMs);

            try {
                const out = await runGeminiWebWithFallback({
                    prompt: imagePath ? `Generate an image: ${prompt}` : prompt,
                    files: referenceImages,
                    model: desiredModel,
                    cookieMap,
                    chatMetadata,
                    signal: controller.signal,
                });

                warnOnModelDrift(desiredModel, out.servedModel);

                if (args.sessionId && out.metadata) {
                    await writeSession(args.sessionId, out.metadata, prompt, out.text ?? '', out.errorMessage);
                }

                let imageSaved = false;
                let imageCount = 0;
                if (imagePath) {
                    const save = await saveFirstGeminiImageFromOutput(out, cookieMap, imagePath, controller.signal);
                    imageSaved = save.saved;
                    imageCount = save.imageCount;
                    if (!imageSaved) {
                        throw new Error(`No images generated. Response text:\n${out.text || '(empty response)'}`);
                    }
                }

                if (args.json) {
                    const jsonOut = { ...out, ...(imagePath && { imageSaved, imageCount, imagePath }), ...(args.sessionId && { sessionId: args.sessionId }) };
                    process.stdout.write(`${JSON.stringify(jsonOut, null, 2)}\n`);
                    if (out.errorMessage) process.exit(1);
                    return;
                }

                if (out.errorMessage) {
                    throw new Error(out.errorMessage);
                }

                process.stdout.write(out.text ?? '');
                if (!out.text?.endsWith('\n')) process.stdout.write('\n');
                if (imagePath) {
                    process.stdout.write(`Saved image (${imageCount || 1}) to: ${imagePath}\n`);
                }
                return;
            } finally {
                clearTimeout(timeout);
            }
        }

        throw error;
    }
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});