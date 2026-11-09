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

rem --- Login Google (padrao: ativado) ---
set SECURITY_ENABLELOGIN=true
set SECURITY_LOGINMETHOD=oauth2
set SECURITY_OAUTH2_ENABLED=true
set SECURITY_OAUTH2_PROVIDER=google
set SECURITY_OAUTH2_CLIENT_GOOGLE_CLIENTID=992822893438-3oad48lnvqkhiapidesik78pg70dqrpn.apps.googleusercontent.com
set SECURITY_OAUTH2_CLIENT_GOOGLE_CLIENTSECRET=REMOVIDO-DO-HISTORICO
set SECURITY_OAUTH2_USEASUSERNAME=email
set SECURITY_OAUTH2_AUTOCREATEUSER=true
set SECURITY_ALLOWEDEMAILDOMAINS=alunos.unicerrado.edu.br,unicerrado.edu.br,gmail.com

rem --- Overrides locais opcionais (oauth-local.env, fora do Git) ---
if exist "%~dp0oauth-local.env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%a in ("%~dp0oauth-local.env") do set "%%a=%%b"
)

call gradlew.bat :stirling-pdf:bootRun --console=plain
pause
