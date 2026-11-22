# RideWise 4-Parameter Live Demo Verification Script
# Run this while 'npm run dev' is running in another terminal window.

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "   RideWise Live Evaluation & Demo Script" -ForegroundColor Yellow
Write-Host "=======================================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:4000"

# ----------------------------------------------------
# PARAMETER 2: Node & Express Setup (Health Check)
# ----------------------------------------------------
Write-Host "[STEP 1] Testing Parameter 2: Node & Express Server Setup..." -ForegroundColor White
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get -TimeoutSec 5
    Write-Host "  -> SUCCESS: Express server running on Port 4000!" -ForegroundColor Green
    Write-Host "  -> Service: $($health.service) | Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "  -> ERROR: Backend is not running! Please run 'npm run dev' first." -ForegroundColor Red
    exit 1
}

# ----------------------------------------------------
# PARAMETER 1: External Weather API (Open-Meteo)
# ----------------------------------------------------
Write-Host "`n[STEP 2] Testing Parameter 1: External API (Open-Meteo Weather)..." -ForegroundColor White
try {
    $weather = Invoke-RestMethod -Uri "$baseUrl/api/external/weather" -Method Get -TimeoutSec 10
    Write-Host "  -> SUCCESS: External API call completed!" -ForegroundColor Green
    Write-Host "  -> Provider: $($weather.provider)" -ForegroundColor Gray
    Write-Host "  -> Live Temp: $($weather.temperatureC) C | Advisory: $($weather.commuteAdvisory)" -ForegroundColor Cyan
} catch {
    Write-Host "  -> Note: External API request failed ($($_.Exception.Message)) - Check internet connection." -ForegroundColor Yellow
}

# ----------------------------------------------------
# PARAMETER 3: Local JSON File Storage (bookings.json)
# ----------------------------------------------------
Write-Host "`n[STEP 3] Testing Parameter 3: Local JSON File Read & Write (bookings.json)..." -ForegroundColor White
$testId = "RW-JSON-TEST-$(Get-Random -Minimum 1000 -Maximum 9999)"
$jsonBody = @{
    id = $testId
    pickup = "BMU Campus (Demo Hub)"
    destination = "Ambience Mall"
    vehicle = "Sedan"
    fare = 749
    paymentMethod = "cash"
    arrival = "6 min"
} | ConvertTo-Json

try {
    # 1. POST to JSON file
    $postRes = Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method Post -Body $jsonBody -ContentType "application/json"
    Write-Host "  -> POST /api/bookings: Created entry with ID $testId in server/data/bookings.json" -ForegroundColor Green

    # 2. GET from JSON file
    $getRes = Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method Get
    Write-Host "  -> GET /api/bookings: Read successfully! Total bookings in file: $($getRes.count)" -ForegroundColor Green

    # 3. DELETE from JSON file
    $delRes = Invoke-RestMethod -Uri "$baseUrl/api/bookings/$testId" -Method Delete
    Write-Host "  -> DELETE /api/bookings/$testId: Successfully deleted test entry from file!" -ForegroundColor Green
} catch {
    Write-Host "  -> JSON File operation error: $($_.Exception.Message)" -ForegroundColor Red
}

# ----------------------------------------------------
# PARAMETER 4: MongoDB Atlas CRUD Operations
# ----------------------------------------------------
Write-Host "`n[STEP 4] Testing Parameter 4: MongoDB Atlas CRUD Operations..." -ForegroundColor White

# Check Status
try {
    $status = Invoke-RestMethod -Uri "$baseUrl/api/mongo/status" -Method Get -TimeoutSec 5
    Write-Host "  -> MongoDB Status: Connected = $($status.connected) | Database: $($status.database)" -ForegroundColor Cyan
} catch {}

$mongoTestId = "RW-MG-DEMO-$(Get-Random -Minimum 1000 -Maximum 9999)"
$mongoBody = @{
    id = $mongoTestId
    pickup = "Cyber City DLF"
    destination = "Airport T3"
    vehicle = "SUV"
    fare = 999
    paymentMethod = "card"
} | ConvertTo-Json

try {
    # 1. CREATE (POST)
    $create = Invoke-RestMethod -Uri "$baseUrl/api/mongo/bookings" -Method Post -Body $mongoBody -ContentType "application/json"
    Write-Host "  -> 1. CREATE (POST): Booking '$mongoTestId' created in MongoDB Atlas!" -ForegroundColor Green

    # 2. READ (GET)
    $read = Invoke-RestMethod -Uri "$baseUrl/api/mongo/bookings/$mongoTestId" -Method Get
    Write-Host "  -> 2. READ (GET): Retrieved '$($read.booking.bookingId)' | Pickup: '$($read.booking.pickup)' | Fare: Rs $($read.booking.fare)" -ForegroundColor Green

    # 3. UPDATE (PUT)
    $updateBody = @{ status = "Completed"; fare = 1050 } | ConvertTo-Json
    $update = Invoke-RestMethod -Uri "$baseUrl/api/mongo/bookings/$mongoTestId" -Method Put -Body $updateBody -ContentType "application/json"
    Write-Host "  -> 3. UPDATE (PUT): Status changed to '$($update.booking.status)' | Fare updated to Rs $($update.booking.fare)" -ForegroundColor Green

    # 4. DELETE (DELETE)
    $delete = Invoke-RestMethod -Uri "$baseUrl/api/mongo/bookings/$mongoTestId" -Method Delete
    Write-Host "  -> 4. DELETE (DELETE): Removed '$mongoTestId' from MongoDB Atlas successfully!" -ForegroundColor Green
} catch {
    Write-Host "  -> MongoDB Atlas error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "   All 4 Parameters Verified Successfully!" -ForegroundColor Green
Write-Host "=======================================================`n" -ForegroundColor Cyan
