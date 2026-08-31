#!/usr/bin/env bash
# Assert that every host manifest agrees on plugin identity and install wiring.
#
# Checks name / version / description across:
#   plugin.json                      (Agent Plugins 1.0 — Cursor, Copilot CLI)
#   .codex-plugin/plugin.json        (OpenAI Codex)
#   .claude-plugin/plugin.json       (Claude Code)
#   .claude-plugin/marketplace.json  (Claude Code marketplace entry)
# plus the install wiring each host relies on:
#   .agents/plugins/marketplace.json entry source/path/policy (Codex / Copilot)
#   .claude-plugin/marketplace.json entry source (Claude — strict:true + auto-discovery)
#   .codex-plugin/plugin.json required fields and skills pointer
#   every skills/*/SKILL.md that hosts discover
# and runs the real host validators that exist: `claude plugin validate` and the
# Agent Plugins 1.0.0 JSON schema (needs python jsonschema + network; skipped otherwise).
# Codex and Copilot publish no validator; their manifests get structural checks only.
#
# Usage: bash scripts/check-manifests.sh [--allow-skips]
#   exit 0 = every check ran and passed. A validator that cannot run fails the gate
#   unless --allow-skips is given (local convenience only, not for release).

set -euo pipefail

allow_skips=false
if [[ "${1:-}" == "--allow-skips" ]]; then
  [[ -n "${CI:-}" ]] && { echo "FAIL: --allow-skips is not permitted when CI is set"; exit 1; }
  allow_skips=true
fi
skipped=0
skip() {
  if $allow_skips; then echo "SKIP: $1"; skipped=$((skipped + 1)); else echo "FAIL: $1 (pass --allow-skips to tolerate locally)"; exit 1; fi
}

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$root"
command -v python3 >/dev/null 2>&1 || { echo "python3 is required" >&2; exit 1; }

python3 - <<'PY'
import glob, json, os, sys

def load(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)

root      = load("plugin.json")
codex     = load(".codex-plugin/plugin.json")
claude    = load(".claude-plugin/plugin.json")
claude_mp = load(".claude-plugin/marketplace.json")
codex_mp  = load(".agents/plugins/marketplace.json")

name = root["name"]
entry = next((p for p in claude_mp["plugins"] if p.get("name") == name), None)
if entry is None:
    print(f"FAIL: .claude-plugin/marketplace.json has no entry named {name!r}"); sys.exit(1)

sources = {
    "plugin.json": root,
    ".codex-plugin/plugin.json": codex,
    ".claude-plugin/plugin.json": claude,
    ".claude-plugin/marketplace.json[entry]": entry,
}
errors = []
for field in ("name", "version", "description"):
    values = {label: src.get(field) for label, src in sources.items()}
    if len(set(values.values())) != 1:
        errors.append(f"{field} differs:\n" + "\n".join(f"    {k}: {v!r}" for k, v in values.items()))

if root.get("$schema") != "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json":
    errors.append("plugin.json $schema is not the Agent Plugins 1.0.0 schema URL")

portable_allowed = {"$schema", "name", "version", "description", "author", "homepage",
                    "repository", "license", "keywords", "extensions"}
extra = set(root) - portable_allowed
if extra:
    errors.append(f"plugin.json has non-portable top-level fields: {sorted(extra)}")

# Codex / Copilot catalog wiring
codex_entries = [p for p in codex_mp.get("plugins", []) if p.get("name") == name]
if len(codex_entries) != 1:
    errors.append(f".agents/plugins/marketplace.json must have exactly one entry named {name!r} (found {len(codex_entries)})")
else:
    ce = codex_entries[0]
    for field, want, got in (
        ("source.source", "local", (ce.get("source") or {}).get("source")),
        ("source.path", "./", (ce.get("source") or {}).get("path")),
        ("policy.installation", "AVAILABLE", (ce.get("policy") or {}).get("installation")),
        ("policy.authentication", "ON_INSTALL", (ce.get("policy") or {}).get("authentication")),
    ):
        if got != want:
            errors.append(f".agents/plugins/marketplace.json[{name}].{field} is {got!r}, expected {want!r}")
    if not ce.get("category"):
        errors.append(f".agents/plugins/marketplace.json[{name}] is missing 'category'")

