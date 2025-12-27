# Cleanup and Build Script for Strevo Store
# Run as Administrator in PowerShell

Write-Host "=== Strevo Store - Cleanup and Build ===" -ForegroundColor Cyan

# 1. Kill node processes
Write-Host "`n[1/6] Stopping Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# 2. Remove node_modules
Write-Host "[2/6] Removing node_modules..." -ForegroundColor Yellow
cmd /c "rd /s /q node_modules" 2>$null
if (Test-Path "node_modules") {
    Write-Host "  Warning: node_modules still exists. Try manual removal." -ForegroundColor Red
} else {
    Write-Host "  node_modules removed successfully" -ForegroundColor Green
}

# 3. Remove package-lock.json
Write-Host "[3/6] Removing package-lock.json..." -ForegroundColor Yellow
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# 4. Clear npm cache
Write-Host "[4/6] Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# 5. Reinstall dependencies
Write-Host "[5/6] Installing dependencies..." -ForegroundColor Yellow
npm install

# 6. Build
Write-Host "[6/6] Building project..." -ForegroundColor Yellow
npm run build

Write-Host "`n=== Build Complete ===" -ForegroundColor Cyan
Write-Host "If successful, you can now deploy with: vercel --prod" -ForegroundColor Green
