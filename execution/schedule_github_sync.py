#!/usr/bin/env python3
"""
Automated Daily GitHub Sync Scheduler
Directive: directives/daily_github_sync.md
DOE Framework: v2.0.0

Creates Windows Scheduled Task for daily GitHub sync at 7pm.
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path
from datetime import datetime

# =============================================================================
# VERSION - Must match directive
# =============================================================================
DOE_VERSION = "2026.04.26"

# =============================================================================
# CONFIGURATION
# =============================================================================
TEMPLATE_DIR = Path(__file__).parent.parent
TASK_NAME = "DailyGitHubSync"
SYNC_SCRIPT = TEMPLATE_DIR / "execution" / "auto_github_sync.py"
LOG_DIR = TEMPLATE_DIR / "logs"

class DailySyncScheduler:
    def __init__(self):
        self.template_dir = TEMPLATE_DIR
        self.task_name = TASK_NAME
        self.sync_script = SYNC_SCRIPT
        self.log_dir = LOG_DIR
        self.log_dir.mkdir(exist_ok=True)

    def log(self, message):
        """Log message to console and file"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}"

        # Log to daily sync log
        log_file = self.log_dir / f"daily_sync_{datetime.now().strftime('%Y-%m-%d')}.log"
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(log_entry + '\n')

        print(log_entry)

    def get_python_executable(self):
        """Get the full path to Python executable"""
        return sys.executable

    def create_scheduled_task(self):
        """Create Windows Scheduled Task for daily sync at 7pm"""
        python_exe = self.get_python_executable()
        script_path = str(self.sync_script)
        working_dir = str(self.template_dir)

        # Check if running as administrator
        try:
            import ctypes
            is_admin = ctypes.windll.shell32.IsUserAnAdmin()
        except:
            is_admin = False

        if not is_admin:
            self.log("❌ Administrator privileges required to create scheduled tasks")
            self.log("Please run this command as Administrator:")
            self.log(f'   powershell -Command "Start-Process python \'{sys.argv[0]}\' -ArgumentList \'--setup\' -Verb RunAs"')
            return False

        # schtasks command to create daily task at 7:00 PM
        cmd = [
            'schtasks', '/create', '/tn', self.task_name,
            '/tr', f'"{python_exe}" "{script_path}" --scan',
            '/sc', 'daily', '/st', '19:00',  # 7:00 PM
            '/ru', os.getlogin(),  # Run as current user
            '/rl', 'highest',  # Run with highest privileges
            '/f'  # Force overwrite if exists
        ]

        try:
            self.log("Creating Windows Scheduled Task...")
            result = subprocess.run(cmd, capture_output=True, text=True, cwd=working_dir)

            if result.returncode == 0:
                self.log("✅ Scheduled task created successfully")
                self.log("Task will run daily at 7:00 PM")
                return True
            else:
                self.log(f"❌ Failed to create task: {result.stderr}")
                return False

        except Exception as e:
            self.log(f"❌ Error creating scheduled task: {e}")
            return False

    def remove_scheduled_task(self):
        """Remove the scheduled task"""
        cmd = ['schtasks', '/delete', '/tn', self.task_name, '/f']

        try:
            self.log("Removing Windows Scheduled Task...")
            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                self.log("✅ Scheduled task removed successfully")
                return True
            else:
                self.log(f"❌ Failed to remove task: {result.stderr}")
                return False

        except Exception as e:
            self.log(f"❌ Error removing scheduled task: {e}")
            return False

    def check_task_status(self):
        """Check if the scheduled task exists and is ready"""
        cmd = ['schtasks', '/query', '/tn', self.task_name, '/fo', 'csv', '/nh']

        try:
            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0 and self.task_name in result.stdout:
                self.log("✅ Scheduled task is active and ready")
                return True
            else:
                self.log("❌ Scheduled task not found or inactive")
                return False

        except Exception as e:
            self.log(f"❌ Error checking task status: {e}")
            return False

    def test_sync_now(self):
        """Test the sync script immediately"""
        python_exe = self.get_python_executable()
        script_path = str(self.sync_script)

        cmd = [python_exe, script_path, '--scan']

        try:
            self.log("Testing sync script execution...")
            result = subprocess.run(cmd, cwd=str(self.template_dir))

            if result.returncode == 0:
                self.log("✅ Sync test completed successfully")
                return True
            else:
                self.log(f"❌ Sync test failed with exit code: {result.returncode}")
                return False

        except Exception as e:
            self.log(f"❌ Error testing sync: {e}")
            return False

    def show_task_info(self):
        """Show information about the scheduled task"""
        cmd = ['schtasks', '/query', '/tn', self.task_name, '/v', '/fo', 'list']

        try:
            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode == 0:
                print("\n" + "="*50)
                print("SCHEDULED TASK INFORMATION")
                print("="*50)
                print(result.stdout)
            else:
                print(f"❌ Could not retrieve task information: {result.stderr}")

        except Exception as e:
            print(f"❌ Error retrieving task info: {e}")

def main():
    parser = argparse.ArgumentParser(description="Automated Daily GitHub Sync Scheduler")
    parser.add_argument("--setup", action="store_true", help="Create the scheduled task")
    parser.add_argument("--remove", action="store_true", help="Remove the scheduled task")
    parser.add_argument("--status", action="store_true", help="Check task status")
    parser.add_argument("--test", action="store_true", help="Test sync immediately")
    parser.add_argument("--info", action="store_true", help="Show task information")

    args = parser.parse_args()

    if not any([args.setup, args.remove, args.status, args.test, args.info]):
        parser.print_help()
        return 1

    scheduler = DailySyncScheduler()

    print("🔄 Daily GitHub Sync Scheduler")
    print("=" * 40)

    if args.setup:
        success = scheduler.create_scheduled_task()
        if success:
            scheduler.show_task_info()
        return 0 if success else 1

    if args.remove:
        return 0 if scheduler.remove_scheduled_task() else 1

    if args.status:
        return 0 if scheduler.check_task_status() else 1

    if args.test:
        return 0 if scheduler.test_sync_now() else 1

    if args.info:
        scheduler.show_task_info()
        return 0

if __name__ == "__main__":
    sys.exit(main())