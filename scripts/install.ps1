param(
  [string]$Version = "latest",
  [string]$Repo = "veeduzyl-hue/mindforge-guard"
)

$ErrorActionPreference = "Stop"

function Require-Cmd($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $name"
  }
}

Require-Cmd "node"
Require-Cmd "npm"

$apiBase = "https://api.github.com/repos/$Repo/releases"
$headers = @{ "User-Agent" = "mindforge-guard-installer" }

if ($Version -eq "latest") {
  $rel = Invoke-RestMethod -Uri "$apiBase/latest" -Headers $headers
} else {
  # Allow passing "1.0.1" or "v1.0.1"
  $tag = $Version
  if ($tag -notmatch '^v') { $tag = "v$tag" }
  $rel = Invoke-RestMethod -Uri "$apiBase/tags/$tag" -Headers $headers
}

$tagName = $rel.tag_name
$asset = $rel.assets | Where-Object { $_.name -like "*mindforge-guard*$tagName*.tgz" -or $_.name -like "*mindforge-guard*${tagName.TrimStart('v')}*.tgz" } | Select-Object -First 1
if (-not $asset) {
  throw "Cannot find tgz asset in release $tagName. Expected something like '*mindforge-guard*${tagName}*.tgz'."
}

$tmpDir = Join-Path $env:TEMP "mindforge-guard"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null
$tgzPath = Join-Path $tmpDir $asset.name

Write-Host "Downloading: $($asset.browser_download_url)"
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $tgzPath

Write-Host "Installing globally from: $tgzPath"
npm install -g $tgzPath | Out-Host

Write-Host ""
Write-Host "Verify:"
guard --version
guard --help | Select-Object -First 5