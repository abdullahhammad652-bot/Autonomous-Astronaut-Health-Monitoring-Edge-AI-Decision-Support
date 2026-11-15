@echo off
title AstroPulse High-Scale Telemetry Backend
color 0A
echo =========================================================================
echo    ASTROPULSE : HIGH-SCALE DISTRIBUTED BACKEND & CLUSTER CONTROLLER
echo    Multi-Core Cluster | Redis Cache | Rate Limiter | Job Queue
echo =========================================================================
echo.
echo Launching clustered backend on port 5000 across CPU cores...
node index.js --cluster
pause
