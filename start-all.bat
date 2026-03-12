@echo off
REM Home Design AI - Complete Startup Script
REM Starts both frontend and backend servers

echo.
echo ============================================
echo Home Design AI - Agentic Design System
echo ============================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: Please run this script from the project root directory
    exit /b 1
)

REM Start backend
echo [1/2] Starting Flask Backend...
echo Backend URL: http://localhost:3000
echo.
REM Create backend venv (local) and install core deps if needed
set "BACKEND_DIR=%~dp0backend"
if not exist "%BACKEND_DIR%\venv\Scripts\python.exe" (
    echo Creating backend virtual environment...
    python -m venv "%BACKEND_DIR%\venv"
)
echo Upgrading pip/setuptools/wheel...
"%BACKEND_DIR%\venv\Scripts\python.exe" -m pip install --upgrade pip setuptools wheel
echo Installing backend dependencies (core)...
"%BACKEND_DIR%\venv\Scripts\python.exe" -m pip install -r "%BACKEND_DIR%\requirements-core.txt"

start cmd /k "cd /d backend && venv\\Scripts\\python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend
echo [2/2] Starting React Frontend...
echo Frontend URL: http://localhost:8080
echo.
start cmd /k "npm run dev"

echo.
echo ============================================
echo ✓ Both servers are starting...
echo.
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:3000
echo.
echo Ctrl+C to stop servers
echo ============================================
echo.
