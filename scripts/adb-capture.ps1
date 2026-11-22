param(
    [Parameter(Mandatory = $true)]
    [string]$Serial,

    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z0-9._-]+$')]
    [string]$Label,

    [string]$OutDir = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($OutDir)) {
    $OutDir = Join-Path $PSScriptRoot "..\artifacts\d2-34"
}
$OutDir = [System.IO.Path]::GetFullPath($OutDir)
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$deviceLine = (& adb devices) | Select-String -Pattern ("^" + [regex]::Escape($Serial) + "\s+device$")
if (-not $deviceLine) {
    throw "Device $Serial is not connected and authorized. Run adb devices."
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$base = Join-Path $OutDir "$stamp-$Label"
$remotePng = "/sdcard/d2-34-$stamp.png"
$remoteXml = "/sdcard/d2-34-$stamp.xml"

function Invoke-Adb {
    param([string[]]$AdbArgs)
    & adb -s $Serial @AdbArgs
    if ($LASTEXITCODE -ne 0) {
        throw "adb command failed: adb -s $Serial $($AdbArgs -join ' ')"
    }
}

try {
    Invoke-Adb @("shell", "screencap", "-p", $remotePng)
    Invoke-Adb @("pull", $remotePng, "$base.png")

    $logcat = & adb -s $Serial logcat -d -t 800
    if ($LASTEXITCODE -ne 0) {
        throw "adb logcat failed"
    }
    $logcat | Set-Content -Encoding utf8 "$base-logcat.txt"

    Invoke-Adb @("shell", "uiautomator", "dump", $remoteXml)
    Invoke-Adb @("pull", $remoteXml, "$base-window.xml")
}
finally {
    & adb -s $Serial shell rm -f $remotePng $remoteXml 2>$null | Out-Null
}

Write-Host "Captured screenshot: $base.png"
Write-Host "Captured logcat:     $base-logcat.txt"
Write-Host "Captured UI dump:    $base-window.xml"
Write-Host "Redact OTPs and personal data before attaching any capture."
