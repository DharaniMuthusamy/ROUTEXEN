<#
Start both backend and frontend in separate PowerShell windows.

Usage:
  .\start-dev.ps1
  # or override venv path:
  .\start-dev.ps1 -VenvActivate 'D:\path\to\.venv\Scripts\Activate.ps1'

Edit the default $VenvActivate if your virtualenv is located elsewhere.
#>

param(
    [string]$VenvActivate = "d:\New folder\.venv\Scripts\Activate.ps1"
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

Write-Host "Starting backend and frontend from:`n  Backend: $backend`n  Frontend: $frontend`nUsing venv activate: $VenvActivate"

# Backend command: activate venv, cd into backend, run uvicorn
$backendCmd = "& `"$VenvActivate`"; cd `"$backend`"; python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# Frontend command: cd into frontend and run dev server
$frontendCmd = "cd `"$frontend`"; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "Launched backend and frontend in separate windows."
