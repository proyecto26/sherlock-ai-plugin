import process from 'node:process';

/**
 * Every Gemini web endpoint is derived from a single origin so that a future
 * rename (the way NotebookLM moved notebooklm.google.com -> notebook.google.com)
 * is a one-line change here, or a zero-line change via the env override.
 *
 * Override with GEMINI_WEB_BASE_URL (no trailing slash needed).
 */
function resolveOrigin(): string {
    const override = process.env.GEMINI_WEB_BASE_URL?.trim();
    if (override) return override.replace(/\/+$/, '');
    return 'https://gemini.google.com';
}

export const GEMINI_ORIGIN = resolveOrigin();
export const GEMINI_HOST = new URL(GEMINI_ORIGIN).hostname;
export const GEMINI_APP_URL = `${GEMINI_ORIGIN}/app`;

/** Internal app id used in the batchexecute-style RPC path. */
export const APP_ID = 'BardChatUi';
export const GEMINI_STREAM_GENERATE_URL =
    `${GEMINI_ORIGIN}/_/${APP_ID}/data/assistant.lamda.BardFrontendService/StreamGenerate`;

export const GEMINI_UPLOAD_URL = 'https://content-push.googleapis.com/upload';
export const GEMINI_UPLOAD_PUSH_ID = 'feeds/mcudyrk2a4khkz';

export const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export const MODEL_HEADER_NAME = 'x-goog-ext-525001261-jspb';

export type GeminiWebModelId = 'gemini-3-pro' | 'gemini-2.5-pro' | 'gemini-2.5-flash';

export const MODEL_HEADERS: Record<GeminiWebModelId, string> = {
    'gemini-3-pro': '[1,null,null,null,"9d8ca3786ebdfbea",null,null,0,[4]]',
    'gemini-2.5-pro': '[1,null,null,null,"4af6c7f5da75d65d",null,null,0,[4]]',
    'gemini-2.5-flash': '[1,null,null,null,"9ec249fc9ad08861",null,null,0,[4]]',
};

/**
 * Tokens embedded in the /app bootstrap payload.
 *
 * `SNlM0e` is only present for a *signed-in* session. `thykhd` is the anonymous
 * token that Google hands to signed-out visitors so they can use the free tier.
 * Accepting `thykhd` as proof of a working session is what let expired cookies
 * look healthy while every request silently downgraded to the signed-out model
 * (which cannot generate images) — so the two are tracked separately.
 */
export const AUTHENTICATED_TOKEN_KEY = 'SNlM0e';
export const ANONYMOUS_TOKEN_KEY = 'thykhd';

/**
 * Phrases Gemini returns when it declines image generation because the caller is
 * not signed in / not eligible, rather than because the prompt was rejected.
 */
export const SIGNED_OUT_IMAGE_REFUSAL_PATTERNS = [
    /can'?t create it right now/i,
    /you'?re signed out/i,
    /image creation isn'?t available/i,
    /sign in to (?:try|create|generate)/i,
];

export function looksLikeSignedOutImageRefusal(text: string | null | undefined): boolean {
    if (!text) return false;
    return SIGNED_OUT_IMAGE_REFUSAL_PATTERNS.some((pattern) => pattern.test(text));
}

/** Shared, actionable remediation string — one wording for every caller. */
export function signedOutMessage(detail?: string): string {
    return [
        detail ?? 'Gemini session is not signed in.',
        `Google served the signed-out free tier (${GEMINI_HOST}), which cannot generate images.`,
        'Fix: npx -y bun scripts/main.ts --login   (then complete Google sign-in in the Chrome window)',
    ].join('\n');
}
