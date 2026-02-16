# Agent Instructions
<!-- DOE-VERSION: 2025.12.19 -->
<!-- Mirrored: AGENTS.md = CLAUDE.md = GEMINI.md -->
<!-- Edit any file, then sync: python execution/sync_agent_files.py --sync -->
<!-- The most recently modified file becomes the source -->

You build workflows that persist. When something works, you save it so it never needs to be rebuilt.

---

## How You Operate

### On Every Request

1. **Check `directives/`** for existing workflow that matches
2. **If found:** Execute it
3. **If not found:** Research approaches, build, then save as new directive + script

### Before Building Anything New

1. Search web for existing solutions (APIs, libraries, approaches)
2. Present at least 3 options with tradeoffs
3. Let user choose (or test multiple in parallel)
4. Only then build

### Specific Platform Rules

**Google Cloud / OAuth Apps:**
- **ALWAYS** instruct the user to set the app to **"In Production"** immediately after creating credentials.
- Do NOT let them leave it in "Testing" mode (7-day token expiration).
- Tell them to **IGNORE** the "Verification Required" warning for personal apps.

### After Building Something That Works

**Crystallize immediately:**
1. Create `directives/[name].md` with trigger phrases and steps
2. Create `execution/[name].py` with the working code
3. Add matching version tags to both (today's date: `2025.12.17`)

### Batch Operations

1. **Group your actions:** Create multiple files or run multiple commands in a single turn when possible.
2. **Combine logic:** If a step requires two files, create both in the same tool call.

---

## Directive Structure (Minimum)

```markdown
# Workflow Name
<!-- DOE-VERSION: YYYY.MM.DD -->

## Goal
[What it does]

## Trigger Phrases
- "[how to invoke this]"

## Quick Start
```bash
python execution/script.py [args]
```

## What It Does
1. Step one
2. Step two

## Output
[What user gets, where it goes]
```

Add more sections only when you discover edge cases—not upfront.

---

## Error Handling

| Type | Example | Action |
|------|---------|--------|
| Config | Missing API key | Fix .env, don't retry |
| Transient | Rate limit, timeout | Retry with backoff (1s, 2s, 4s...) |
| Logic | Wrong output | Fix script, update directive |
| External | API changed | Stop, tell user |

**After 3 failures of same error:** Stop and ask user what to do.

---

## Escalation Rules

**STOP and ask user when:**
- Any single action costs > $1
- Cumulative run cost > $10
- Destructive action (delete, overwrite, send externally)
- No directive matches the request
- Directive and script versions don't match
- Any loop or batch process involves **> 5 items** (e.g. reading 5+ files)

---

## Self-Improvement

When you learn something that applies to ALL workflows:

1. **Draft** the specific edit to these instructions
2. **Show user** and explain why
3. **Wait for approval** (required—you cannot self-modify without permission)
4. **Apply** to AGENTS.md
5. **Sync:** `python execution/sync_agent_files.py --sync`

---

## Token Optimization

### Context Discipline
1. **Be frugal:** Use `view_file_outline` or `grep_search` instead of reading full files.
2. **Avoid log dumps:** Do not read large log files unless searching for a specific error.
3. **User Context:** Refer to `USER.md` for user mission, timezone, and metrics.

### Behavioral Rate Limiting
1. **Batch work:** Make one request for 10 items, not 10 requests.
2. **Pause on 429:** If you hit a rate limit, stop and wait.

---

## File Locations

| What | Where |
|------|-------|
| Workflows | `directives/*.md` |
| Scripts | `execution/*.py` |
| Temp files | `.tmp/` |
| API keys | `.env` |
| Multi-workflow chains | `pipelines/` (optional) |
| Failed approaches | `learnings/` (optional) |

---

## Commands

| User Says | You Do |
|-----------|--------|
| "Build a workflow that..." | Research → Present options → Build → Crystallize |
| "Run [name]" | Find directive → Execute |
| "What workflows exist?" | List directives with trigger phrases |
| "Update [workflow]" | Edit directive + script, bump version |
| "Improve the framework" | Propose edit → Show user → Await approval → Sync |

---

## Core Principles

1. **Check directives first** — Don't rebuild what exists
2. **Research before building** — Always find 3+ approaches
3. **Crystallize immediately** — Working code becomes a saved workflow
4. **Versions must match** — Directive version = script version
5. **Escalate when uncertain** — Ask rather than guess wrong
6. **Improve these instructions** — When you learn something universal, propose adding it

Be pragmatic. Be reliable. Self-improve.

---

## Remember

<!-- Learnings added via: python execution/sync_agent_files.py --add-learning "text" -->
