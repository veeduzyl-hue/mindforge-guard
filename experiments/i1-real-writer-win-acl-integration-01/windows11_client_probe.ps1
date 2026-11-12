# I1 Real Writer Windows ACL candidate — Windows 11 ARM64 desktop runtime probe.
# Only disposable GH Runner synthetic files. This is NOT a native addon or product test.
$ErrorActionPreference = "Stop"
$root=Join-Path $env:RUNNER_TEMP ('i1-win11-synthetic-'+[guid]::NewGuid().ToString('N'))
$receiptDir=Join-Path $env:RUNNER_TEMP 'i1-win11-client-receipt'
New-Item -ItemType Directory -Force $root,$receiptDir | Out-Null
$receipt=[ordered]@{
  kind='I1_WIN11_ARM64_SYNTHETIC_ACL_CLIENT_PROBE'
  fixedHead=$env:GITHUB_SHA
  platform=[System.Runtime.InteropServices.RuntimeInformation]::OSDescription
  architecture=[System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString()
  desktopVersionVerified=$false
  protectedDaclCreation='NOT_TESTED'
  actualSecondUserAccess='NOT_TESTED'
  ordinaryNonElevatedUserExecution='NOT_TESTED'
  principalIdentifiersRetained=$false
  productNodeAddonInstalled=$false
  productCustomerInputUsed=$false
  realUserProductionAdmission='HOLD'
  errors=@()
}
$otherName='i1syntest'+([guid]::NewGuid().ToString('N').Substring(0,8))
$createdUser=$false
try {
  $reg=Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion'
  $receipt.osBuild=$reg.CurrentBuild
  $receipt.productName=$reg.ProductName
  $receipt.desktopVersionVerified=($reg.CurrentBuild -as [int]) -ge 22000 -and
    $receipt.architecture -eq 'Arm64'
  if(-not $receipt.desktopVersionVerified){throw 'NOT_WINDOWS11_ARM64_RUNTIME'}
  $cs=@'
using System;
using System.Runtime.InteropServices;
public class I1WinAclPrivateCreate {
  [StructLayout(LayoutKind.Sequential)]
  public struct SA {
    public int nLength;
    public IntPtr lpSecurityDescriptor;
    [MarshalAs(UnmanagedType.Bool)] public bool bInheritHandle;
  }
  [DllImport("advapi32.dll",EntryPoint="ConvertStringSecurityDescriptorToSecurityDescriptorW",CharSet=CharSet.Unicode,SetLastError=true)]
  public static extern bool Build(string sddl,int revision,out IntPtr sd,IntPtr length);
  [DllImport("kernel32.dll",EntryPoint="CreateDirectoryW",CharSet=CharSet.Unicode,SetLastError=true)]
  public static extern bool Create(string pathname,ref SA attributes);
  [DllImport("kernel32.dll")]public static extern IntPtr LocalFree(IntPtr ptr);
  public static bool Make(string dir,string sddl){
    IntPtr sd=IntPtr.Zero;
    if(!Build(sddl,1,out sd,IntPtr.Zero))return false;
    try {
      SA sa=new SA();
      sa.nLength=Marshal.SizeOf(typeof(SA));
      sa.lpSecurityDescriptor=sd;sa.bInheritHandle=false;
      return Create(dir,ref sa);
    } finally { LocalFree(sd); }
  }
}
'@
  Add-Type -TypeDefinition $cs -ErrorAction Stop
  $parent=Join-Path $root 'permissive-parent'
  New-Item -ItemType Directory $parent | Out-Null
  & icacls.exe $parent /grant '*S-1-5-11:(OI)(CI)M' | Out-Null
  if($LASTEXITCODE -ne 0){throw 'FAILED_PERMISSIVE_SYNTHETIC_PARENT'}
  $sid=[System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
  $sddl='D:P(A;OICI;FA;;;'+$sid+')(A;OICI;FA;;;SY)'
  $target=Join-Path $parent 'protected-at-creation'
  if(-not [I1WinAclPrivateCreate]::Make($target,$sddl)){throw 'CREATE_DIRECTORY_WITH_DACL_FAILED'}
  $acl=Get-Acl -LiteralPath $target
  $allows=@($acl.Access | Where-Object {$_.AccessControlType -eq 'Allow'})
  $broad=@($allows | Where-Object {
    $_.IdentityReference.Value -match 'Authenticated Users|Everyone|BUILTIN\\Users'
  })
  if(-not $acl.AreAccessRulesProtected -or $broad.Count -ne 0 -or
    @($allows|Where-Object {$_.IsInherited}).Count -ne 0){throw 'WINDOWS11_ACL_NOT_PROTECTED'}
  $file=Join-Path $target 'synthetic.txt'
  [System.IO.File]::WriteAllText($file,'SYNTHETIC_ONLY_NO_CUSTOMER_DATA')
  $childAcl=Get-Acl -LiteralPath $file
  if(@($childAcl.Access | Where-Object {$_.IdentityReference.Value -match 'Authenticated Users|Everyone|BUILTIN\\Users'}).Count -gt 0){
    throw 'CHILD_HAS_BROAD_ALLOW'
  }
  $receipt.protectedDaclCreation='PASS_BOUNDED_WINDOWS11_ARM64'
  $receipt.aclAtCreationTrustedAceCount=$allows.Count
  $receipt.childBroadAces=0
  # Attempt actual independent ordinary account. If runner lacks rights to create
  # an ephemeral user or run a process as it, record NOT_TESTED, never claim success.
  try{
    $password='I1!'+[guid]::NewGuid().ToString('N')+'zZ9'
    $secure=ConvertTo-SecureString $password -AsPlainText -Force
    New-LocalUser -Name $otherName -Password $secure -PasswordNeverExpires -ErrorAction Stop | Out-Null
    $createdUser=$true
    $cred=[pscredential]::new($env:COMPUTERNAME+'\'+$otherName,$secure)
    $probe=Join-Path $root 'access-test.ps1'
    @'
param([string]$protectedFile)
try{
  $null=[System.IO.File]::ReadAllText($protectedFile)
  exit 44
}catch [System.UnauthorizedAccessException] {exit 0}
catch {exit 55}
'@ | Set-Content -LiteralPath $probe -Encoding utf8
    $std=Join-Path $receiptDir 'other-user-stdout.txt'
    $err=Join-Path $receiptDir 'other-user-stderr.txt'
    $start=@{
      FilePath='powershell.exe'
      ArgumentList=@('-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass',
        '-File',('"'+$probe+'"'),'-protectedFile',('"'+$file+'"'))
      Credential=$cred
      Wait=$true
      PassThru=$true
      RedirectStandardOutput=$std
      RedirectStandardError=$err
      WindowStyle='Hidden'
    }
    $proc=Start-Process @start
    if($proc.ExitCode -eq 0){
      $receipt.actualSecondUserAccess='PASS_ACTUAL_SECOND_ACCOUNT_READ_DENIED'
    }else{
      $receipt.actualSecondUserAccess='NOT_ESTABLISHED_EXIT_'+$proc.ExitCode
    }
  }catch{
    $receipt.errors+=('Distinct-user trial not established: '+$_.Exception.GetType().Name)
  }
} catch {
  $receipt.errors+=('Windows11 ACL runtime test: '+$_.Exception.GetType().Name+': '+$_.Exception.Message)
  if($receipt.protectedDaclCreation -eq 'NOT_TESTED') {
    $receipt.protectedDaclCreation='BLOCKED'
  }
} finally {
  if($createdUser){
    try { Remove-LocalUser -Name $otherName -ErrorAction Stop }
    catch {$receipt.errors+='Ephemeral test user cleanup uncertain; disposable CI runner must be destroyed'}
  }
  # Only remove a fixture we created on a disposable CI runner.
  try{Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction Stop}catch{}
  $receipt | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $receiptDir 'windows11-client-probe.json') -Encoding utf8
  Write-Output ('I1_WINDOWS11_CLIENT_PROBE '+($receipt | ConvertTo-Json -Compress -Depth 5))
}
# Fail if a basic ACL control was not demonstrated; distinct user is optional
# but never promoted to PASS if host policy prevents it.
if($receipt.protectedDaclCreation -ne 'PASS_BOUNDED_WINDOWS11_ARM64'){exit 2}
