param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("P0", "P1", "P2", "P3")]
    [string]$Severity,

    [Parameter(Mandatory = $true)]
    [ValidateSet("app", "backend", "infra", "guide", "design")]
    [string]$Owner,

    [Parameter(Mandatory = $true)]
    [string]$Title,

    [Parameter(Mandatory = $true)]
    [string]$Steps,

    [Parameter(Mandatory = $true)]
    [string]$Expected,

    [Parameter(Mandatory = $true)]
    [string]$Actual,

    [string]$Device = "not recorded",
    [string]$Evidence = "none",
    [string]$Repo = "karanpandeyklk/Setu_app",
    [switch]$Accessibility
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Title)) {
    throw "Title cannot be empty."
}

$body = @"
Owner: $Owner
Severity: $Severity
Run: D2-34 E2E run 1
Device: $Device

Steps:
$Steps

Expected:
$Expected

Actual:
$Actual

Evidence:
$Evidence

Do not attach OTPs, email bodies, tokens, or full personal addresses.
"@

$temp = [System.IO.Path]::GetTempFileName()
try {
    Set-Content -Path $temp -Value $body -Encoding utf8
    $ghArgs = @(
        "issue", "create",
        "--repo", $Repo,
        "--title", "[$Severity][$Owner] $Title",
        "--body-file", $temp,
        "--label", "bug"
    )
    if ($Accessibility) {
        $ghArgs += @("--label", "accessibility")
    }

    $url = & gh @ghArgs
    if ($LASTEXITCODE -ne 0) {
        throw "gh issue create failed."
    }
    Write-Host $url
}
finally {
    Remove-Item -Force -ErrorAction SilentlyContinue $temp
}
