# Baseline Performance Test Script
Write-Host "=== BASELINE PERFORMANCE TEST ===" -ForegroundColor Cyan
Write-Host ""

$BASE_URL = "http://localhost:3000"

Write-Host "1. Testing API endpoints..." -ForegroundColor Yellow
node scripts/collect-timings.js "$BASE_URL/api/products?limit=4" 100

Write-Host "`n2. Running autocannon stress test..." -ForegroundColor Yellow
npx autocannon -c 100 -d 30 "$BASE_URL/api/products?limit=4"

Write-Host "`n3. Running k6 local test..." -ForegroundColor Yellow
k6 run k6/local-test.js

Write-Host "`n=== BASELINE COMPLETE ===" -ForegroundColor Green
Write-Host "Save these results before applying fixes"
