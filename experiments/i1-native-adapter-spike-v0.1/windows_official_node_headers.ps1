# I1 Native Spike: official-nodejs.org-only build prerequisite acquisition.
# Executes only in the isolated GitHub Windows test job. No product install hook.
$ErrorActionPreference = 'Stop'
if ($env:I1_SPIKE_ALLOW_NODE_OFFICIAL_DOWNLOAD -ne '1') { throw 'OFFICIAL_HEADER_DOWNLOAD_NOT_AUTHORIZED_IN_CI' }
$version = (node.exe -p 'process.version').Trim()
if (-not ($version -match '^v24\.[0-9]+\.[0-9]+$')) { throw ('UNEXPECTED_NODE_VERSION:' + $version) }
$nodeDir = Split-Path (Get-Command node.exe).Source -Parent
$include = Join-Path $nodeDir 'include\node'
$lib = Join-Path $nodeDir 'node.lib'
$cache = Join-Path $env:RUNNER_TEMP 'i1-native-official-node-build-prereq'
New-Item -ItemType Directory -Force $cache | Out-Null
$base = 'https://nodejs.org/dist/' + $version + '/'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$sumsPath = Join-Path $cache 'SHASUMS256.txt'
Invoke-WebRequest -UseBasicParsing -Uri ($base + 'SHASUMS256.txt') -OutFile $sumsPath -TimeoutSec 45
$sums = Get-Content -LiteralPath $sumsPath
function VerifyOfficial($p, $remoteName) {
  $rx = '^\s*([a-fA-F0-9]{64})\s+' + [regex]::Escape($remoteName) + '\s*$'
  $found = @($sums | Where-Object { $_ -match $rx })
  if ($found.Count -ne 1) { throw ('OFFICIAL_SHA256_ENTRY_MISSING_OR_DUPLICATE:' + $remoteName) }
  [void]($found[0] -match $rx)
  $expected=$Matches[1].ToLowerInvariant()
  $actual=(Get-FileHash -Algorithm SHA256 -LiteralPath $p).Hash.ToLowerInvariant()
  if ($expected -ne $actual) { throw ('OFFICIAL_SHA256_MISMATCH:'+$remoteName) }
  Write-Output ('SHA256_VERIFIED ' + $remoteName + ' ' + $actual)
}
if (-not (Test-Path (Join-Path $include 'node_api.h'))) {
  $name = 'node-' + $version + '-headers.tar.gz'
  $headers = Join-Path $cache $name
  Invoke-WebRequest -UseBasicParsing -Uri ($base + $name) -OutFile $headers -TimeoutSec 60
  VerifyOfficial $headers $name
  tar.exe -xzf $headers -C $cache
  if ($LASTEXITCODE -ne 0) { throw 'OFFICIAL_HEADERS_EXTRACT_FAILED' }
  $include = Join-Path $cache ('node-' + $version + '\include\node')
  if (-not (Test-Path (Join-Path $include 'node_api.h'))) { throw 'OFFICIAL_HEADER_FILE_ABSENT' }
}
if (-not (Test-Path $lib)) {
  $remote='win-x64/node.lib'
  $lib=Join-Path $cache 'win-x64-node.lib'
  Invoke-WebRequest -UseBasicParsing -Uri ($base + $remote) -OutFile $lib -TimeoutSec 45
  VerifyOfficial $lib $remote
}
if (-not (Test-Path $include) -or -not (Test-Path $lib)) { throw 'NAPI_HEADERS_OR_LIB_MISSING' }
$libSha=(Get-FileHash -Algorithm SHA256 -LiteralPath $lib).Hash.ToLowerInvariant()
$headerSha=(Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $include 'node_api.h')).Hash.ToLowerInvariant()
'I1_NODE_INCLUDE_DIR=' + $include | Out-File -FilePath $env:GITHUB_ENV -Encoding ascii -Append
'I1_NODE_LIB=' + $lib | Out-File -FilePath $env:GITHUB_ENV -Encoding ascii -Append
$receipt = [ordered]@{
  kind = 'I1_NATIVE_SPIKE_OFFICIAL_NODE_PREREQUISITES'
  nodeVersion = $version
  domainAllowlist = @('https://nodejs.org/dist/')
  officialChecksumVerified = $true
  includePath = $include
  nodeApiHeaderSha256 = $headerSha
  nodeLibPath = $lib
  nodeImportLibrarySha256 = $libSha
  productInstallScriptUsed = $false
}
$receipt | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $cache 'prerequisites.json') -Encoding utf8
Write-Output ('I1_OFFICIAL_NODE_PREREQUISITES_READY ' + $version + ' ' + $headerSha)
