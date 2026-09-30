@echo off
REM ============================================================
REM  PIZZARIA LOBO - Deploy automatico para Vercel
REM  Uso: duplo clique ou executar "deploy.bat" no terminal
REM ============================================================

echo.
echo ========================================
echo   PIZZARIA LOBO - Deploy para Vercel
echo ========================================
echo.

REM --- Verifica se o git esta instalado ---
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Git nao encontrado. Instale em: https://git-scm.com
    pause
    exit /b 1
)

REM --- Verifica se esta em um repositorio git ---
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Nao e um repositorio git. Execute: git init
    pause
    exit /b 1
)

REM --- Verifica se a Vercel CLI esta instalada ---
npx vercel --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Instalando Vercel CLI...
    npm install -g vercel
)

REM --- Build de producao ---
echo.
echo [1/4] Rodando build de producao...
call npm run build
if errorlevel 1 (
    echo.
    echo [ERRO] Build falhou. Corrija os erros antes de deployar.
    pause
    exit /b 1
echo [OK] Build concluido.

REM --- Git add + commit ---
echo.
echo [2/4] Preparando arquivos para commit...
git add -A

set /p MSG="Mensagem de commit (Enter = 'atualizacao'): "
if "%MSG%"=="" set MSG=atualizacao

git commit -m "%MSG%"
if errorlevel 1 (
    echo [INFO] Nada para commit ou commit falhou.
)

REM --- Push para o repositorio remoto ---
echo.
echo [3/4] Enviando para o GitHub/GitLab...
git push
if errorlevel 1 (
    echo [ERRO] Push falhou. Verifique sua conexao e permissoes.
    pause
    exit /b 1
echo [OK] Push concluido.

REM --- Deploy na Vercel ---
echo.
echo [4/4] Deployando na Vercel...
npx vercel --prod --yes
if errorlevel 1 (
    echo [ERRO] Deploy falhou. Verifique se o projeto esta linkado na Vercel.
    pause
    exit /b 1
echo.
echo ========================================
echo   DEPLOY CONCLUIDO COM SUCESSO!
echo ========================================
echo.
pause
