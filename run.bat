@echo off
title AstroPulse - NASA Astronaut Health Monitoring System
color 0B
echo =========================================================================
echo    ASTROPULSE : NASA AUTONOMOUS ASTRONAUT HEALTH MONITORING SYSTEM
echo    Deep-Space Flight Telemetry ^& Edge AI Clinical Decision Support
echo =========================================================================
echo.
echo Launching local Vite server...
start "" http://localhost:5173/
npm run dev
pause
