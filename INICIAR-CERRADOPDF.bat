@echo off
title CerradoPDF - Inicializador
cd /d "%~dp0"
set ROOT=%~dp0

echo ============================================
echo   CerradoPDF - UniCerrado
echo   Inicializacao automatica
echo ============================================
echo.

rem ---------- [1/4] Java 21 ----------
echo [1/4] Verificando Java 21...
if exist "%USERPROFILE%\.cerradopdf" (
  for /d %%i in ("%USERPROFILE%\.cerradopdf\jdk-*") do (
    set "JAVA_HOME=%%i"
    set "PATH=%%i\bin;%PATH%"
  )
  goto java_ok
)
where java >nul 2>nul
if %errorlevel%==0 goto java_ok

echo     Java nao encontrado. Baixando JDK 21 portatil (uma vez, ~190MB)...
mkdir "%USERPROFILE%\.cerradopdf" 2>nul
curl -L -o "%USERPROFILE%\.cerradopdf\jdk.zip" "https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse"
if errorlevel 1 ( echo ERRO ao baixar o JDK. & pause & exit /b 1 )
powershell -Command "Expand-Archive -Force -Path '%USERPROFILE%\.cerradopdf\jdk.zip' -DestinationPath '%USERPROFILE%\.cerradopdf\'"
del "%USERPROFILE%\.cerradopdf\jdk.zip"
for /d %%i in ("%USERPROFILE%\.cerradopdf\jdk-*") do (
  set "JAVA_HOME=%%i"
  set "PATH=%%i\bin;%PATH%"
)
:java_ok
java -version 2>&1 | findstr /i "version"

rem ---------- [2/4] Node.js ----------
echo [2/4] Verificando Node.js...
if exist "%TEMP%\cerradopdf-node\node.exe" (
  set "PATH=%TEMP%\cerradopdf-node;%PATH%"
  goto node_ok
)
where node >nul 2>nul
if %errorlevel%==0 goto node_ok

echo     Node nao encontrado. Baixando Node.js portatil (uma vez, ~30MB)...
curl -L -o "%TEMP%\node.zip" "https://nodejs.org/dist/v22.11.0/node-v22.11.0-win-x64.zip"
if errorlevel 1 ( echo ERRO ao baixar o Node.js. & pause & exit /b 1 )
tar -xf "%TEMP%\node.zip" -C "%TEMP%"
move "%TEMP%\node-v22.11.0-win-x64" "%TEMP%\cerradopdf-node" >nul
del "%TEMP%\node.zip"
set "PATH=%TEMP%\cerradopdf-node;%PATH%"
:node_ok
node --version

rem ---------- [3/4] Dependencias do frontend ----------
echo [3/4] Verificando dependencias do frontend...
if not exist "%ROOT%frontend\node_modules\.bin\vite.cmd" (
  echo     Instalando dependencias (npm ci - primeira vez demora alguns minutos)...
  cd /d "%ROOT%frontend"
  call npm ci --no-audit --no-fund
  if errorlevel 1 ( echo ERRO no npm ci. & pause & exit /b 1 )
  cd /d "%ROOT%"
) else (
  echo     OK - node_modules ja existe.
)

rem ---------- [4/4] Subir os processos ----------
echo [4/4] Iniciando backend e frontend...
start "CerradoPDF - Backend (8080)" cmd /k "%ROOT%start-backend-local.bat"
timeout /t 5 /nobreak >nul
start "CerradoPDF - Frontend (5173)" cmd /k "%ROOT%start-frontend-local.bat"

echo.
echo ============================================
echo   CerradoPDF iniciando!
echo   O navegador abre sozinho quando estiver pronto.
echo.
echo   Para desligar, feche as janelas backend/frontend.
echo   Para expor na internet, rode: start-tunnel.bat
echo ============================================

rem --- Aguarda o frontend responder e abre o navegador (max ~3 min) ---
set TRIES=0
:wait_frontend
curl -s -o nul http://127.0.0.1:5173/ --max-time 3
if %errorlevel%==0 goto open_browser
set /a TRIES+=1
if %TRIES% GEQ 60 goto timeout_frontend
timeout /t 3 /nobreak >nul
goto wait_frontend

:open_browser
echo.
echo   Pronto! Abrindo http://127.0.0.1:5173
start "" http://127.0.0.1:5173
goto fim

:timeout_frontend
echo.
echo   O frontend demorou demais. Verifique a janela "CerradoPDF - Frontend".

:fim
pause
