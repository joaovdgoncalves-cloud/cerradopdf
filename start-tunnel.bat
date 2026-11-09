@echo off
title CerradoPDF - Tunel publico (Cloudflare)
cd /d "%~dp0"

if not exist "%TEMP%\cloudflared.exe" (
  echo Baixando cloudflared (uma vez, ~50MB)...
  curl -L -o "%TEMP%\cloudflared.exe" "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
  if errorlevel 1 ( echo ERRO ao baixar cloudflared. & pause & exit /b 1 )
)

echo.
echo ============================================
echo  A URL PUBLICA aparece abaixo, na linha
echo  https://xxxx-yyyy.trycloudflare.com
echo ============================================
echo.
"%TEMP%\cloudflared.exe" tunnel --url http://127.0.0.1:5173 --no-autoupdate
pause
