[CmdletBinding()]
param([string]$Container = "game-aggregator-mysql-1")
$ErrorActionPreference = "Stop"
$seedPath = Join-Path $PSScriptRoot "full-development.sql"
if (-not (Test-Path -LiteralPath $seedPath)) { throw "Seed file was not found: $seedPath" }
$running = docker inspect $Container --format "{{.State.Running}}" 2>$null
if ($running -ne "true") { throw "Local MySQL container '$Container' is not running." }
$rootPassword = (docker inspect $Container --format "{{range .Config.Env}}{{println .}}{{end}}" | Select-String "^MYSQL_ROOT_PASSWORD=").ToString().Substring(20)
Get-Content -LiteralPath $seedPath -Raw | docker exec -i -e "MYSQL_PWD=$rootPassword" $Container mysql -uroot
if ($LASTEXITCODE -ne 0) { throw "Development seed failed with exit code $LASTEXITCODE." }
Write-Host "Full development dataset loaded successfully."
