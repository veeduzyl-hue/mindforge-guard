# ARCH v0.2.x signed local native Pack candidate, Windows 11 x64 ordinary user.
# Never executes a .node unless the read-only Authenticode gate passes first.
# Not an installed/signed product and no independent approval is inferred.
[CmdletBinding()]
param(
 [string]$AddonFile='',
 [string]$PolicyFile='',
 [string]$ExpectedPolicySha256='',
 [string]$ExpectedSourceHead='',
 [switch]$ExecuteSynthetic
)
$ErrorActionPreference='Stop'
Set-StrictMode -Version Latest
$repo=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$gate=Join-Path $PSScriptRoot 'arch_v02x_win11_x64_signed_addon_preflight.ps1'
$gateArgs=@('-NoProfile','-NonInteractive','-File',$gate)
if($AddonFile){$gateArgs+=@('-AddonFile',$AddonFile)}
if($PolicyFile){$gateArgs+=@('-PolicyFile',$PolicyFile)}
if($ExpectedPolicySha256){$gateArgs+=@('-ExpectedPolicySha256',$ExpectedPolicySha256)}
if($ExpectedSourceHead){$gateArgs+=@('-ExpectedSourceHead',$ExpectedSourceHead)}
$gateOutput=@(& powershell.exe @gateArgs)
$gateExit=$LASTEXITCODE
$gateLines=@($gateOutput|Where-Object {$_ -like 'ARCH_V02X_SIGNED_ADDON_PREFLIGHT *'})
if($gateLines.Count -ne 1){
 Write-Output 'ARCH_WIN11_SIGNED_PACK=HOLD_NO_GATE_DECISION'
 exit 24
}
$gateDecision=([string]$gateLines[0]).Substring('ARCH_V02X_SIGNED_ADDON_PREFLIGHT '.Length)|ConvertFrom-Json
Write-Output ('ARCH_WIN11_SIGNED_LOCAL_PREFLIGHT '+($gateDecision|ConvertTo-Json -Compress -Depth 6))
if($gateExit -ne 0 -or $gateDecision.decision -ne 'CRYPTOGRAPHIC_PREFLIGHT_PASS_WITH_PRODUCT_HOLD'){
 Write-Output 'ARCH_WIN11_SIGNED_PACK=NOT_RUN_SIGNER_OR_POLICY_HOLD'
 exit 24
}
if(-not $ExecuteSynthetic){
 Write-Output 'ARCH_WIN11_SIGNED_PACK=NOT_RUN_EXPLICIT_SYNTHETIC_OPT_IN_REQUIRED'
 return
}
$head=((& git.exe -C $repo rev-parse HEAD)|Out-String).Trim()
if($LASTEXITCODE -ne 0 -or $head -cne $ExpectedSourceHead){throw 'WRONG_FROZEN_CHECKOUT'}
$dirty=@(git.exe -C $repo status --porcelain=v1 --untracked-files=normal)
if($LASTEXITCODE -ne 0 -or @($dirty|Where-Object {$_ -ne ''}).Count -gt 0){throw 'UNTRUSTED_WORKTREE_REFUSED'}
$cli=Join-Path $repo 'packages\guard\bin\guard.mjs'
$sample=Join-Path $repo 'examples\single-agent-governance-pack\hr-self-service-agent'
if(-not (Test-Path -LiteralPath $cli -PathType Leaf) -or
   -not (Test-Path -LiteralPath $sample -PathType Container)){throw 'SOURCE_CLI_OR_SYNTHETIC_FIXTURE_MISSING'}
$policy=Get-Content -LiteralPath $PolicyFile -Raw -Encoding UTF8|ConvertFrom-Json
$digest=(Get-FileHash -LiteralPath $AddonFile -Algorithm SHA256).Hash.ToLowerInvariant()
if($digest -cne $policy.artifact_sha256){throw 'NATIVE_BINARY_CHANGED_AFTER_SIGNATURE_CHECK'}
$base=(Resolve-Path -LiteralPath $env:TEMP).Path
$root=Join-Path $base ('arch-v02x-win11-signed-synthetic-'+([guid]::NewGuid().ToString('N')))
if(Test-Path -LiteralPath $root){throw 'SYNTHETIC_ROOT_COLLISION'}
New-Item -ItemType Directory -Path $root -ErrorAction Stop|Out-Null
$parent=Join-Path $root 'owned-output-parent'
$pack=Join-Path $root 'synthetic-pack'
$out=Join-Path $parent 'signed-candidate-review'
New-Item -ItemType Directory -Path $parent -ErrorAction Stop|Out-Null
Copy-Item -LiteralPath $sample -Destination $pack -Recurse -ErrorAction Stop
[IO.File]::WriteAllText((Join-Path $parent '.I1_WIN_PRIVATE_STAGE_SYNTHETIC_ONLY'),
 ('I1_REAL_WRITER_WIN_ACL_SYNTHETIC_ONLY'+[char]10),[Text.UTF8Encoding]::new($false))
