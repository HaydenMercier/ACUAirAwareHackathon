@echo off
echo Starting Smokestack MVP...

echo.
echo Starting Backend Server...
start cmd /k "cd backend && npm install && npm run dev"

timeout /t 3

echo.
echo Starting Frontend Development Server...
start cmd /k "cd frontend && npm install && npm start"

echo.
echo Smokestack is starting up!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
pause