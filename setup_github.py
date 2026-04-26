#!/usr/bin/env python3
"""
GitHub Repository Setup Helper
Helps configure the remote for the Claude Code template
"""

import subprocess
import sys
from pathlib import Path

def setup_github_remote():
    """Help user set up GitHub remote"""

    print("🚀 Claude Code Workflow Template - GitHub Setup")
    print("=" * 50)

    # Get repository details
    username = input("Enter your GitHub username: ").strip()
    repo_name = input("Enter repository name (e.g., claude-code-workflows): ").strip()

    if not username or not repo_name:
        print("❌ Username and repository name are required")
        return 1

    repo_url = f"https://github.com/{username}/{repo_name}.git"

    print(f"\n📋 Repository URL: {repo_url}")
    confirm = input("Is this correct? (y/N): ").strip().lower()

    if confirm != 'y':
        print("❌ Setup cancelled")
        return 1

    try:
        # Add remote
        subprocess.run(['git', 'remote', 'add', 'origin', repo_url], check=True)
        print("✅ Remote 'origin' added")

        # Push to GitHub
        print("📤 Pushing to GitHub...")
        subprocess.run(['git', 'push', '-u', 'origin', 'main'], check=True)
        print("✅ Successfully pushed to GitHub!")

        print(f"\n🎉 Repository available at: https://github.com/{username}/{repo_name}")
        return 0

    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure the GitHub repository exists")
        print("2. Check your GitHub credentials")
        print("3. Verify you have push permissions")
        return 1

if __name__ == "__main__":
    sys.exit(setup_github_remote())</content>
<parameter name="filePath">c:\Users\ptomlinson\Documents\DEV\AGENTIC TEMPLATE\CLAUDECODE-WORKFLOW-TEMPLATE\setup_github.py