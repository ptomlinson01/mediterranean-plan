# Automated Daily GitHub Sync
<!-- DOE-VERSION: 2026.04.26 -->

## Goal

Automatically sync new DEV project folders to GitHub every day at 7pm without manual intervention.

## Trigger Phrases
- "schedule daily github sync"
- "automate github sync at 7pm"
- "setup automatic github backup"

## Quick Start
```bash
# Right-click and "Run as administrator"
setup_daily_sync.bat

# OR manually:
python execution/schedule_github_sync.py --setup
python execution/schedule_github_sync.py --test
```

## What It Does
1. **Creates Windows Scheduled Task** for daily execution at 7pm
2. **Runs auto_github_sync.py** automatically every evening
3. **Logs all operations** with timestamps
4. **Sends notifications** if sync fails
5. **Handles authentication** securely

## Output
- Scheduled task created in Windows Task Scheduler
- Daily execution logs in `logs/daily_sync.log`
- Email notifications on failures (optional)
- Status reports of automated syncs

## CLI Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `--setup` | false | Create the scheduled task |
| `--test` | false | Test the sync immediately |
| `--remove` | false | Remove the scheduled task |
| `--status` | false | Check if task is active |

## Requirements
- Windows Task Scheduler access
- GitHub token configured in `.env`
- Python executable in PATH
- Administrator privileges for task creation

## Configuration
Task runs daily at 7:00 PM with:
- Working directory: Template folder
- Command: `python execution/auto_github_sync.py --scan`
- Log output: `logs/daily_sync_[date].log`

## Error Handling
- Automatic retry on failures (up to 3 attempts)
- Email alerts for persistent failures
- Graceful handling of network issues
- Detailed error logging

## Security
- GitHub token stored securely in .env
- Task runs under user account
- No sensitive data in logs</content>
<parameter name="filePath">c:\Users\ptomlinson\Documents\DEV\AGENTIC TEMPLATE\CLAUDECODE-WORKFLOW-TEMPLATE\directives\daily_github_sync.md