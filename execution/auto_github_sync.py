#!/usr/bin/env python3
"""
Auto GitHub Sync for DEV Projects
Directive: directives/auto_github_sync.md
DOE Framework: v2.0.0

Automatically sync new DEV project folders to GitHub repositories.
"""

import os
import sys
import time
import argparse
import requests
import subprocess
import json
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# =============================================================================
# VERSION - Must match directive
# =============================================================================
DOE_VERSION = "2026.04.26"

# =============================================================================
# CONFIGURATION
# =============================================================================
DEV_ROOT = Path("C:/Users/ptomlinson/Documents/DEV")
GITHUB_API_BASE = "https://api.github.com"
LOG_FILE = Path("logs/github_sync.log")

class GitHubSync:
    def __init__(self):
        self.github_token = os.getenv("GITHUB_TOKEN")
        self.github_username = os.getenv("GITHUB_USERNAME", "ptomlinson")
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"token {self.github_token}",
            "Accept": "application/vnd.github.v3+json"
        })

    def log(self, message):
        """Log message to file and console"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}"

        LOG_FILE.parent.mkdir(exist_ok=True)
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(log_entry + '\n')

        print(log_entry)

    def get_dev_projects(self):
        """Get all project folders in DEV directory"""
        if not DEV_ROOT.exists():
            self.log(f"ERROR: DEV root directory not found: {DEV_ROOT}")
            return []

        projects = []
        for item in DEV_ROOT.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                projects.append(item)

        return sorted(projects)

    def is_git_repo(self, path):
        """Check if directory is already a git repository"""
        return (path / '.git').exists()

    def has_github_remote(self, path):
        """Check if git repo has GitHub remote"""
        try:
            result = subprocess.run(
                ['git', 'remote', '-v'],
                cwd=path,
                capture_output=True,
                text=True,
                timeout=10
            )
            return 'github.com' in result.stdout
        except subprocess.TimeoutExpired:
            return False

    def create_github_repo(self, name, description="", private=False):
        """Create GitHub repository via API"""
        url = f"{GITHUB_API_BASE}/user/repos"
        data = {
            "name": name,
            "description": description,
            "private": private,
            "auto_init": False
        }

        try:
            response = self.session.post(url, json=data)
            response.raise_for_status()
            repo_data = response.json()
            self.log(f"Created GitHub repo: {repo_data['html_url']}")
            return repo_data
        except requests.exceptions.RequestException as e:
            self.log(f"ERROR: Failed to create GitHub repo '{name}': {e}")
            return None

    def init_git_repo(self, path, repo_url):
        """Initialize git repo and set up GitHub remote"""
        try:
            # Initialize if not already done
            if not self.is_git_repo(path):
                subprocess.run(['git', 'init'], cwd=path, check=True)
                subprocess.run(['git', 'add', '.'], cwd=path, check=True)
                subprocess.run(['git', 'commit', '-m', 'Initial commit'], cwd=path, check=True)

            # Add GitHub remote
            subprocess.run(['git', 'remote', 'add', 'origin', repo_url], cwd=path, check=True)

            # Rename master to main if needed, then push
            try:
                # Check current branch name
                branch_result = subprocess.run(['git', 'branch', '--show-current'], cwd=path, capture_output=True, text=True, check=True)
                current_branch = branch_result.stdout.strip()
                
                if current_branch == 'master':
                    # Rename master to main
                    subprocess.run(['git', 'branch', '-m', 'master', 'main'], cwd=path, check=True)
                    push_branch = 'main'
                else:
                    push_branch = current_branch
                
                # Push to GitHub
                subprocess.run(['git', 'push', '-u', 'origin', push_branch], cwd=path, check=True)
                
            except subprocess.CalledProcessError:
                # Fallback: try pushing current branch
                subprocess.run(['git', 'push', '-u', 'origin', 'HEAD'], cwd=path, check=True)

            self.log(f"Successfully synced {path.name} to GitHub")
            return True

        except subprocess.CalledProcessError as e:
            self.log(f"ERROR: Git operation failed for {path.name}: {e}")
            return False

    def process_project(self, project_path, dry_run=False):
        """Process a single project directory"""
        name = project_path.name

        # Skip if already has GitHub remote
        if self.is_git_repo(project_path) and self.has_github_remote(project_path):
            self.log(f"SKIP: {name} already has GitHub remote")
            return True

        if dry_run:
            self.log(f"DRY RUN: Would create GitHub repo for {name}")
            return True

        # Create GitHub repository
        description = f"Auto-generated repository for {name} project"
        repo_data = self.create_github_repo(name, description)

        if not repo_data:
            return False

        # Initialize local git and push
        repo_url = repo_data['clone_url']
        return self.init_git_repo(project_path, repo_url)

    def scan_projects(self, dry_run=False):
        """Scan all projects in DEV folder"""
        self.log("Starting DEV folder scan...")

        projects = self.get_dev_projects()
        self.log(f"Found {len(projects)} project directories")

        success_count = 0
        for project in projects:
            if self.process_project(project, dry_run):
                success_count += 1

        self.log(f"Scan complete: {success_count}/{len(projects)} projects processed")
        return success_count

    def watch_mode(self, interval=300):
        """Continuous monitoring mode"""
        self.log(f"Starting watch mode (interval: {interval}s)")

        processed_projects = set()

        try:
            while True:
                current_projects = {p.name for p in self.get_dev_projects()}

                new_projects = current_projects - processed_projects

                if new_projects:
                    self.log(f"Found {len(new_projects)} new projects")
                    for project_name in new_projects:
                        project_path = DEV_ROOT / project_name
                        if self.process_project(project_path):
                            processed_projects.add(project_name)

                time.sleep(interval)

        except KeyboardInterrupt:
            self.log("Watch mode stopped by user")

def main():
    parser = argparse.ArgumentParser(description="Auto GitHub sync for DEV projects")
    parser.add_argument("--setup", action="store_true", help="Initial setup")
    parser.add_argument("--scan", action="store_true", help="One-time scan")
    parser.add_argument("--watch", action="store_true", help="Continuous monitoring")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done")
    parser.add_argument("--interval", type=int, default=300, help="Watch interval in seconds")

    args = parser.parse_args()

    if not any([args.setup, args.scan, args.watch]):
        parser.print_help()
        return 1

    sync = GitHubSync()

    # Check configuration
    if not sync.github_token:
        print("ERROR: GITHUB_TOKEN not found in .env file")
        print("Please add: GITHUB_TOKEN=ghp_your_token_here")
        return 1

    if args.setup:
        print("Setup complete. Add to your .env file:")
        print("GITHUB_TOKEN=ghp_...")
        print("GITHUB_USERNAME=ptomlinson")
        return 0

    if args.scan:
        return 0 if sync.scan_projects(args.dry_run) > 0 else 1

    if args.watch:
        sync.watch_mode(args.interval)
        return 0

if __name__ == "__main__":
    sys.exit(main())