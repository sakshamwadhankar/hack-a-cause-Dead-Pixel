@echo off
echo ================================================
echo    Starting JalRakshak - Complete System
echo ================================================
echo.

echo [1/4] Finding Your Computer IP...
py backend/find_ip.py
echo.

echo [2/4] Starting Backend API Server...
echo (Running on all network interfaces for Android access)
start "JalRakshak Backend" cmd /k "cd backend && py -m uvicorn main:app --host 0.0.0.0 --reload --port 8000"
timeout /t 3 /nobreak >nul

echo [3/4] Starting Collector Dashboard...
start "JalRakshak Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo [4/4] Starting Driver Web App...
start "JalRakshak Driver" cmd /k "cd frontend-driver && npm run dev -- --port 5174 --host"
timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo    All Services Started Successfully!
echo ================================================
echo.
echo Backend API:       http://localhost:8000
echo API Docs:          http://localhost:8000/docs
echo Collector App:     http://localhost:5173
echo Driver Web App:    http://localhost:5174
echo.
echo ================================================
echo    Android Studio Setup
echo ================================================
echo.
echo To build Android APK:
echo   cd frontend-driver
echo   npm install
echo   npm run build
echo   npx cap add android
echo   npx cap sync android
echo   npx cap open android
echo.
echo ================================================
echo    Driver App Installation
echo ================================================
echo.
echo Method 1 - PWA (Same WiFi):
echo   1. Open Chrome on Android phone
echo   2. Go to: http://[YOUR-IP]:5174
echo   3. Menu → Add to Home Screen
echo.
echo Method 2 - Android Studio APK:
echo   1. Follow Android Studio Setup above
echo   2. Click Run in Android Studio
echo   3. Select your phone or emulator
echo.
echo Demo Credentials:
echo   Phone: 9876543210 (Ramesh Patil - Latur)
echo   Phone: 9321098765 (Ravi Thakur - Nagpur)
echo   OTP: Shown on screen (DEMO_MODE=true)
echo.
echo ================================================
pause