# Claude marketplace: this plugin uses strict:true + auto-discovery, so the entry
# declares only source:"./", never strict:false, and must NOT re-declare components
# here — otherwise the marketplace entry becomes the complete definition and
# plugin.json-based auto-discovery is undermined.
if entry.get("source") != "./":
    errors.append(f".claude-plugin/marketplace.json[{name}].source is {entry.get('source')!r}, expected './'")
if entry.get("strict") is False:
    errors.append(f".claude-plugin/marketplace.json[{name}] sets strict:false; this plugin relies on strict:true + auto-discovery (omit strict or set it true)")
for comp in ("skills", "commands", "agents", "hooks", "mcpServers"):
    if comp in entry:
        errors.append(f".claude-plugin/marketplace.json[{name}] must not declare '{comp}' (uses auto-discovery)")
    if comp in claude:
        errors.append(f".claude-plugin/plugin.json must not declare '{comp}' (uses auto-discovery)")

if codex.get("skills") != "./skills/":
    errors.append(".codex-plugin/plugin.json 'skills' should be './skills/'")
for f in ("name", "version", "description"):
    if not codex.get(f):
        errors.append(f".codex-plugin/plugin.json is missing required field '{f}'")

# Agent Plugins discovery: each immediate child of skills/ must carry a SKILL.md,
# since that is exactly what every host scans for. A stray directory here is a
# skill that silently never loads.
skill_dirs = sorted(d for d in glob.glob("skills/*") if os.path.isdir(d))
if not skill_dirs:
    errors.append("skills/ contains no skill directories")
for d in skill_dirs:
    if not os.path.isfile(os.path.join(d, "SKILL.md")):
        errors.append(f"{d}/SKILL.md not found — hosts discover skills by this exact path")

# Structural guard: the plugin root the catalog entries point at ('./') must actually
# contain the plugin payload, so a green gate cannot mean an empty install target.
for required in (".codex-plugin/plugin.json", "plugin.json"):
    if not os.path.isfile(required):
        errors.append(f"plugin root is missing {required} — the '.' source path would resolve to an incomplete plugin")

if errors:
    print("FAIL: manifest inconsistency")
    for e in errors: print("  - " + e)
    sys.exit(1)
print(f"OK: {name} {root['version']} consistent across plugin.json, .codex-plugin, .claude-plugin, marketplaces")
print(f"OK: {len(skill_dirs)} skill(s) discoverable: " + ", ".join(os.path.basename(d) for d in skill_dirs))
PY

# Claude Code validator
if command -v claude >/dev/null 2>&1; then
  if out="$(claude plugin validate . 2>&1)"; then
    echo "OK: claude plugin validate passed"
  else
    echo "FAIL: claude plugin validate"; echo "$out"; exit 1
  fi
else
  skip "claude CLI not on PATH — .claude-plugin/ not validated by its host"
fi

# Agent Plugins 1.0 schema (Cursor, Copilot). Pick whichever interpreter has jsonschema.
schema_url="https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
py=""
for cand in python3 python; do
  if command -v "$cand" >/dev/null 2>&1 && "$cand" -c 'import jsonschema' 2>/dev/null; then py="$cand"; break; fi
done
if [[ -n "$py" ]] && schema_json="$(curl -sfL --max-time 10 "$schema_url")"; then
  "$py" - "$schema_json" <<'PY' || exit 1
import json, sys
from jsonschema import Draft202012Validator
schema = json.loads(sys.argv[1]); data = json.load(open("plugin.json", encoding="utf-8"))
errs = [f"{'.'.join(map(str, e.path)) or '<root>'}: {e.message}" for e in Draft202012Validator(schema).iter_errors(data)]
if errs:
    print("FAIL: plugin.json violates the Agent Plugins 1.0.0 schema"); [print("  - " + e) for e in errs]; sys.exit(1)
print("OK: plugin.json valid against the Agent Plugins 1.0.0 schema")
PY
else
  skip "Agent Plugins schema check needs python jsonschema and network access to $schema_url"
fi

echo "NOTE: no host validator exists for Codex/Copilot manifests — structural checks only"
if (( skipped > 0 )); then
  echo "WARNING: $skipped host validator(s) skipped — this run is NOT release evidence"
fi
