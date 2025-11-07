@echo off
title Quizly Server
echo ==============================
echo   Starting Quizly Backend
echo ==============================

REM -- Check if virtual environment exists --
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

REM -- Activate venv --
call .venv\Scripts\activate

REM -- Upgrade pip silently --
python -m pip install --upgrade pip >nul

REM -- Install dependencies --
if exist requirements.txt (
    echo Installing dependencies...
    pip install -r requirements.txt
) else (
    echo WARNING: requirements.txt not found! Skipping dependency installation.
)

REM -- Start server --
echo.
echo Starting Uvicorn...
echo (Press CTRL + C to stop)
echo.
uvicorn app.quizly:app --reload

REM -- Keep window open if server crashes --
echo.
echo Server stopped or crashed.
pause
