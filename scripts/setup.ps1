param(
  [Parameter(Mandatory=$false)]
  [string]$MongoUri = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "`nSocialSphere setup" -ForegroundColor Cyan
Write-Host "------------------"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is not installed. Install Node.js 22 LTS or newer first."
}

if (-not (Test-Path "server/.env")) {
  Copy-Item "server/.env.example" "server/.env"
}
if (-not (Test-Path "client/.env")) {
  Copy-Item "client/.env.example" "client/.env"
}

if ($MongoUri) {
  $envPath = "server/.env"
  $lines = Get-Content $envPath
  $lines = $lines | ForEach-Object { if ($_ -match '^MONGODB_URI=') { "MONGODB_URI=$MongoUri" } else { $_ } }
  Set-Content $envPath $lines
}

$serverEnv = Get-Content "server/.env" -Raw
if ($serverEnv -match 'JWT_SECRET=replace-with-') {
  $bytes = New-Object byte[] 48
  [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
  $secret = [Convert]::ToBase64String($bytes)
  $serverEnv = $serverEnv -replace 'JWT_SECRET=.*', "JWT_SECRET=$secret"
  Set-Content "server/.env" $serverEnv
}

Write-Host "Installing root tooling..." -ForegroundColor Yellow
npm install
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install --prefix server
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install --prefix client

Write-Host "`nSetup complete." -ForegroundColor Green
Write-Host "1. Confirm server/.env contains your MongoDB URI."
Write-Host "2. Run: npm run dev"
Write-Host "3. Optional demo data: npm run seed"
