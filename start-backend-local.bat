@echo off
title CerradoPDF - Backend (8080)
cd /d "%~dp0"

rem --- Java ---
if exist "%TEMP%\jdk21\jdk-21.0.12.1+1\bin\java.exe" (
  set "JAVA_HOME=%TEMP%\jdk21\jdk-21.0.12.1+1"
  set "PATH=%JAVA_HOME%\bin;%PATH%"
) else (
  for /d %%i in ("%TEMP%\cerradopdf-jdk\jdk-*") do (
    set "JAVA_HOME=%%i"
    set "PATH=%%i\bin;%PATH%"
  )
)

rem --- Config local ---
set UI_APPNAMENAVBAR=CerradoPDF
set SYSTEM_DEFAULTLOCALE=pt-BR
set SYSTEM_BACKENDURL=http://localhost:8080
set SECURITY_INITIALLOGIN_USERNAME=admin
set SECURITY_INITIALLOGIN_PASSWORD=admin123

rem --- Login Google: so ativa se existir oauth-local.env (arquivo local, nao vai pro Git) ---
set SECURITY_ENABLELOGIN=false
if exist "%~dp0oauth-local.env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%a in ("%~dp0oauth-local.env") do set "%%a=%%b"
  set SECURITY_ENABLELOGIN=true
  echo Login Google ATIVADO ^(oauth-local.env encontrado^)
) else (
  echo SEM login ^(modo livre^). Para ativar o Google, crie oauth-local.env
  echo a partir de oauth-local.env.example com suas credenciais.
)

call gradlew.bat :stirling-pdf:bootRun --console=plain
pause
