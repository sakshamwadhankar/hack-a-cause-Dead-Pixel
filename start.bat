@echo off
echo ========================================
echo    Starting JalRakshak System
echo ========================================
echo.
echo Starting Backend Server...
start "JalRakshak Backend" cmd /k "cd backend && py -m uvicorn main:app --reload --port 8000"
echo Backend starting on http://localhost:8000
echo.
timeout /t 5 /nobreak
echo Starting Frontend Server...
start "JalRakshak Frontend" cmd /k "cd frontend && npm run dev"
echo Frontend starting on http://localhost:5173
echo.
echo ========================================
echo    JalRakshak is starting...
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit this window...
pause > nul
