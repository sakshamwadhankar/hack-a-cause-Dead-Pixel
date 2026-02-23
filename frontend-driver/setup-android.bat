@echo off
echo ================================================
echo    JalRakshak Driver - Android Setup
echo ================================================
echo.

echo [1/4] Installing dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/4] Building web app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/4] Syncing to Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed
    pause
    exit /b 1
)

echo.
echo [4/4] Opening Android Studio...
call npx cap open android

echo.
echo ================================================
echo    Setup Complete!
echo ================================================
echo.
echo Next steps in Android Studio:
echo 1. Wait for Gradle sync to complete
echo 2. Click the green Run button (play icon)
echo 3. Select your Android device or emulator
echo 4. App will install and launch!
echo.
echo ================================================
pause
