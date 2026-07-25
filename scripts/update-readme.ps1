[CmdletBinding()]
param(
    [switch]$Check
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$ReadmePath = Join-Path $Root "README.md"
$ComposePath = Join-Path $Root "Backend/infrastructure/docker/compose.yml"

function Get-ProjectNames {
    param([Parameter(Mandatory)][string]$RelativePath)

    $path = Join-Path $Root $RelativePath
    return @(Get-ChildItem -LiteralPath $path -Directory |
        Sort-Object Name |
        ForEach-Object Name)
}

function Format-Projects {
    param([Parameter(Mandatory)][array]$Names)

    return (($Names | ForEach-Object { "``$_``" }) -join ", ")
}

function Get-InventorySection {
    $groups = @(
        [pscustomobject]@{
            Label = "Spring Boot services"
            Names = Get-ProjectNames "Backend/services"
        }
        [pscustomobject]@{
            Label = "Go services"
            Names = Get-ProjectNames "Backend/Golang/services"
        }
        [pscustomobject]@{
            Label = "Web portals"
            Names = Get-ProjectNames "Front End/Web/apps"
        }
    )

    $rows = $groups | ForEach-Object {
        "| $($_.Label) | $($_.Names.Count) | $(Format-Projects $_.Names) |"
    }

    return @(
        "<!-- This section is maintained by scripts/update-readme.ps1. -->"
        ""
        "| Component | Count | Projects |"
        "|---|---:|---|"
        $rows
    ) -join "`n"
}

function Get-ServicePorts {
    $services = @()
    $currentService = $null
    $inServices = $false

    foreach ($line in Get-Content -LiteralPath $ComposePath) {
        if ($line -ceq "services:") {
            $inServices = $true
            continue
        }
        if ($inServices -and $line -and $line -notmatch "^ ") {
            break
        }
        if ($line -match "^  ([a-zA-Z0-9_-]+):\s*$") {
            $currentService = $Matches[1]
            continue
        }
        if ($null -eq $currentService) {
            continue
        }
        if ($line -match "[""'](\d+):\d+[""']") {
            $hostPort = [int]$Matches[1]
            if ($hostPort -ge 8080 -and $hostPort -le 8999) {
                $services += [pscustomobject]@{
                    Port = $hostPort
                    Service = $currentService
                }
            }
        }
    }

    return @($services |
        Sort-Object Port, Service -Unique)
}

function Get-PortsSection {
    $rows = Get-ServicePorts | ForEach-Object {
        "| $($_.Port) | ``$($_.Service)`` |"
    }

    return @(
        "<!-- This section is maintained by scripts/update-readme.ps1. -->"
        ""
        "| Port | Service |"
        "|---:|---|"
        $rows
    ) -join "`n"
}

function Set-GeneratedSection {
    param(
        [Parameter(Mandatory)][string]$Text,
        [Parameter(Mandatory)][string]$Name,
        [Parameter(Mandatory)][string]$Content
    )

    $start = "<!-- BEGIN GENERATED $Name -->"
    $end = "<!-- END GENERATED $Name -->"
    $pattern = "(?s)$([regex]::Escape($start)).*?$([regex]::Escape($end))"
    $matches = [regex]::Matches($Text, $pattern)
    if ($matches.Count -ne 1) {
        throw "Expected exactly one generated section named $Name."
    }
    return [regex]::Replace($Text, $pattern, "$start`n$Content`n$end")
}

$current = [IO.File]::ReadAllText($ReadmePath)
$updated = Set-GeneratedSection $current "PROJECT INVENTORY" (Get-InventorySection)
$updated = Set-GeneratedSection $updated "SERVICE PORTS" (Get-PortsSection)

if ($Check) {
    if ($current -cne $updated) {
        throw "README.md is out of date. Run scripts/update-readme.ps1."
    }
    Write-Output "README.md is up to date."
    return
}

[IO.File]::WriteAllText($ReadmePath, $updated, [Text.UTF8Encoding]::new($false))
Write-Output "README.md updated."
