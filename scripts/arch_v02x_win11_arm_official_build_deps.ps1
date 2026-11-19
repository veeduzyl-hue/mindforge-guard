# ARCH-v0.2.x Windows 11 ARM64 synthetic-only native addon build prerequisites.
# Only official nodejs.org Node 24 distribution material, SHA256 bound to official SHASUMS256.
# Does NOT authorize signed addon distribution or product release.
$ErrorActionPreference = 'Stop'
if ($env:ARCH_V02X_ARM_CI_SYNTHETIC_ONLY -ne '1' -or $env:GITHUB_ACTIONS -ne 'true') {
  throw 'EXPLICIT_ISOLATED_GITHUB_ARM_SYNTHETIC_SCOPE_REQUIRED'
}
$version = (& node.exe -p "process.version").Trim()
$arch = (& node.exe -p "process.arch").Trim()
$platform = (& node.exe -p "process.platform").Trim()
$napi = [int]((& node.exe -p "process.versions.napi").Trim())
if ($version -notmatch '^v24\.[0-9]+\.[0-9]+$' -or $arch -ne 'arm64' -or $platform -ne 'win32' -or $napi -lt 8) {
  throw ('UNSUPPORTED_NODE_NATIVE_IDENTITY:' + $version + '/' + $platform + '/' + $arch)
}
$root = Join-Path $env:RUNNER_TEMP 'arch-v02x-win11-arm-native-prereqs'
if (Test-Path -LiteralPath $root) { throw 'EXISTING_PREREQ_ROOT_REFUSED' }
New-Item -ItemType Directory -Path $root -ErrorAction Stop | Out-Null
$base='https://nodejs.org/dist/' + $version + '/'
$sumsPath=Join-Path $root 'SHASUMS256.txt'
Invoke-WebRequest -UseBasicParsing -Uri ($base+'SHASUMS256.txt') -OutFile $sumsPath -TimeoutSec 60
$sums=Get-Content -LiteralPath $sumsPath
function DownloadVerified([string] $relative,[string] $output) {
  $pattern='^\s*([A-Fa-f0-9]{64})\s+' + [regex]::Escape($relative) + '\s*$'
  $found=@($sums | Where-Object { $_ -match $pattern })
  if ($found.Count -ne 1) { throw ('OFFICIAL_HASH_ENTRY_NOT_UNIQUE:'+$relative) }
  [void]($found[0] -match $pattern)
  $expected=$Matches[1].ToLowerInvariant()
  Invoke-WebRequest -UseBasicParsing -Uri ($base+$relative) -OutFile $output -TimeoutSec 120
  $actual=(Get-FileHash -Algorithm SHA256 -LiteralPath $output).Hash.ToLowerInvariant()
  if ($actual -ne $expected) { throw ('OFFICIAL_HASH_MISMATCH:'+$relative) }
  # Write-Host does not contaminate the function's return value / SHA receipt field.
  Write-Host ('ARCH_ARM_OFFICIAL_SHA256_VERIFIED '+$relative+' '+$actual)
  return $actual
}
$headersName='node-'+$version+'-headers.tar.gz'
$headersFile=Join-Path $root $headersName
$headerArchiveSha=DownloadVerified $headersName $headersFile
& tar.exe -xzf $headersFile -C $root
if ($LASTEXITCODE -ne 0) { throw 'NODE_OFFICIAL_HEADERS_EXTRACT_FAILED' }
$include=Join-Path $root ('node-'+$version+'\include\node')
if (-not (Test-Path -LiteralPath (Join-Path $include 'node_api.h'))) { throw 'NODE_API_H_NOT_EXTRACTED' }
$armLibName='win-arm64/node.lib'
$armLib=Join-Path $root 'win-arm64-node.lib'
$armLibSha=DownloadVerified $armLibName $armLib
if (-not (Test-Path -LiteralPath $armLib)) { throw 'ARM64_IMPORT_LIBRARY_MISSING' }
'I1_NODE_INCLUDE_DIR='+$include | Out-File -FilePath $env:GITHUB_ENV -Encoding ascii -Append
'I1_NODE_LIB='+$armLib | Out-File -FilePath $env:GITHUB_ENV -Encoding ascii -Append
$receipt=[ordered]@{
  kind='ARCH_V02X_ARM_NATIVE_OFFICIAL_PREREQUISITES'
  scope='GITHUB_RUNNER_SYNTHETIC_ONLY'
  sourceCommit=(git rev-parse HEAD).Trim()
  node=$version
  platform=$platform
  arch=$arch
  napi=$napi
  remoteHost='nodejs.org'
  officialHeadersArchive=$headersName
  officialHeadersSHA256=$headerArchiveSha
  officialImportLibrary=$armLibName
  officialImportLibrarySHA256=$armLibSha
  identityLevel='CHECKSUM_BOUND_TO_DOWNLOADED_OFFICIAL_INDEX'
  nodePackagePublishing='NOT_AUTHORIZED'
  signedNativeAddonDistribution='NOT_ESTABLISHED'
}
$receiptFile=Join-Path $root 'official-native-prerequisites.json'
$receipt | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $receiptFile -Encoding utf8
Write-Output ('ARCH_V02X_ARM_NATIVE_PREREQUISITES_READY '+($receipt | ConvertTo-Json -Compress -Depth 5))