$before=(Get-FileHash -LiteralPath (Join-Path $pack 'manifest.json') -Algorithm SHA256).Hash.ToLowerInvariant()
$psi=New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName=(Get-Command node.exe).Source
$psi.Arguments=('"'+$cli+'" review --pack "'+$pack+'" --out "'+$out+'" --format json')
$psi.UseShellExecute=$false
$psi.RedirectStandardOutput=$true
$psi.RedirectStandardError=$true
$psi.CreateNoWindow=$true
$psi.EnvironmentVariables['I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT']='1'
$psi.EnvironmentVariables['I1_REAL_WIN_ACL_SYNTHETIC_ONLY']='1'
$psi.EnvironmentVariables['I1_REAL_WIN_ACL_MODULE_PATH']=$AddonFile
$psi.EnvironmentVariables['I1_REAL_WIN_ACL_MODULE_SHA256']=$digest
$p=[Diagnostics.Process]::Start($psi)
if($null -eq $p){throw 'NATIVE_POSITIVE_CHILD_START_FAILURE'}
$stdout=$p.StandardOutput.ReadToEnd()
$stderr=$p.StandardError.ReadToEnd()
if(-not $p.WaitForExit(90000)){
 try{$p.Kill()}catch{}
 throw 'NATIVE_POSITIVE_TIMEOUT_INSPECT_OWNED_PARTIALS'
}
$exit=$p.ExitCode
$p.Dispose()
if($exit -ne 0){throw ('NATIVE_POSITIVE_OUTPUT_UNACKNOWLEDGED_EXIT_'+$exit)}
$result=$stdout|ConvertFrom-Json
if($result.status -ne 'ready_for_review' -or
   [int]$result.native_pack_validation_exit_code -ne 0 -or
   $result.not_approval -ne $true -or $result.not_execution_authority -ne $true){
 throw 'NATIVE_POSITIVE_CLI_CONTRACT_MISMATCH'
}
$manifest=Get-Content -LiteralPath (Join-Path $out 'review-manifest.json') -Raw -Encoding UTF8|ConvertFrom-Json
$checksum=Get-Content -LiteralPath (Join-Path $out 'bundle-checksums.json') -Raw -Encoding UTF8|ConvertFrom-Json
if($manifest.recommendation_only -ne $true -or $manifest.non_executing -ne $true -or
   $manifest.independent_assurance -ne 'NOT_ESTABLISHED'){
 throw 'NATIVE_POSITIVE_AUTHORITY_BOUNDARY_CHANGED'
}
if(@($checksum.files).Count -ne 5){throw 'NATIVE_POSITIVE_CHECKSUM_COUNT'}
foreach($record in $checksum.files){
 $relative=[string]$record.path
 if($relative -notmatch '^[A-Za-z0-9._/-]+$' -or $relative -match '(^|/)\.\.(/|$)'){throw 'NATIVE_POSITIVE_BAD_BUNDLE_PATH'}
 $target=Join-Path $out ($relative.Replace('/','\'))
 $fi=Get-Item -LiteralPath $target -ErrorAction Stop
 if($fi.Length -ne [long]$record.bytes){throw 'NATIVE_POSITIVE_BYTE_LENGTH'}
 if((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant() -cne $record.sha256){
  throw 'NATIVE_POSITIVE_MEMBER_DIGEST'
 }
}
# Only bounded ACL observations; effective denial against a second identity is separate.
foreach($target in @($out,(Join-Path $out 'review-manifest.json'),(Join-Path $out 'components\pack-validation.json'))){
 $acl=Get-Acl -LiteralPath $target
 if($target -ceq $out -and -not $acl.AreAccessRulesProtected){throw 'NATIVE_POSITIVE_ACL_NOT_PROTECTED'}
 $broad=@($acl.Access|Where-Object{
   $sid=$null
   try{$sid=$_.IdentityReference.Translate([Security.Principal.SecurityIdentifier]).Value}catch{}
   $_.AccessControlType -eq 'Allow' -and $sid -in @('S-1-1-0','S-1-5-11','S-1-5-32-545')
 })
 if($broad.Count -ne 0){throw 'NATIVE_POSITIVE_BROAD_ACL'}
}
if((Get-FileHash -LiteralPath (Join-Path $pack 'manifest.json') -Algorithm SHA256).Hash.ToLowerInvariant() -cne $before){
 throw 'NATIVE_POSITIVE_PACK_CHANGED'
}
if((Get-FileHash -LiteralPath $AddonFile -Algorithm SHA256).Hash.ToLowerInvariant() -cne $digest){
 throw 'NATIVE_POSITIVE_ADDON_CHANGED'
}
$receipt=[ordered]@{
 kind='ARCH_V02X_WIN11_X64_SIGNED_LOCAL_NATIVE_SYNTHETIC'
 testedSourceHead=$head
 testedAddonSha256=$digest
 ownerPolicySha256=$ExpectedPolicySha256
 result='PASS_BOUNDED_OWNER_MEDIATED'
 outputArtifactCount=5
 explicitSyntheticScope=$true
 actualDistinctNonAdminSecondUser='NOT_TESTED'
 nativeProductInstall='NOT_IMPLEMENTED'
 secureUpdaterAndRollback='NOT_ESTABLISHED'
 sameUserTOCTOU='NOT_ESTABLISHED'
 signedProductRelease='HOLD'
 independentReceiptCustody='HOLD'
 customerData='NOT_AUTHORIZED'
}
$receipt|ConvertTo-Json -Depth 6|Set-Content -LiteralPath (Join-Path $root 'signed-local-synthetic-receipt.json') -Encoding UTF8
Write-Output ('ARCH_WIN11_SIGNED_LOCAL_POSITIVE_RECEIPT '+($receipt|ConvertTo-Json -Compress -Depth 6))
Write-Output ('OWNED_SYNTHETIC_TEST_ROOT_FOR_MANUAL_REVIEW='+$root)
# No automatic removal or upload; no signing or installer operations.
