# Win10/11 x64 candidate first-user test; check-only by default.
# Actual desktop test is OWNER_MEDIATED, never claimed from hosted Server CI.
[CmdletBinding()]
param([switch]$Execute,[switch]$HostedServerCi,[string]$ExpectedHead='')
$ErrorActionPreference='Stop'
Set-StrictMode -Version Latest
$repo=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$head=((& git.exe -C $repo rev-parse HEAD)|Out-String).Trim()
if($LASTEXITCODE -ne 0 -or $head -notmatch '^[a-f0-9]{40}$'){throw 'GIT_HEAD_UNAVAILABLE'}
$os=Get-CimInstance -ClassName Win32_OperatingSystem
$build=[int]$os.BuildNumber
$class=if([int]$os.ProductType -eq 1){'CLIENT'}else{'SERVER'}
$arch=((& node.exe -p 'process.arch')|Out-String).Trim()
$nodeVersion=((& node.exe -p 'process.version')|Out-String).Trim()
if($LASTEXITCODE -ne 0){throw 'NODE_NOT_AVAILABLE'}
$npmVersion=((& npm.cmd --version)|Out-String).Trim()
if($LASTEXITCODE -ne 0){throw 'NPM_NOT_AVAILABLE'}
$identity=[Security.Principal.WindowsIdentity]::GetCurrent()
$admin=(New-Object Security.Principal.WindowsPrincipal($identity)).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
$hostClass=if($HostedServerCi){'GITHUB_HOSTED_SERVER_ONLY'}else{'OWNER_MEDIATED_DESKTOP_CANDIDATE'}
$preflight=[ordered]@{
 kind='ARCH_V02X_WIN_X64_INSTALLED_CLI_PREFLIGHT'
 sourceHead=$head
 hostClass=$hostClass
 osClass=$class
 osBuild=$build
 nodeArch=$arch
 node=$nodeVersion
 npm=$npmVersion
 powershell=$PSVersionTable.PSVersion.ToString()
 isElevated=$admin
 execution='NOT_RUN'
 realFirstUser='NOT_ESTABLISHED'
 signedNativeAddon='NOT_ESTABLISHED'
 customerData='NOT_AUTHORIZED'
}
Write-Output ('ARCH_X64_PREFLIGHT '+($preflight|ConvertTo-Json -Compress -Depth 4))
if(-not $Execute){
 Write-Output 'CHECK_ONLY_NO_FILES_WRITTEN; -Execute requires exact approved source SHA.'
 return
}
if($ExpectedHead -notmatch '^[a-f0-9]{40}$' -or $head -cne $ExpectedHead){throw 'EXACT_SOURCE_SHA_REQUIRED'}
$dirty=@(git.exe -C $repo status --porcelain=v1 --untracked-files=normal)
if($LASTEXITCODE -ne 0 -or @($dirty|Where-Object {$_ -ne ''}).Count -gt 0){throw 'UNCLEAN_CHECKOUT_REFUSED'}
if($PSVersionTable.PSVersion.Major -ne 5 -or $PSVersionTable.PSVersion.Minor -ne 1){throw 'WINPS_5_1_REQUIRED'}
if($arch -ne 'x64' -or $nodeVersion -notmatch '^v24\.[0-9]+\.[0-9]+$'){throw 'NODE24_X64_REQUIRED'}
if($HostedServerCi){
 if($env:GITHUB_ACTIONS -ne 'true' -or $env:RUNNER_OS -ne 'Windows' -or $class -ne 'SERVER' -or -not $env:RUNNER_TEMP){throw 'CI_HOST_GATE_DENIED'}
}else{
 if($env:GITHUB_ACTIONS -eq 'true' -or $class -ne 'CLIENT' -or $admin -or
    -not ($build -eq 19045 -or $build -ge 22000)){
   throw 'NON_ELEVATED_WIN10_22H2_OR_WIN11_X64_CLIENT_REQUIRED'
 }
}
$tempParent=if($HostedServerCi){$env:RUNNER_TEMP}else{$env:TEMP}
if(-not $tempParent){throw 'TEMP_ROOT_MISSING'}
$temp=(Resolve-Path -LiteralPath $tempParent).Path
$ti=Get-Item -LiteralPath $temp -Force
if(($ti.Attributes -band [IO.FileAttributes]::ReparsePoint)){throw 'TEMP_ROOT_REPARSE_REFUSED'}
$work=Join-Path $temp ('arch-v02x-win-x64-installed-'+([guid]::NewGuid().ToString('N')))
if(Test-Path -LiteralPath $work){throw 'TEST_ROOT_COLLISION'}
New-Item -ItemType Directory -Path $work | Out-Null
$pkgdir=Join-Path $work 'package'
$prefix=Join-Path $work 'prefix'
$testHome=Join-Path $work 'home'
$cache=Join-Path $work 'cache'
$sampleCopy=Join-Path $work 'synthetic-pack'
foreach($p in @($pkgdir,$prefix,$testHome,$cache)){New-Item -ItemType Directory -Path $p | Out-Null}
$keys=@('HOME','USERPROFILE','npm_config_cache','npm_config_update_notifier',
 'I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT','I1_REAL_WIN_ACL_SYNTHETIC_ONLY',
 'I1_REAL_WIN_ACL_MODULE_PATH','I1_REAL_WIN_ACL_MODULE_SHA256')
