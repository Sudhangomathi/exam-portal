@echo off
:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Administrator privileges confirmed.
) else (
    echo WARNING: You MUST right-click this file and select "Run as administrator"!
    echo.
    pause
    exit /b
)

:: Append the local domain mapping to the hosts file
echo. >> %SystemRoot%\System32\drivers\etc\hosts
echo 127.0.0.1       graduatesportal >> %SystemRoot%\System32\drivers\etc\hosts
echo 127.0.0.1       graduates-portal >> %SystemRoot%\System32\drivers\etc\hosts

echo =======================================================
echo Local host mappings successfully added!
echo You can now open http://graduatesportal in your browser.
echo =======================================================
echo.
pause
