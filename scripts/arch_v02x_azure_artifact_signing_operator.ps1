# Architecture v0.2.x — Azure Artifact Signing operator-side candidate only.
# Default: NO SIGNING. With -ExecuteSign: makes a signed *copy* in a new
# isolated local directory using Azure Artifact Signing's official SignTool dlib.
# Does not approve publisher trust, ship to npm, or alter the source/native writer.
[CmdletBinding()]
param(
  [switch]$ExecuteSign,
  [switch]$AcknowledgeExternalSigning,
  [string]$ExpectedSourceHead='',
  [string]$UnsignedAddonFile='',
  [string]$ExpectedUnsignedSha256='',
  [string]$SignToolPath='',
  [string]$ExpectedSignToolSha256='',
  [string]$DlibPath='',
  [string]$ExpectedDlibSha256='',
  [string]$MetadataPath='',
  [string]$ExpectedMetadataSha256='',
  [string]$OutputParent=''
)
$ErrorActionPreference='Stop'
Set-StrictMode -Version Latest
$repo=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$receipt=[ordered]@{
  kind='ARCH_V02X_AZURE_ARTIFACT_SIGNING_OPERATOR'
  execution='NOT_RUN'
  sourceHead='NOT_ESTABLISHED'
  unsignedSha256='NOT_ESTABLISHED'
  signedSha256='NOT_ESTABLISHED'
  publisherSignature='NOT_ESTABLISHED'
  timestamp='NOT_ESTABLISHED'
  signingService='AZURE_ARTIFACT_SIGNING_CANDIDATE'
  signerIdentityAndReleaseApproval='NOT_ESTABLISHED'
  productAdmission='HOLD'
  independentReceiptCustody='HOLD'
  actualWindows11X64ClientNativePositive='NOT_RUN'
  realCustomerEvidence='NOT_AUTHORIZED'
  m4Original62='NOT_RUN'
}
function Emit([string]$status,[int]$exitCode) {
  $receipt.execution=$status
  Write-Output ('ARCH_V02X_AZURE_SIGNING_OPERATOR '+($receipt|ConvertTo-Json -Compress -Depth 6))
  exit $exitCode
}
function IsHex([string]$v,[int]$length){return ($null -ne $v -and $v -cmatch ('^[0-9a-f]{'+$length+'}$'))}
function SafePath([string]$p,[bool]$requireFile) {
  if(-not [IO.Path]::IsPathRooted($p)){return $false}
  $x=Get-Item -LiteralPath $p -Force -ErrorAction Stop
  if($requireFile -and -not ($x -is [IO.FileInfo])){return $false}
  if(-not $requireFile -and -not ($x -is [IO.DirectoryInfo])){return $false}
  while($null -ne $x){
    if(($x.Attributes -band [IO.FileAttributes]::ReparsePoint)){return $false}
    if($x -is [IO.FileInfo]){$x=$x.Directory}else{$x=$x.Parent}
  }
  return $true
}
if(-not $ExecuteSign){
  Emit 'CHECK_ONLY_NOT_SIGNED_NO_CLOUD_CALL_NO_FILES_CREATED' 0
}
if(-not $AcknowledgeExternalSigning){
  Emit 'HOLD_MISSING_EXPLICIT_SIGNING_AND_POTENTIAL_COST_ACKNOWLEDGEMENT' 24
}
if($env:GITHUB_ACTIONS -eq 'true'){
  Emit 'BLOCKED_DIRECT_SIGNING_ON_CI_NOT_AUTHORIZED' 24
}
$names=@($UnsignedAddonFile,$SignToolPath,$DlibPath,$MetadataPath,$OutputParent)
if(@($names|Where-Object {-not $_}).Count -gt 0 -or
   -not (IsHex $ExpectedSourceHead 40) -or
   -not (IsHex $ExpectedUnsignedSha256 64) -or
   -not (IsHex $ExpectedSignToolSha256 64) -or
   -not (IsHex $ExpectedDlibSha256 64) -or
   -not (IsHex $ExpectedMetadataSha256 64)){
  Emit 'HOLD_MISSING_EXACT_SOURCE_ARTIFACT_TOOLCHAIN_OR_METADATA_PIN' 24
}
try {
  $os=Get-CimInstance Win32_OperatingSystem
  if([int]$os.ProductType -ne 1 -or [int]$os.BuildNumber -lt 22000){
    Emit 'BLOCKED_NOT_WIN11_DESKTOP' 24
  }
  $platform=((& node.exe -p 'process.platform')|Out-String).Trim()
  $arch=((& node.exe -p 'process.arch')|Out-String).Trim()
  $nodeVersion=((& node.exe -p 'process.version')|Out-String).Trim()
  if($platform -ne 'win32' -or $arch -ne 'x64' -or $nodeVersion -notmatch '^v24\.[0-9]+\.[0-9]+$'){
    Emit 'BLOCKED_NATIVE_PLATFORM_NODE_IDENTITY' 24
  }
  $isAdmin=(New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator)
  if($isAdmin){Emit 'BLOCKED_ELEVATED_SIGNING_OPERATOR' 24}
  $head=((& git.exe -C $repo rev-parse HEAD)|Out-String).Trim()
  if($LASTEXITCODE -ne 0 -or $head -cne $ExpectedSourceHead){
    Emit 'BLOCKED_SOURCE_COMMIT_MISMATCH' 24
  }
  $receipt.sourceHead=$head
  $dirty=@(git.exe -C $repo status --porcelain=v1 --untracked-files=normal)
  if($LASTEXITCODE -ne 0 -or @($dirty|Where-Object {$_ -ne ''}).Count -gt 0){
    Emit 'BLOCKED_WORKTREE_NOT_CLEAN' 24
  }
  foreach($f in @($UnsignedAddonFile,$SignToolPath,$DlibPath,$MetadataPath)){
    if(-not (Test-Path -LiteralPath $f -PathType Leaf) -or -not (SafePath $f $true)){
      Emit 'BLOCKED_MISSING_UNSAFE_OR_REPARSE_INPUT_PATH' 24
    }
  }
  if(-not (Test-Path -LiteralPath $OutputParent -PathType Container) -or
     -not (SafePath $OutputParent $false)){
    Emit 'BLOCKED_UNSAFE_OUTPUT_PARENT' 24
  }
  if([IO.Path]::GetFileName($UnsignedAddonFile) -cne 'private_acl.node'){
    Emit 'BLOCKED_UNEXPECTED_NATIVE_BINARY_NAME' 24
  }
  if([IO.Path]::GetFileName($DlibPath) -cne 'Azure.CodeSigning.Dlib.dll'){
    Emit 'BLOCKED_UNEXPECTED_AZURE_SIGNING_CLIENT' 24
  }
  $digestUnsigned=(Get-FileHash -LiteralPath $UnsignedAddonFile -Algorithm SHA256).Hash.ToLowerInvariant()
  $receipt.unsignedSha256=$digestUnsigned
  if($digestUnsigned -cne $ExpectedUnsignedSha256){Emit 'BLOCKED_UNSIGNED_ADDON_SHA_MISMATCH' 24}
  if((Get-FileHash -LiteralPath $SignToolPath -Algorithm SHA256).Hash.ToLowerInvariant() -cne $ExpectedSignToolSha256){
    Emit 'BLOCKED_SIGNTOOL_IDENTITY_MISMATCH' 24
  }
  if((Get-FileHash -LiteralPath $DlibPath -Algorithm SHA256).Hash.ToLowerInvariant() -cne $ExpectedDlibSha256){
    Emit 'BLOCKED_AZURE_DLIB_IDENTITY_MISMATCH' 24
  }
  if((Get-FileHash -LiteralPath $MetadataPath -Algorithm SHA256).Hash.ToLowerInvariant() -cne $ExpectedMetadataSha256){
    Emit 'BLOCKED_AZURE_METADATA_SHA_MISMATCH' 24
  }
  $meta=Get-Content -LiteralPath $MetadataPath -Raw -Encoding UTF8|ConvertFrom-Json
  $allowed=@('Endpoint','CodeSigningAccountName','CertificateProfileName','CorrelationId')
  foreach($field in @($meta.PSObject.Properties.Name)){
    if($field -notin $allowed){Emit 'BLOCKED_UNEXPECTED_METADATA_FIELD_POSSIBLE_SECRET' 24}
  }
  if([string]$meta.Endpoint -cnotmatch '^https://(brs|cus|eus|jpe|krc|ncus|neu|plc|scus|swn|wcus|weu|wus|wus2|wus3)\.codesigning\.azure\.net/?$' -or
     [string]$meta.CodeSigningAccountName -notmatch '^[a-zA-Z][a-zA-Z0-9-]{2,23}$' -or
     [string]$meta.CertificateProfileName -notmatch '^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$'){
    Emit 'BLOCKED_AZURE_ACCOUNT_ENDPOINT_OR_PROFILE_NOT_PINNED' 24
  }
  # Never double-sign. A signed input may already have timestamp and trust
  # commitments; require a fresh unsigned build from the pinned source.
  $oldSignature=Get-AuthenticodeSignature -LiteralPath $UnsignedAddonFile
  if([string]$oldSignature.Status -ne 'NotSigned'){Emit 'BLOCKED_INPUT_NOT_FRESH_UNSIGNED_NATIVE_BINARY' 24}
  $parent=(Resolve-Path -LiteralPath $OutputParent).Path
  $stage=Join-Path $parent ('arch-v02x-azure-signed-candidate-'+([guid]::NewGuid().ToString('N')))
  if(Test-Path -LiteralPath $stage){Emit 'BLOCKED_OUTPUT_COLLISION' 24}
  New-Item -ItemType Directory -Path $stage -ErrorAction Stop|Out-Null
  $copy=Join-Path $stage 'private_acl.node'
  Copy-Item -LiteralPath $UnsignedAddonFile -Destination $copy -ErrorAction Stop
  if((Get-FileHash -LiteralPath $copy -Algorithm SHA256).Hash.ToLowerInvariant() -cne $digestUnsigned){
    Emit 'BLOCKED_UNSIGNED_COPY_CHANGED' 24
  }
  $receipt.candidateDirectory=$stage
  # Azure CLI/DefaultAzureCredential authorization remains on the operator's
  # identity. No PFX, private keys, access tokens or connection strings passed.
  & $SignToolPath sign /v /fd SHA256 /tr 'http://timestamp.acs.microsoft.com' /td SHA256 /dlib $DlibPath /dmdf $MetadataPath $copy
  if($LASTEXITCODE -ne 0){Emit 'SIGNING_FAILED_OWNER_REVIEW_WITH_LOCAL_CANDIDATE_RETAINED' 24}
  & $SignToolPath verify /pa /v $copy
  if($LASTEXITCODE -ne 0){Emit 'SIGNED_FILE_SIGTOOL_VERIFY_FAILED_OWNER_REVIEW' 24}
  $signature=Get-AuthenticodeSignature -LiteralPath $copy
  if([string]$signature.Status -ne 'Valid' -or $null -eq $signature.SignerCertificate){
    Emit 'SIGNED_CANDIDATE_AUTHENTICODE_NOT_VALID' 24
  }
  $timeCert=$signature.TimeStamperCertificate
  if($null -eq $timeCert){
    Emit 'SIGNED_CANDIDATE_RFC3161_TIMESTAMP_NOT_ESTABLISHED' 24
  }
  $signedDigest=(Get-FileHash -LiteralPath $copy -Algorithm SHA256).Hash.ToLowerInvariant()
  if($signedDigest -ceq $digestUnsigned){Emit 'SIGNED_CANDIDATE_HASH_UNCHANGED_UNEXPECTED' 24}
  $receipt.signedSha256=$signedDigest
  $receipt.publisherSignature='VALID_AT_SIGNING_HOST_ONLY'
  $receipt.timestamp='OBSERVED_AUTHENTICODE_TIMESTAMPCERT_REQUIRES_INDEPENDENT_TSA_VALIDATION'
  $cert=$signature.SignerCertificate
  $receipt.signerThumbprint=$cert.Thumbprint.Replace(' ','').ToLowerInvariant()
  $receipt.signerNotBeforeUtc=$cert.NotBefore.ToUniversalTime().ToString('o')
  $receipt.signerNotAfterUtc=$cert.NotAfter.ToUniversalTime().ToString('o')
  $sha256=[Security.Cryptography.SHA256]::Create()
  try{$receipt.signerDerSha256=([BitConverter]::ToString($sha256.ComputeHash($cert.RawData))).Replace('-','').ToLowerInvariant()}
  finally{$sha256.Dispose()}
  $receipt.execution='SIGNED_CANDIDATE_CREATED_FOR_INDEPENDENT_OWNER_REVIEW'
  $receipt.productAdmission='HOLD'
  $jsonPath=Join-Path $stage 'signing-candidate-receipt.json'
  $receipt|ConvertTo-Json -Depth 7|Set-Content -LiteralPath $jsonPath -Encoding UTF8
  Write-Output ('ARCH_V02X_AZURE_SIGNING_OPERATOR '+($receipt|ConvertTo-Json -Compress -Depth 6))
}catch{
  $receipt.inspectionErrorType=$_.Exception.GetType().FullName
  Emit 'BLOCKED_UNEXPECTED_SIGNING_OPERATOR_ERROR' 24
}