$old=@{}
foreach($k in $keys){$old[$k]=[Environment]::GetEnvironmentVariable($k,'Process')}
try{
 $env:HOME=$testHome;$env:USERPROFILE=$testHome;$env:npm_config_cache=$cache;$env:npm_config_update_notifier='false'
 $env:I1_REAL_WIN_ACL_INTEGRATION_EXPERIMENT='0'
 $env:I1_REAL_WIN_ACL_SYNTHETIC_ONLY='0'
 $env:I1_REAL_WIN_ACL_MODULE_PATH=''
 $env:I1_REAL_WIN_ACL_MODULE_SHA256=''
 $sample=Join-Path $repo 'examples\single-agent-governance-pack\hr-self-service-agent'
 if(-not (Test-Path -LiteralPath $sample -PathType Container)){throw 'SYNTHETIC_SAMPLE_MISSING'}
 Copy-Item -LiteralPath $sample -Destination $sampleCopy -Recurse
 $before=(Get-FileHash -LiteralPath (Join-Path $sampleCopy 'manifest.json') -Algorithm SHA256).Hash
 $json=((& npm.cmd pack --workspace '@veeduzyl/mindforge-guard' --pack-destination $pkgdir --ignore-scripts --offline --json)|Out-String)
 if($LASTEXITCODE -ne 0){throw 'NPM_OFFLINE_PACK_FAILED'}
 $records=$json|ConvertFrom-Json
 if(@($records).Count -ne 1){throw 'NOT_EXACTLY_ONE_PACKAGE'}
 $name=[string]$records[0].filename
 if($name -match '[\\/]' -or -not $name.EndsWith('.tgz')){throw 'UNEXPECTED_PACKAGE_FILENAME'}
 $tgz=Join-Path $pkgdir $name
 if(-not (Test-Path -LiteralPath $tgz -PathType Leaf)){throw 'TARBALL_MISSING'}
 $digest=(Get-FileHash -LiteralPath $tgz -Algorithm SHA256).Hash.ToLowerInvariant()
 & npm.cmd install --prefix $prefix --offline --ignore-scripts --no-audit --no-fund --no-package-lock $tgz | Out-Null
 if($LASTEXITCODE -ne 0){throw 'OFFLINE_INSTALL_FAILED'}
 $installed=Join-Path $prefix 'node_modules\@veeduzyl\mindforge-guard'
 $cli=Join-Path $installed 'bin\guard.mjs'
 if(-not (Test-Path -LiteralPath $cli -PathType Leaf)){throw 'INSTALLED_CLI_MISSING'}
 $native=@(Get-ChildItem -LiteralPath $installed -Recurse -File -Filter '*.node')
 if($native.Count -ne 0){throw 'UNAPPROVED_NATIVE_BINARY_IN_INSTALLED_PACKAGE'}
 $installedVersion=((& node.exe $cli --version)|Out-String).Trim()
 if($LASTEXITCODE -ne 0){throw 'INSTALLED_VERSION_EXECUTION_FAILED'}
 $packageVersion=(Get-Content -LiteralPath (Join-Path $repo 'packages\guard\package.json') -Raw -Encoding UTF8|ConvertFrom-Json).version
 if($installedVersion -notmatch [regex]::Escape($packageVersion)){throw 'INSTALLED_VERSION_IDENTITY_MISMATCH'}
 $vText=((& node.exe $cli pack validate --pack $sampleCopy --preview --json)|Out-String)
 if($LASTEXITCODE -ne 0){throw 'INSTALLED_PACK_VALIDATION_FAILED'}
 $v=$vText|ConvertFrom-Json
 if($v.validation_status -ne 'valid_with_no_omissions'){throw 'PACK_STATUS_REGRESSION'}
 $rText=((& node.exe $cli report single-agent --pack $sampleCopy --preview --json)|Out-String)
 if($LASTEXITCODE -ne 0){throw 'INSTALLED_REPORT_FAILED'}
 $r=$rText|ConvertFrom-Json
 if($r.review_posture -ne 'ready_for_review' -or $r.deterministic_hash -ne $v.deterministic_pack_hash){
   throw 'PACK_REPORT_PARITY_REGRESSION'
 }
 $target=Join-Path $work 'refused-bundle'
 $stderr=Join-Path $work 'expected-deny-stderr.txt'
 # Windows PowerShell 5.1 treats expected native stderr as an ErrorRecord
 # under ErrorActionPreference=Stop. Observe the child exit and both streams
 # separately; never weaken or ignore the Guard failure semantics.
 $psi=New-Object System.Diagnostics.ProcessStartInfo
 $psi.FileName=(Get-Command node.exe).Source
 $psi.Arguments=('"'+$cli+'" review --pack "'+$sampleCopy+'" --out "'+$target+'" --format json')
 $psi.UseShellExecute=$false
 $psi.RedirectStandardOutput=$true
 $psi.RedirectStandardError=$true
 $psi.CreateNoWindow=$true
 $proc=[System.Diagnostics.Process]::Start($psi)
 if(-not $proc){throw 'DEFAULT_DENY_CHILD_NOT_STARTED'}
 $diagnostic=$proc.StandardError.ReadToEnd()
 $unexpectedStdout=$proc.StandardOutput.ReadToEnd()
 if(-not $proc.WaitForExit(90000)){
   try{$proc.Kill()}catch{}
   throw 'DEFAULT_DENY_CHILD_TIMEOUT'
 }
 $denyExit=$proc.ExitCode
 [System.IO.File]::WriteAllText($stderr,$diagnostic,[System.Text.UTF8Encoding]::new($false))
 $proc.Dispose()
 if($denyExit -ne 30 -or (Test-Path -LiteralPath $target)){throw 'WINDOWS_DEFAULT_DENY_INVARIANT_FAILED'}
 if($diagnostic -notmatch 'output_error'){throw 'EXPECTED_DENY_DIAGNOSTIC_MISSING'}
 if($unexpectedStdout){throw 'UNEXPECTED_SUCCESS_STDOUT_ON_DEFAULT_DENY'}
 $partial=@(Get-ChildItem -LiteralPath $work -Force | Where-Object {$_.Name -like '.guard-i1-partial-*'})
 if($partial.Count -gt 0){throw 'DEFAULT_DENY_LEFT_PARTIAL'}
 $after=(Get-FileHash -LiteralPath (Join-Path $sampleCopy 'manifest.json') -Algorithm SHA256).Hash
 if($before -ne $after){throw 'SYNTHETIC_INPUT_CHANGED'}
 $dirty=@(git.exe -C $repo status --porcelain=v1 --untracked-files=normal)
 if($LASTEXITCODE -ne 0 -or @($dirty|Where-Object {$_ -ne ''}).Count -gt 0){throw 'REPOSITORY_MUTATED'}
 $receipt=[ordered]@{
   kind='ARCH_V02X_WIN_X64_INSTALLED_CLI_ADMISSION_RECEIPT'
   testedHead=$head
   hostClass=$hostClass
   osBuild=$build
   osClass=$class
   isElevated=$admin
   packageVersion=$packageVersion
   packageSha256=$digest
   node=$nodeVersion
   isolatedOfflineInstall='PASS_BOUNDED'
   nativePackValidate='PASS_BOUNDED'
   nativeReportPreview='PASS_BOUNDED'
   nativeAddonInTarball='ABSENT'
   unverifiedWindowsNative='DEFAULT_DENY_PASS'
   defaultDenyNoOutputOrPartial='PASS_BOUNDED'
   sampleSourceIntegrity='UNCHANGED'
   realFirstUser='NOT_ESTABLISHED'
   nativeSignedDistribution='NOT_ESTABLISHED'
   nativePositivePack='NOT_RUN'
   m4_62='NOT_RUN'
   windows10_11DesktopCustomerAdmission='HOLD'
   independentReceiptCustody='HOLD'
 }
 $receipt | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $work 'receipt.json') -Encoding UTF8
 Write-Output ('ARCH_X64_INSTALLED_CLI_RECEIPT '+($receipt|ConvertTo-Json -Compress -Depth 5))
 Write-Output ('REVIEWABLE_SYNTHETIC_TEST_DIRECTORY='+$work)
}finally{
 foreach($k in $keys){[Environment]::SetEnvironmentVariable($k,$old[$k],'Process')}
 # Intentionally retain only this newly created synthetic workspace for Owner review.
 # No automatic deletion of host/source/customer data.
}
