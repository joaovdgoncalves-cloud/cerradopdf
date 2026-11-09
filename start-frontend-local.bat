@echo off
title CerradoPDF - Frontend (5173)
cd /d "%~dp0frontend\editor"
call ..\node_modules\.bin\vite.cmd --mode proprietary --port 5173 --host 127.0.0.1
pause
