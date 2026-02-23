@echo off
echo ================================================
echo    Starting JalRakshak - Complete System
echo ================================================
echo.

echo [1/3] Starting Backend API Server...
start "JalRakshak Backend" cmd /k "cd backend && py -m uvicorn main:app --reload --port 8000"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Collector Dashboard...
start "JalRakshak Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo [3/3] Starting Driver Mobile App...
start "JalRakshak Driver" cmd /k "cd frontend-driver && npm run dev -- --port 5174"
timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo    All Services Started Successfully!
echo ================================================
echo.
echo Backend API:       http://localhost:8000
echo API Docs:          http://localhost:8000/docs
echo Collector App:     http://localhost:5173
echo Driver App:        http://localhost:5174
echo.
echo ================================================
echo    Driver App Installation
echo ================================================
echo.
echo On Android Phone (Same WiFi):
echo 1. Find your IP: ipconfig
echo 2. Open Chrome on phone
echo 3. Go to: http://[YOUR-IP]:5174
echo 4. Menu → Add to Home Screen
echo.
echo Demo Credentials:
echo Phone: 9876543210 (Ramesh Patil - Latur)
echo Phone: 9321098765 (Ravi Thakur - Nagpur)
echo.
echo ================================================
pause
