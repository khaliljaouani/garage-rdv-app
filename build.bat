@echo off
setlocal

:: 🧹 Supprimer les anciens builds
rmdir /s /q release

:: 🔨 Build React + Electron
call npm run build:react
call npm run build:electron

:: 📆 Obtenir la date au format YYYY-MM-DD
for /f %%i in ('powershell -command "Get-Date -Format yyyy-MM-dd"') do set DATE=%%i

:: 📝 Renommer le .exe avec la date
rename "release\GarageRDV Setup 1.0.1.exe" "GarageRDV Setup %DATE%.exe"

echo ✅ Build terminé : release\GarageRDV Setup %DATE%.exe
pause
