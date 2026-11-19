# ARCH-v0.2.x Windows 11 x64 native addon signed-artifact preflight.
# READ-ONLY. Never runs, loads, installs, trusts or signs the .node file.
# A matching Owner-supplied policy digest is not independent Owner approval.
[CmdletBinding()]
param(
 [string]$AddonFile='',
 [string]$PolicyFile='',
 [string]$ExpectedPolicySha256='',
 [string]$ExpectedSourceHead='',
 [switch]$HostedServerNegativeOnly
)
$ErrorActionPreference='Stop'
Set-StrictMode -Version Latest
$decision=[ordered]@{
 kind='ARCH_V02X_WIN11_X64_SIGNED_ADDON_PREFLIGHT'
 hostClass=if($HostedServerNegativeOnly){'HOSTED_SERVER_NEGATIVE_ONLY'}else{'OWNER_MEDIATED_WIN11_X64_CLIENT'}
 decision='BLOCKED_NOT_STARTED'
 originalM4Cases='NOT_RUN'
 nativeSignedProductRelease='NOT_AUTHORIZED'
 independentOwnerApproval='NOT_ESTABLISHED'
 customerEvidence='NOT_AUTHORIZED'
 nativePositiveBundle='NOT_RUN'
 revocationPolicy='OFFLINE_CHAIN_EXCLUDE_ROOT_FAIL_CLOSED'
}
function Finish([string]$reason,[int]$code) {
 $decision.decision=$reason
 Write-Output ('ARCH_V02X_SIGNED_ADDON_PREFLIGHT '+($decision|ConvertTo-Json -Compress -Depth 6))
 exit $code
}
function IsHex([string]$s,[int]$len){return ($null -ne $s -and $s -cmatch ('^[0-9a-f]{'+$len+'}$'))}
function IsNoReparsePath([string]$p){
 if(-not [System.IO.Path]::IsPathRooted($p)){return $false}
 $x=Get-Item -LiteralPath $p -Force -ErrorAction Stop
 while($null -ne $x){
  if(($x.Attributes -band [IO.FileAttributes]::ReparsePoint)){return $false}
  $x=$x.Parent
 }
 return $true
}
try {
 if(-not $AddonFile -or -not $PolicyFile -or -not $ExpectedPolicySha256 -or -not $ExpectedSourceHead){
  Finish 'HOLD_MISSING_SIGNED_ARTIFACT_OR_OWNER_PINNED_POLICY' 24
 }
 if(-not (IsHex $ExpectedPolicySha256 64) -or $ExpectedSourceHead -cnotmatch '^[0-9a-f]{40}$'){
  Finish 'BLOCKED_INVALID_POLICY_SHA_OR_SOURCE_IDENTITY' 24
 }
 if(-not (Test-Path -LiteralPath $AddonFile -PathType Leaf) -or
    -not (Test-Path -LiteralPath $PolicyFile -PathType Leaf)){
  Finish 'BLOCKED_MISSING_LOCAL_ARTIFACT_OR_POLICY' 24
 }
 if(-not (IsNoReparsePath $AddonFile) -or -not (IsNoReparsePath $PolicyFile)){
  Finish 'BLOCKED_REPARSE_POINT_IN_ARTIFACT_PATH' 24
 }
 $os=Get-CimInstance Win32_OperatingSystem
 $arch=((& node.exe -p 'process.arch')|Out-String).Trim()
 $platform=((& node.exe -p 'process.platform')|Out-String).Trim()
 $nodeVersion=((& node.exe -p 'process.version')|Out-String).Trim()
 $napi=[int](((& node.exe -p 'process.versions.napi')|Out-String).Trim())
 $decision.osBuild=[int]$os.BuildNumber
 $decision.node=$nodeVersion
 $decision.arch=$arch
 if($platform -ne 'win32' -or $arch -ne 'x64' -or $nodeVersion -notmatch '^v24\.[0-9]+\.[0-9]+$' -or $napi -lt 8){
  Finish 'BLOCKED_UNSUPPORTED_NODE_PLATFORM' 24
 }
 $elevated=(New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
 if($HostedServerNegativeOnly){
  if($env:GITHUB_ACTIONS -ne 'true' -or $env:RUNNER_OS -ne 'Windows' -or [int]$os.ProductType -eq 1){
   Finish 'BLOCKED_NOT_HOSTED_SERVER_NEGATIVE_SCOPE' 24
  }
 }else{
  if($env:GITHUB_ACTIONS -eq 'true' -or [int]$os.ProductType -ne 1 -or [int]$os.BuildNumber -lt 22000 -or $elevated){
   Finish 'BLOCKED_NON_ADMIN_WIN11_X64_CLIENT_REQUIRED' 24
  }
 }
 $policyDigest=(Get-FileHash -LiteralPath $PolicyFile -Algorithm SHA256).Hash.ToLowerInvariant()
 $decision.policySha256=$policyDigest
 if($policyDigest -cne $ExpectedPolicySha256){Finish 'BLOCKED_OWNER_POLICY_SHA_MISMATCH' 24}
 $policy=Get-Content -LiteralPath $PolicyFile -Raw -Encoding UTF8 | ConvertFrom-Json
 if($policy.kind -cne 'ARCH_V02X_WIN_SIGNED_ADDON_ADMISSION_POLICY' -or $policy.version -cne '0.1' -or
    $policy.scope -cne 'BOUNDED_SYNTHETIC_PACK_ONLY' -or $policy.source_head -cne $ExpectedSourceHead -or
    $policy.platform -cne 'win32' -or $policy.arch -cne 'x64'){
  Finish 'BLOCKED_POLICY_CONTRACT_OR_SOURCE_MISMATCH' 24
 }
 if($policy.artifact_file_name -cne 'private_acl.node' -or
    [System.IO.Path]::GetFileName($AddonFile) -cne $policy.artifact_file_name){
  Finish 'BLOCKED_NATIVE_ADDON_BASENAME_MISMATCH' 24
 }
 if(-not (IsHex ([string]$policy.artifact_sha256) 64) -or
    -not (IsHex ([string]$policy.signer_thumbprint) 40) -or
    -not (IsHex ([string]$policy.signer_cert_sha256) 64) -or
    -not (IsHex ([string]$policy.root_thumbprint) 40)){
  Finish 'BLOCKED_MISSING_PINNED_BINARY_SIGNER_OR_TRUST_ROOT' 24
 }
 if([int]$policy.node_api_min -ne 8 -or $napi -lt 8){
  Finish 'BLOCKED_NAPI_CONTRACT_MISMATCH' 24
 }
 $item=Get-Item -LiteralPath $AddonFile -Force
 if($item.Length -le 0 -or $item.Length -gt 8MB -or $item.Length -ne [int64]$policy.artifact_size_bytes){
  Finish 'BLOCKED_NATIVE_BINARY_SIZE' 24
 }
 $binarySha=(Get-FileHash -LiteralPath $AddonFile -Algorithm SHA256).Hash.ToLowerInvariant()
 $decision.artifactSha256=$binarySha
 if($binarySha -cne $policy.artifact_sha256){Finish 'BLOCKED_NATIVE_BINARY_SHA256_MISMATCH' 24}
 $signature=Get-AuthenticodeSignature -LiteralPath $AddonFile
 if([string]$signature.Status -ne 'Valid' -or $null -eq $signature.SignerCertificate){
  $decision.signatureStatus=[string]$signature.Status
  Finish 'BLOCKED_AUTHENTICODE_NOT_VALID_OR_UNSIGNED' 24
 }
 if([string]$signature.SignatureType -ne 'Authenticode'){
  Finish 'BLOCKED_EMBEDDED_AUTHENTICODE_SIGNATURE_REQUIRED' 24
 }
 $cert=$signature.SignerCertificate
 $thumb=$cert.Thumbprint.Replace(' ','').ToLowerInvariant()
 $decision.signerThumbprint=$thumb
 if($thumb -cne $policy.signer_thumbprint){Finish 'BLOCKED_OWNER_SIGNER_PIN_MISMATCH' 24}
 $certBytes=$cert.RawData
 $hasher=[System.Security.Cryptography.SHA256]::Create()
 try{$certSha=([BitConverter]::ToString($hasher.ComputeHash($certBytes))).Replace('-','').ToLowerInvariant()}finally{$hasher.Dispose()}
 if($certSha -cne $policy.signer_cert_sha256){Finish 'BLOCKED_SIGNER_CERT_SHA256_MISMATCH' 24}
 if($cert.Subject -ceq $cert.Issuer){Finish 'BLOCKED_SELF_SIGNED_LEAF_CERT' 24}
 if([DateTime]::UtcNow -lt $cert.NotBefore.ToUniversalTime() -or
    [DateTime]::UtcNow -gt $cert.NotAfter.ToUniversalTime()){
  Finish 'BLOCKED_SIGNER_CERT_NOT_CURRENTLY_VALID' 24
 }
 $eku=@($cert.Extensions|Where-Object { $_ -is [System.Security.Cryptography.X509Certificates.X509EnhancedKeyUsageExtension] })
 $codeSigning=$false
 foreach($ext in $eku){foreach($oid in $ext.EnhancedKeyUsages){if($oid.Value -ceq '1.3.6.1.5.5.7.3.3'){$codeSigning=$true}}}
 if(-not $codeSigning){Finish 'BLOCKED_SIGNER_MISSING_CODE_SIGNING_EKU' 24}
 $chain=New-Object System.Security.Cryptography.X509Certificates.X509Chain
 try{
  $chain.ChainPolicy.RevocationMode=[System.Security.Cryptography.X509Certificates.X509RevocationMode]::Offline
  $chain.ChainPolicy.RevocationFlag=[System.Security.Cryptography.X509Certificates.X509RevocationFlag]::ExcludeRoot
  $chain.ChainPolicy.VerificationFlags=[System.Security.Cryptography.X509Certificates.X509VerificationFlags]::NoFlag
  $chain.ChainPolicy.ApplicationPolicy.Add(([System.Security.Cryptography.Oid]::new('1.3.6.1.5.5.7.3.3')))
  $built=$chain.Build($cert)
  $statuses=@($chain.ChainStatus|Where-Object {$_.Status -ne [System.Security.Cryptography.X509Certificates.X509ChainStatusFlags]::NoError})
  if(-not $built -or $statuses.Count -gt 0 -or $chain.ChainElements.Count -lt 2){
   $decision.offlineChainStatus='UNKNOWN_OR_REJECTED'
   Finish 'BLOCKED_OFFLINE_REVOCATION_OR_TRUST_CHAIN_UNVERIFIABLE' 24
  }
  $root=$chain.ChainElements[$chain.ChainElements.Count-1].Certificate
  $rootThumb=$root.Thumbprint.Replace(' ','').ToLowerInvariant()
  $decision.chainRootThumbprint=$rootThumb
  if($rootThumb -cne $policy.root_thumbprint){Finish 'BLOCKED_OWNER_TRUST_ROOT_PIN_MISMATCH' 24}
 } finally { $chain.Dispose() }
 $after=(Get-FileHash -LiteralPath $AddonFile -Algorithm SHA256).Hash.ToLowerInvariant()
 if($after -cne $binarySha){Finish 'BLOCKED_BINARY_CHANGED_DURING_INSPECTION' 24}
 # This is still NOT proof that the policy was independently Owner-authorized,
 # protected against same-user TOCTOU, or approved for customer distribution.
 $decision.offlineChainStatus='BOUNDED_VERIFIED'
 Finish 'CRYPTOGRAPHIC_PREFLIGHT_PASS_WITH_PRODUCT_HOLD' 0
}catch{
 $decision.inspectionErrorType=$_.Exception.GetType().Name
 Finish 'BLOCKED_INSPECTION_UNEXPECTED_ERROR' 24
}
