@echo off
REM Daily GitHub Sync Setup - Run as Administrator
REM This script sets up automated daily GitHub sync at 7pm

echo 🚀 Setting up Daily GitHub Sync...
echo.

cd /d "%~dp0"

powershell -Command "Start-Process python 'execution/schedule_github_sync.py' -ArgumentList '--setup' -Verb RunAs -Wait"

echo.
echo ✅ Setup complete! Check the output above for results.
echo.
pause