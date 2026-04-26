# Auto GitHub Sync for DEV Projects
<!-- DOE-VERSION: 2026.04.26 -->

## Goal

Automatically detect new project folders in the DEV directory and create corresponding GitHub repositories with proper initialization.

## Trigger Phrases
- "auto sync dev to github"
- "setup github auto-sync"
- "create github repo for dev projects"

## Quick Start
```bash
python execution/auto_github_sync.py --setup
python execution/auto_github_sync.py --scan
```

## What It Does
1. **Scan** DEV folder for new project directories
2. **Initialize** git repositories for untracked projects
3. **Create** GitHub repositories via API
4. **Push** initial commits with proper setup
5. **Monitor** for new projects continuously

## Output
- GitHub repositories created for each new DEV project
- Local git repositories initialized
- Status reports of sync operations
- Log file: `logs/github_sync.log`

## CLI Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `--setup` | false | Initial setup with GitHub token configuration |
| `--scan` | false | One-time scan of DEV folder |
| `--watch` | false | Continuous monitoring mode |
| `--dry-run` | false | Show what would be done without executing |

## Requirements
- GitHub Personal Access Token with `repo` scope
- Git installed and configured
- DEV folder: `C:\Users\ptomlinson\Documents\DEV\`

## Configuration
Add to `.env`:
```
GITHUB_TOKEN=ghp_...
GITHUB_USERNAME=ptomlinson
```

## Error Handling
- Skips projects that already have GitHub repos
- Retries failed API calls with backoff
- Logs all operations for debugging</content>
<parameter name="filePath">c:\Users\ptomlinson\Documents\DEV\AGENTIC TEMPLATE\CLAUDECODE-WORKFLOW-TEMPLATE\directives\auto_github_sync.md