@echo off
REM ===================================================================
REM  Routermill bot - one-time setup. Double-click this file once.
REM  (Requires Python 3.10+ installed from python.org with "Add to PATH".)
REM ===================================================================
cd /d "%~dp0"

echo Installing Python dependencies...
python -m pip install -r requirements.txt
if errorlevel 1 goto :pyfail

echo Installing the browser engine (Playwright Chromium)...
python -m playwright install chromium
if errorlevel 1 goto :pyfail

echo.
echo ============================================
echo  Setup complete. Double-click run.bat to go.
echo ============================================
pause
exit /b 0

:pyfail
echo.
echo Could not run Python. Install Python 3.10+ from https://python.org
echo and tick "Add Python to PATH", then run this again.
pause
exit /b 1
