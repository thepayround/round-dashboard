@echo off
setlocal enabledelayedexpansion

:: Run All Services Script (Windows)
:: This script runs both the frontend (Vite) and backend (.NET API) services
:: If one project is not found, it will log and run the one that exists

set "SCRIPT_DIR=%~dp0"
set "FRONTEND_DIR=%SCRIPT_DIR%.."
set "BACKEND_DIR=%SCRIPT_DIR%..\..\Round"

echo ========================================
echo    Round Dashboard - Service Runner
echo ========================================
echo.

:: Check what's available
set FRONTEND_AVAILABLE=0
set BACKEND_AVAILABLE=0

if exist "%FRONTEND_DIR%\package.json" (
    set FRONTEND_AVAILABLE=1
    echo [OK] Frontend found: %FRONTEND_DIR%
) else (
    echo [WARN] Frontend not found: %FRONTEND_DIR%
)

if exist "%BACKEND_DIR%\Round.sln" (
    set BACKEND_AVAILABLE=1
    echo [OK] Backend found: %BACKEND_DIR%
) else (
    echo [WARN] Backend not found: %BACKEND_DIR%
)

echo.

:: Exit if nothing is available
if %FRONTEND_AVAILABLE%==0 if %BACKEND_AVAILABLE%==0 (
    echo [ERROR] No projects found. Exiting.
    exit /b 1
)

:: Start services in separate windows
if %BACKEND_AVAILABLE%==1 (
    echo Starting backend (.NET API^)...
    start "Round API - Backend" cmd /k "cd /d %BACKEND_DIR% && dotnet run --project src/Round.Application/Round.Application.csproj"
    echo Backend started in new window
)

if %FRONTEND_AVAILABLE%==1 (
    echo Starting frontend (Vite^)...
    start "Round Dashboard - Frontend" cmd /k "cd /d %FRONTEND_DIR% && npm run dev"
    echo Frontend started in new window
)

echo.
echo ========================================
echo    Services are running!
echo ========================================

if %FRONTEND_AVAILABLE%==1 (
    echo    Frontend: http://localhost:5173
)

if %BACKEND_AVAILABLE%==1 (
    echo    Backend:  http://localhost:5000
)

echo.
echo Services are running in separate windows.
echo Close those windows to stop the services.
echo.

endlocal
