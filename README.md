# Claude Code Agentic Workflows Template
## Build Once, Run Forever - Optimized for Claude Code

You describe what you want. Claude Code builds it. The workflow gets saved so you never rebuild it.

**Optimized for terminal-based development with streamlined instructions and Claude Code tool patterns.**

---

## Getting Started

This is a **GitHub template repository**. Here's how to use it:

### Option 1: Use This Template (Recommended)

1. Click the green **"Use this template"** button at the top of this page
2. Select **"Create a new repository"**
3. Name your repository and create it
4. Clone your new repository locally
5. Continue with setup below

### Option 2: Fork

Use this if you want to pull future updates from this template.

### Option 3: Clone Directly

```bash
git clone <this-repo-url> my-project
cd my-project
rm -rf .git && git init  # Start fresh git history
```

---

## Setup

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with your API keys (at minimum: ANTHROPIC_API_KEY)
# For auto GitHub sync, also add: GITHUB_TOKEN and GITHUB_USERNAME

# 2. Verify
python execution/sync_agent_files.py --check

# 3. Set up GitHub repository (optional)
python setup_github.py

# 4. Open in Claude Code
claude --dangerously-skip-permissions
# This flag allows Claude to run scripts without confirmation prompts
```

### Auto GitHub Sync Setup

To automatically sync new DEV projects to GitHub:

```bash
# Configure GitHub token in .env
echo "GITHUB_TOKEN=ghp_your_token_here" >> .env
echo "GITHUB_USERNAME=ptomlinson" >> .env

# Test the sync (dry run first)
python execution/auto_github_sync.py --scan --dry-run

# Run actual sync
python execution/auto_github_sync.py --scan

# Set up DAILY automated sync at 7pm
# Right-click setup_daily_sync.bat and "Run as administrator"
# OR run: python execution/schedule_github_sync.py --setup

# Check if daily sync is active
python execution/schedule_github_sync.py --status
```

**Daily Automation:** Once set up, any new folders created in your DEV directory will be automatically synced to GitHub every day at 7:00 PM.

---

## How It Works

**Three layers optimized for Claude Code:**
1. **Directives** - Plain English instructions (`directives/*.md`)
2. **Orchestration** - Claude Code makes decisions using optimized tool patterns
3. **Execution** - Python scripts do the work (`execution/*.py`)

**First time:** "Build a workflow that scrapes competitor prices" → Claude Code researches APIs, presents 3 options, builds with validation

**Every time after:** "Scrape competitor prices" → Claude Code finds directive, runs script, done

**Claude Code optimizations:**
- Streamlined instructions for faster context loading
- Tool-specific patterns for terminal/file operations
- Enhanced research phase with web search integration
- Immediate validation and error recovery

---

## Project Structure

```
your-project/
├── CLAUDE.md              # Claude Code optimized instructions (source of truth)
├── AGENTS.md              # Mirror for other AI tools
├── GEMINI.md              # Mirror for Gemini
├── REFERENCE.md           # Deep documentation
├── directives/            # Your workflows
├── execution/             # Your scripts
├── logs/                  # Auto-sync logs and operation history
└── .env                   # API keys (gitignored)
```

---

## Learn More

- **[REFERENCE.md](REFERENCE.md)** - Full documentation (architecture, error handling, advanced features)
- **[directives/csv_to_json.md](directives/csv_to_json.md)** - Example: Convert CSV files to JSON (no API needed)
- **[directives/weather_lookup.md](directives/weather_lookup.md)** - Example: Look up weather via API (shows dotenv pattern)
- **[directives/auto_github_sync.md](directives/auto_github_sync.md)** - Auto-sync DEV projects to GitHub repositories
- **[directives/daily_github_sync.md](directives/daily_github_sync.md)** - Automated daily GitHub sync scheduling
- **[directives/_TEMPLATE.md](directives/_TEMPLATE.md)** - Template for new workflows
- **[execution/_TEMPLATE.py](execution/_TEMPLATE.py)** - Template for new scripts

---

## Credits

Based on Nick Saraev's DOE framework. Refined for clarity and self-improvement.
