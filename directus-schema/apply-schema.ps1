# ============================================================
# Aster Homecare — Directus Schema + Seed Setup Script
# Run from the project root: .\directus-schema\apply-schema.ps1
# ============================================================

param(
    [string]$DirectusUrl = "http://localhost:8055",
    [string]$AdminEmail = "admin@asterhomecare.co.uk",
    [string]$AdminPassword = "AsterAdmin2024!"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Aster Homecare — Directus Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Wait for Directus to be ready ─────────────────────────────────────
Write-Host "Waiting for Directus to start..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
do {
    $attempt++
    try {
        $health = Invoke-RestMethod -Uri "$DirectusUrl/server/health" -Method GET -ErrorAction Stop
        if ($health.status -eq "ok") { break }
    } catch {
        if ($attempt -ge $maxAttempts) {
            Write-Error "Directus did not become healthy after $maxAttempts attempts. Is Docker running?"
            exit 1
        }
        Write-Host "  Attempt $attempt/$maxAttempts — waiting 5s..." -ForegroundColor Gray
        Start-Sleep -Seconds 5
    }
} while ($true)
Write-Host "✓ Directus is healthy." -ForegroundColor Green

# ── Step 2: Authenticate ──────────────────────────────────────────────────────
Write-Host ""
Write-Host "Authenticating as admin..." -ForegroundColor Yellow
$loginBody = @{ email = $AdminEmail; password = $AdminPassword } | ConvertTo-Json
$loginResponse = Invoke-RestMethod `
    -Uri "$DirectusUrl/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody
$token = $loginResponse.data.access_token
Write-Host "✓ Authenticated. Token obtained." -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

# ── Step 3: Apply Schema Snapshot ─────────────────────────────────────────────
Write-Host ""
Write-Host "Applying schema snapshot..." -ForegroundColor Yellow

$schemaPath = Join-Path $PSScriptRoot "schema-snapshot.json"
$schemaJson = Get-Content -Raw -Path $schemaPath

# First get the diff to see what needs to change
try {
    $diffResponse = Invoke-RestMethod `
        -Uri "$DirectusUrl/schema/diff" `
        -Method POST `
        -Headers $headers `
        -Body $schemaJson

    if ($null -eq $diffResponse.data -or ($diffResponse.data.collections.Count -eq 0 -and $diffResponse.data.fields.Count -eq 0)) {
        Write-Host "  Schema is already up to date — no changes needed." -ForegroundColor Gray
    } else {
        # Apply the diff
        $applyResponse = Invoke-RestMethod `
            -Uri "$DirectusUrl/schema/apply" `
            -Method POST `
            -Headers $headers `
            -Body ($diffResponse.data | ConvertTo-Json -Depth 20)
        Write-Host "✓ Schema applied successfully." -ForegroundColor Green
    }
} catch {
    Write-Warning "Schema diff/apply failed: $($_.Exception.Message)"
    Write-Warning "You may need to apply the schema manually via the Directus admin UI."
}

# ── Step 4: Create a static API token for Next.js ─────────────────────────────
Write-Host ""
Write-Host "Creating static API token for Next.js..." -ForegroundColor Yellow

# Get current admin user ID
$meResponse = Invoke-RestMethod -Uri "$DirectusUrl/users/me" -Headers $headers
$adminUserId = $meResponse.data.id

$tokenBody = @{
    name   = "nextjs-frontend"
    token  = "aster-nextjs-static-token-change-in-production"
    user   = $adminUserId
} | ConvertTo-Json

try {
    $tokenResponse = Invoke-RestMethod `
        -Uri "$DirectusUrl/users/me" `
        -Method PATCH `
        -Headers $headers `
        -Body (@{ token = "aster-nextjs-static-token-change-in-production" } | ConvertTo-Json)
    Write-Host "✓ Static token set on admin user." -ForegroundColor Green
} catch {
    Write-Warning "Could not set token automatically: $($_.Exception.Message)"
}

# ── Step 5: Set public read permissions ───────────────────────────────────────
Write-Host ""
Write-Host "Setting public read permissions..." -ForegroundColor Yellow

$collections = @("services", "testimonials", "job_openings", "team")
foreach ($collection in $collections) {
    $permBody = @{
        role       = $null   # null = public role
        collection = $collection
        action     = "read"
        fields     = "*"
        permissions = @{}
        validation  = @{}
    } | ConvertTo-Json -Depth 5

    try {
        Invoke-RestMethod `
            -Uri "$DirectusUrl/permissions" `
            -Method POST `
            -Headers $headers `
            -Body $permBody | Out-Null
        Write-Host "  ✓ Public read permission set for: $collection" -ForegroundColor Green
    } catch {
        Write-Warning "  Could not set permission for $collection — may already exist."
    }
}

# ── Step 6: Seed Data ──────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Seeding collections with sample data..." -ForegroundColor Yellow

$seedPath = Join-Path $PSScriptRoot "seed-data.json"
$seedData = Get-Content -Raw -Path $seedPath | ConvertFrom-Json

$seedCollections = @("services", "testimonials", "job_openings", "team")

foreach ($col in $seedCollections) {
    $items = $seedData.$col
    if ($null -eq $items -or $items.Count -eq 0) { continue }

    # Check if collection already has data
    $existingResponse = Invoke-RestMethod `
        -Uri "$DirectusUrl/items/$col`?aggregate[count]=*" `
        -Headers $headers
    $existingCount = $existingResponse.data[0].count

    if ([int]$existingCount -gt 0) {
        Write-Host "  Skipping '$col' — already has $existingCount record(s)." -ForegroundColor Gray
        continue
    }

    foreach ($item in $items) {
        $itemJson = $item | ConvertTo-Json -Depth 10
        try {
            Invoke-RestMethod `
                -Uri "$DirectusUrl/items/$col" `
                -Method POST `
                -Headers $headers `
                -Body $itemJson | Out-Null
        } catch {
            Write-Warning "  Failed to seed item in '$col': $($_.Exception.Message)"
        }
    }
    Write-Host "  ✓ Seeded $($items.Count) record(s) into '$col'." -ForegroundColor Green
}

# ── Step 7: Write .env.local ───────────────────────────────────────────────────
Write-Host ""
Write-Host "Writing .env.local for Next.js..." -ForegroundColor Yellow

$envPath = Join-Path (Split-Path $PSScriptRoot -Parent) ".env.local"
$envContent = @"
NEXT_PUBLIC_DIRECTUS_URL=$DirectusUrl
DIRECTUS_TOKEN=aster-nextjs-static-token-change-in-production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
"@

if (-not (Test-Path $envPath)) {
    Set-Content -Path $envPath -Value $envContent
    Write-Host "✓ .env.local created." -ForegroundColor Green
} else {
    Write-Host "  .env.local already exists — not overwriting." -ForegroundColor Gray
    Write-Host "  Ensure these values are set:" -ForegroundColor Gray
    Write-Host "    NEXT_PUBLIC_DIRECTUS_URL=$DirectusUrl" -ForegroundColor Gray
    Write-Host "    DIRECTUS_TOKEN=aster-nextjs-static-token-change-in-production" -ForegroundColor Gray
}

# ── Done ───────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Directus Admin:  $DirectusUrl/admin" -ForegroundColor White
Write-Host "Email:           $AdminEmail" -ForegroundColor White
Write-Host "Password:        $AdminPassword" -ForegroundColor White
Write-Host ""
Write-Host "Next: npm run dev   →  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Change the admin password and API token before deploying to production!" -ForegroundColor Red
Write-Host ""
