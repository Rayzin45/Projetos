@echo off
setlocal
cd /d "%~dp0"
where docker >nul 2>&1
if errorlevel 1 (
  echo Docker nao foi encontrado. Instale/inicie o Docker Desktop e consulte README.md.
  pause
  exit /b 1
)
echo Iniciando banco PostgreSQL e sistema web...
docker compose up --build -d
if errorlevel 1 (
  echo Falha ao iniciar. Abra o Docker Desktop e tente novamente.
  pause
  exit /b 1
)
echo Sistema iniciado. URL: http://localhost:3000
echo Caso a pagina ainda nao esteja disponivel, atualize apos a inicializacao dos servicos.
start "" "http://localhost:3000"
pause
