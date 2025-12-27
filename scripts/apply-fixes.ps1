# Apply Performance Fixes Script
Write-Host "=== APPLYING PERFORMANCE FIXES ===" -ForegroundColor Cyan

Write-Host "`n1. Backing up current files..." -ForegroundColor Yellow
Copy-Item "lib\cache\redis.ts" "lib\cache\redis.ts.backup"
Copy-Item "app\api\products\route.ts" "app\api\products\route.ts.backup"

Write-Host "`n2. Replacing with enhanced versions..." -ForegroundColor Yellow
Copy-Item "lib\cache\redis-enhanced.ts" "lib\cache\redis.ts" -Force
Copy-Item "app\api\products\route-enhanced.ts" "app\api\products\route.ts" -Force

Write-Host "`n3. Installing dependencies..." -ForegroundColor Yellow
npm install ioredis axios

Write-Host "`n=== FIXES APPLIED ===" -ForegroundColor Green
Write-Host "Restart dev server: npm run dev"
