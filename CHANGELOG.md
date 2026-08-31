# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-08-30

### Fixed

- **`genimg-gemini-web` stopped generating images.** The cause was not a domain
  change — `gemini.google.com` is unchanged. Google hands *signed-out* visitors
  an anonymous bootstrap token (`thykhd`) alongside the signed-in one (`SNlM0e`),
  and the client accepted either as proof of a working session. Once the cached
  cookies expired, every request silently ran as an anonymous visitor: Google
  served the free Flash tier regardless of the requested model, and that tier
  declines image generation with prose ("can't create it right now… it's possible
  you're signed out") instead of an error.

  Consequences that are now fixed:
  - `--login` exited immediately on stale cookies instead of opening Chrome,
    because the anonymous token made them look valid.
  - `chrome-auth` would have persisted signed-out cookies as a successful login.
  - Image failures surfaced as a generic "No images generated" with no remedy.

### Added

- `scripts/constants.ts`: every Gemini endpoint now derives from one origin, so a
  future host rename is a one-line change — or none at all via the new
  `GEMINI_WEB_BASE_URL` env override.
- Sign-in awareness: `fetchGeminiAccessTokenInfo()` reports whether the session is
  authenticated, `isGeminiSignedIn()` checks it, and `GeminiNotSignedInError`
  carries the actionable fix. `GeminiWebRunOutput.authenticated` exposes it to
  programmatic callers.
- Fail-fast guard in the executor: media generation checks sign-in up front
  instead of after a 5-minute timeout.
- Model-drift detection: Gemini echoes the model it actually used, and the CLI
  warns when a Pro request is served by a Flash model. This surfaced a real
  regression — the `gemini-2.5-pro` alias id is stale and silently resolves to
  Flash. `gemini-3-pro` (the default) maps correctly.
- `--force` flag to re-run the browser login even when cached cookies look valid.
- Troubleshooting table in `skills/genimg-gemini-web/SKILL.md`.

### Changed

- **Agent Plugins standard support** ([agent-plugins.org](https://agent-plugins.org/)).
  The plugin now installs on Claude Code, OpenAI Codex, Cursor and Copilot CLI
  from one repository:
  - `plugin.json` — Agent Plugins 1.0.0 manifest (validated against the published schema).
  - `.codex-plugin/plugin.json` — OpenAI Codex manifest with interface metadata.
  - `.agents/plugins/marketplace.json` — Codex/Copilot catalog entry.
  - `.claude-plugin/*` — unchanged in shape, bumped to 1.1.0.
- `scripts/check-manifests.sh` asserts name/version/description parity across all
  host manifests, the Agent Plugins closed-schema shape, install wiring, that
  every `skills/*` directory carries a discoverable `SKILL.md`, and that both
  catalogs advertise the same marketplace name.
- **Marketplace renamed** from `sherlock-ai-plugin` to `sherlock-ai-plugin-marketplace`.
  Copilot CLI reads `.claude-plugin/marketplace.json` and Codex reads
  `.agents/plugins/marketplace.json`, and both install via `<plugin>@<marketplace>` —
  so the two catalogs must agree, and a marketplace named identically to the plugin
  makes `sherlock-ai-plugin@sherlock-ai-plugin` ambiguous. Matches the Seldon plugin's
  convention. Claude Code users who pinned the old marketplace name should re-add it.
- Restored `category: "development"` on the Claude marketplace entry (dropped as
  collateral in b5ccaec, which targeted conflicting *component* specs; `category`
  is display metadata and is compatible with `strict:true` auto-discovery).

### Validated on (2026-08-31, macOS 15, this release's working tree)

| Host | Check | Result |
|------|-------|--------|
| Claude Code | `claude plugin validate .` | Passed |
| Agent Plugins 1.0 | `plugin.json` validated against `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json` (python `jsonschema`) | No errors |
| Manifest consistency | `bash scripts/check-manifests.sh` | Consistent |
| OpenAI Codex CLI 0.149.1 | `codex plugin marketplace add ./` then `codex plugin add sherlock-ai-plugin@sherlock-ai-plugin-marketplace` | Installed `1.1.0`; all **6 skills** present with `SKILL.md` under the installed root; removed cleanly afterwards |
| `check-manifests.sh` gate | tampered copy (marketplace names diverged) | Fails as expected |
| Gemini image generation | 3 real generations after re-login; drift warning fires on `-m gemini-2.5-pro` | Working |

Not exercised: GitHub Copilot CLI (not installed on this machine) and Cursor
plugin install (headless install not available). The Codex run above is the
evidence that root-level `plugin.json` + `skills/` auto-discovery installs
correctly on a non-Claude host.

## [1.0.0]

- Initial release: `paper-analyzer`, `paper2code`, `paper-comic`,
  `visual-architect`, `deep-research`, and `genimg-gemini-web` skills.
