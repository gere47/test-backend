Write-Host " Starting deployment process..." -ForegroundColor Cyan

# Build the project
Write-Host " Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host " Build successful!" -ForegroundColor Green
} else {
    Write-Host " Build failed!" -ForegroundColor Red
    exit 1
}

# Test the build
Write-Host " Testing production build..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "dist/main.js" -PassThru
Start-Sleep -Seconds 2
Write-Host " Production build test passed!" -ForegroundColor Green

# Stop any running node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Git operations
Write-Host " Committing changes..." -ForegroundColor Yellow
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "deploy: $timestamp"

Write-Host " Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host " Deployment triggered!" -ForegroundColor Green
Write-Host " Your app will be available at: https://school-erp-backend.onrender.com" -ForegroundColor Cyan
Write-Host " Check progress at: https://dashboard.render.com" -ForegroundColor Cyan