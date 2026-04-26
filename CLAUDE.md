# Claude Code Agent Instructions
<!-- DOE-VERSION: 2026.04.26 -->
<!-- Mirrored: AGENTS.md = CLAUDE.md = GEMINI.md -->
<!-- Edit any file, then sync: python execution/sync_agent_files.py --sync -->
<!-- Optimized for Claude Code terminal-based workflow -->

You build workflows that persist. When something works, you save it so it never needs to be rebuilt.

---

## Core Workflow

### On Every Request
1. **Check `directives/`** for matching workflow
2. **Execute** if found, **research & build** if not
3. **Crystallize** working solutions immediately

### Research Before Building
- **Web Search**: Use `fetch_webpage` for docs, GitHub repos, tutorials
- **API Exploration**: Check current SDK versions, auth patterns
- **Present 3 Options**: Simplest, most robust, most maintainable
- **Include Cost Analysis**: Token estimates, runtime expectations
- **User Chooses**: Or test approaches in parallel

### File Operations
- **Paths**: Always use absolute paths: `c:\Users\ptomlinson\Documents\DEV\[project]\...`
- **Creation**: Use `create_file` for new scripts
- **Editing**: Use `replace_string_in_file` with 3-5 lines context
- **Validation**: Run scripts immediately, check output before proceeding

---

## Claude Code Tool Patterns

### Terminal Integration
- **Immediate Execution**: `isBackground=false` for feedback
- **Background Tasks**: `isBackground=true` for servers/watchers
- **Output Capture**: Check `get_terminal_output` for long-running tasks
- **Error Recovery**: Retry with backoff (1s, 2s, 4s)
- **Environment**: PowerShell, use `;` for command chaining

### Research Tools
- **Web Content**: `fetch_webpage` for official documentation
- **Complex Research**: `runSubagent` for multi-step investigations
- **Code Examples**: `github_repo` for implementation patterns
- **Workspace Search**: `semantic_search` for existing code patterns

### File Management
- **Directory Creation**: `create_directory` before file operations
- **Bulk Operations**: Group file creations in single turns
- **Validation**: `get_errors` after substantive changes
- **Testing**: Run minimal validation tests immediately

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

---

## Error Handling

| Type | Example | Action |
|------|---------|--------|
| Config | Missing API key | Fix .env, don't retry |
| Transient | Rate limit, timeout | Retry with backoff (1s, 2s, 4s...) |
| Logic | Wrong output | Fix script, update directive |
| External | API changed | Stop, tell user |

**After 3 failures:** Stop and ask user what to do.

---

## Escalation Rules

**STOP and ask user when:**
- Any single action costs > $1
- Cumulative run cost > $10
- Destructive action (delete, overwrite, send externally)
- No directive matches the request
- Directive and script versions don't match
- Any loop or batch process involves > 5 items

---

## Self-Improvement for Claude Code

When learning applies universally:
1. **Test** the pattern on 2-3 workflows
2. **Document** the improvement with before/after examples
3. **Update** CLAUDE.md with the new pattern
4. **Sync** via `python execution/sync_agent_files.py --sync`
5. **Validate** on next workflow creation

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
