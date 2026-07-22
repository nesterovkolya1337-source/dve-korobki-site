@echo off
cd /d %~dp0
call npm run check
if errorlevel 1 pause & exit /b 1
start http://localhost:4321
call npm run preview
