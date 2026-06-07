@echo off
REM ===================================================================
REM  Routermill bot - run it. Double-click this each time.
REM  It looks for router_queue.csv in this folder (and your Downloads),
REM  then provisions every router in the queue. Close the window to stop.
REM ===================================================================
cd /d "%~dp0"
python main.py
pause
