// I1-REAL-WRITER-WIN-ACL-INTEGRATION-01
// Synthetic opt-in real Writer candidate; new NtCreateFile HANDLE-bound variant.
// Previous CreateDirectoryW candidate retained as control; not a release binary.
// I1-WIN-NTFS-ACL-01: experimental Node-API8 native Windows ACL control.
// Only synthetic temporary fixtures; NOT imported by any Guard product code.
// IMPORTANT: CreateDirectoryW is given a PROTECTED DACL AT CREATION TIME.
// A subsequent readback is an admission check, never a post-create icacls fix.
#define NAPI_VERSION 8
#include <node_api.h>
#define NOMINMAX
#include <windows.h>
#include <sddl.h>
#include <aclapi.h>
#include <string>
#include <vector>
#include <sstream>
#include <iomanip>
#include <cstdint>
#include <cstring>
#include <cstdio>
#include <cstdlib>

namespace {
struct Handle {
  HANDLE value = INVALID_HANDLE_VALUE;
  Handle()=default; Handle(const Handle&)=delete;Handle&operator=(const Handle&)=delete;
  Handle(Handle&& o) noexcept:value(o.value){o.value=INVALID_HANDLE_VALUE;}
  Handle& operator=(Handle&& o) noexcept {
    if(this!=&o){if(value!=INVALID_HANDLE_VALUE)CloseHandle(value);
      value=o.value;o.value=INVALID_HANDLE_VALUE;}
    return *this;
  }
  ~Handle(){if(value!=INVALID_HANDLE_VALUE&&value!=nullptr)CloseHandle(value);}
  bool ok()const{return value!=INVALID_HANDLE_VALUE;}
};
struct Local {
  void* value=nullptr;
  ~Local(){if(value)LocalFree(value);}
  Local()=default; Local(const Local&)=delete;Local&operator=(const Local&)=delete;
};
std::wstring utf(const std::string& s){
  const int n=MultiByteToWideChar(CP_UTF8,MB_ERR_INVALID_CHARS,s.c_str(),static_cast<int>(s.size()),nullptr,0);
  if(n<=0)return L"";
  std::wstring w(size_t(n),L'\0');
  if(!MultiByteToWideChar(CP_UTF8,MB_ERR_INVALID_CHARS,s.c_str(),static_cast<int>(s.size()),w.data(),n))return L"";
  return w;
}
std::string trimSidHash(PSID sid){
  if(!sid)return "";
  DWORD bytes=GetLengthSid(sid);
  // Never export user identity: hash derivation is not needed for a DACL proof.
  return std::string("SID_PRESENT_")+std::to_string(bytes);
}
bool absolute(const std::wstring& s){
  return s.size()>2 && ((s[1]==L':'&&(s[2]==L'\\'||s[2]==L'/'))||
    (s.size()>3&&s[0]==L'\\'&&s[1]==L'\\'));
}
bool baseOk(const std::wstring& s){
  if(s.empty()||s==L"."||s==L".."||s.size()>96||s.back()==L'.'||s.back()==L' ')return false;
  for(wchar_t c:s){if(c==L'/'||c==L'\\'||c==L':'||c==0)return false;}
  return true;
}
std::wstring join(const std::wstring& a,const std::wstring& b){
  return a+(a.back()==L'\\'||a.back()==L'/'?L"":L"\\")+b;
}
std::string hex(uint64_t n){
  std::ostringstream s;s<<std::hex<<std::setw(16)<<std::setfill('0')<<n;return s.str();
}
std::string id(HANDLE h){
  BY_HANDLE_FILE_INFORMATION i{};
  if(!GetFileInformationByHandle(h,&i))return "";
  return hex(i.dwVolumeSerialNumber)+":"+hex((uint64_t(i.nFileIndexHigh)<<32)|i.nFileIndexLow);
}
Handle openExisting(const std::wstring& p,DWORD access){
  Handle h;
  h.value=CreateFileW(p.c_str(),access,FILE_SHARE_READ|FILE_SHARE_WRITE|FILE_SHARE_DELETE,
    nullptr,OPEN_EXISTING,FILE_FLAG_BACKUP_SEMANTICS|FILE_FLAG_OPEN_REPARSE_POINT,nullptr);
  return h;
}
bool realDirectory(const std::wstring& p){
  DWORD flags=GetFileAttributesW(p.c_str());
  return flags!=INVALID_FILE_ATTRIBUTES&&(flags&FILE_ATTRIBUTE_DIRECTORY)&&!(flags&FILE_ATTRIBUTE_REPARSE_POINT);
}
std::string filesystem(HANDLE h,bool* persistent){
  wchar_t name[80]={};DWORD flags=0;
  if(!GetVolumeInformationByHandleW(h,nullptr,0,nullptr,nullptr,&flags,name,80))return "";
  *persistent=(flags&FS_PERSISTENT_ACLS)!=0;
  int n=WideCharToMultiByte(CP_UTF8,0,name,-1,nullptr,0,nullptr,nullptr);
  if(n<=1)return "";
  std::string out(size_t(n),'\0');
  if(!WideCharToMultiByte(CP_UTF8,0,name,-1,out.data(),n,nullptr,nullptr))return "";
  out.resize(size_t(n-1));return out;
}
bool getCurrentSid(std::vector<BYTE>& data,PSID* sid){
  Handle tok;tok.value=nullptr;
  if(!OpenProcessToken(GetCurrentProcess(),TOKEN_QUERY,&tok.value))return false;
  DWORD needed=0;GetTokenInformation(tok.value,TokenUser,nullptr,0,&needed);
  if(!needed||needed>65536)return false;
  data.resize(needed);
  if(!GetTokenInformation(tok.value,TokenUser,data.data(),needed,&needed))return false;
  *sid=reinterpret_cast<TOKEN_USER*>(data.data())->User.Sid;
  return IsValidSid(*sid)==TRUE;
}
struct Assessment{
 bool inspected=false,protectedAcl=false,presentDacl=false,onlyTrusted=false;
 bool userFullControl=false,systemFullControl=false,inheritedAces=false;
 uint32_t aceCount=0;uint32_t rawCode=0;std::string stageId="";
};
Assessment assess(HANDLE h,PSID current,PSID localSystem){
  Assessment r;
  PSECURITY_DESCRIPTOR sdRaw=nullptr;PACL acl=nullptr;PSID owner=nullptr;
  DWORD code=GetSecurityInfo(h,SE_FILE_OBJECT,OWNER_SECURITY_INFORMATION|DACL_SECURITY_INFORMATION,
    &owner,nullptr,&acl,nullptr,&sdRaw);
  if(code!=ERROR_SUCCESS){r.rawCode=code;return r;}
  Local sd;sd.value=sdRaw;
  SECURITY_DESCRIPTOR_CONTROL control=0;DWORD revision=0;BOOL present=FALSE,defaulted=FALSE;
  if(!GetSecurityDescriptorControl(sdRaw,&control,&revision)||
     !GetSecurityDescriptorDacl(sdRaw,&present,&acl,&defaulted)){
    r.rawCode=GetLastError();return r;
  }
  r.inspected=true;
  r.protectedAcl=(control&SE_DACL_PROTECTED)!=0;
  r.presentDacl=present==TRUE && acl!=nullptr;
  if(!r.presentDacl)return r; // NULL DACL would grant everyone.
  ACL_SIZE_INFORMATION size{};
  if(!GetAclInformation(acl,&size,sizeof(size),AclSizeInformation)){
    r.rawCode=GetLastError();return r;
  }
  r.aceCount=size.AceCount;
  bool allowed=true;
  for(DWORD i=0;i<size.AceCount;i++){
    void* ptr=nullptr;
    if(!GetAce(acl,i,&ptr)){r.rawCode=GetLastError();return r;}
    auto* head=reinterpret_cast<ACE_HEADER*>(ptr);
    if(head->AceFlags&INHERITED_ACE)r.inheritedAces=true;
    if(head->AceType!=ACCESS_ALLOWED_ACE_TYPE){allowed=false;continue;}
    auto* ace=reinterpret_cast<ACCESS_ALLOWED_ACE*>(ptr);
    PSID who=&ace->SidStart;
    bool user=EqualSid(who,current)==TRUE,system=EqualSid(who,localSystem)==TRUE;
    if(!user&&!system)allowed=false;
    bool full=(ace->Mask&FILE_ALL_ACCESS)==FILE_ALL_ACCESS;
    if(user&&full)r.userFullControl=true;
    if(system&&full)r.systemFullControl=true;
  }
  r.onlyTrusted=allowed&&r.userFullControl&&r.systemFullControl&&r.aceCount>=2;
  r.stageId=id(h);
  return r;
}
struct Result{
 std::string status="REFUSED",api="CreateDirectoryW(SECURITY_ATTRIBUTES,SE_DACL_PROTECTED)";
 std::string filesystem="UNKNOWN",parentId="",createdId="";
 std::string errorNamespace="Win32";
 uint32_t rawCode=0,aceCount=0;
 bool created=false,privacyConfirmed=false,protectedDacl=false,onlyTrusted=false;
 bool inheritedAces=false,userFullControl=false,systemFullControl=false;
 bool aclSupported=false,parentIdentityRechecked=false;
};
napi_value toJs(napi_env env,const Result& r){
 napi_value o; napi_create_object(env,&o);
 auto string=[&](const char* k,const std::string& s){
   napi_value v;napi_create_string_utf8(env,s.c_str(),s.size(),&v);napi_set_named_property(env,o,k,v);};
 auto boolean=[&](const char* k,bool x){napi_value v;napi_get_boolean(env,x,&v);napi_set_named_property(env,o,k,v);};
 auto number=[&](const char* k,uint32_t n){napi_value v;napi_create_uint32(env,n,&v);napi_set_named_property(env,o,k,v);};
 string("status",r.status);string("nativeApi",r.api);string("filesystem",r.filesystem);
 string("parentObjectIdentity",r.parentId);string("createdObjectIdentity",r.createdId);
 string("errorNamespace",r.errorNamespace);number("rawCode",r.rawCode);number("aceCount",r.aceCount);
 boolean("created",r.created);boolean("privacyConfirmed",r.privacyConfirmed);
 boolean("protectedDacl",r.protectedDacl);boolean("onlyTrustedAces",r.onlyTrusted);
 boolean("hasInheritedAces",r.inheritedAces);boolean("userFullControl",r.userFullControl);
 boolean("systemFullControl",r.systemFullControl);boolean("persistentAcls",r.aclSupported);
 boolean("parentIdentityRechecked",r.parentIdentityRechecked);
 boolean("noIcaclsRepair",true);boolean("doesNotProveOtherUserDenied",true);
 boolean("boundedProofOnly",true);
 return o;
}
Result createPrivate(const std::string& parentUtf,const std::string& baseUtf){
 Result r;
 const std::wstring parent=utf(parentUtf),name=utf(baseUtf);
 if(!absolute(parent)||!baseOk(name)){r.status="REFUSED_INVALID_PATH";return r;}
 if(!realDirectory(parent)){r.status="REFUSED_PARENT_REPARSE_OR_ABSENT";return r;}
 Handle ph=openExisting(parent,READ_CONTROL|FILE_READ_ATTRIBUTES|FILE_TRAVERSE);
 if(!ph.ok()){r.rawCode=GetLastError();r.status="REFUSED_PARENT_OPEN";return r;}
 r.parentId=id(ph.value);bool persistent=false;
 r.filesystem=filesystem(ph.value,&persistent);r.aclSupported=persistent;
 if(r.filesystem!="NTFS"||!persistent){r.status="REFUSED_NOT_NTFS_PERSISTENT_ACLS";return r;}
 std::vector<BYTE> tokenData;PSID user=nullptr;
 if(!getCurrentSid(tokenData,&user)){r.status="REFUSED_USER_TOKEN";r.rawCode=GetLastError();return r;}
 LPWSTR userSidRaw=nullptr;
 if(!ConvertSidToStringSidW(user,&userSidRaw)){
   r.status="REFUSED_SID_STRING";r.rawCode=GetLastError();return r;
 }
 Local userSid;userSid.value=userSidRaw;
 std::wstring descriptor=L"D:P(A;OICI;FA;;;"+std::wstring(userSidRaw)+L")(A;OICI;FA;;;SY)";
 PSECURITY_DESCRIPTOR sdRaw=nullptr;
 if(!ConvertStringSecurityDescriptorToSecurityDescriptorW(
   descriptor.c_str(),SDDL_REVISION_1,&sdRaw,nullptr)){
   r.status="REFUSED_PROTECTED_DACL_BUILD";r.rawCode=GetLastError();return r;
 }
 Local sd;sd.value=sdRaw;
 SECURITY_ATTRIBUTES sa{};sa.nLength=sizeof(sa);sa.lpSecurityDescriptor=sdRaw;sa.bInheritHandle=FALSE;
 std::wstring target=join(parent,name);
 if(!CreateDirectoryW(target.c_str(),&sa)){
   r.rawCode=GetLastError();
   r.status=r.rawCode==ERROR_ALREADY_EXISTS?"REFUSED_ALREADY_EXISTS":"REFUSED_PRIVATE_DIRECTORY_CREATE";
   return r;
 }
 r.created=true;
 Handle created=openExisting(target,READ_CONTROL|FILE_READ_ATTRIBUTES);
 if(!created.ok()){r.status="CREATED_PRIVACY_UNCONFIRMED";r.rawCode=GetLastError();return r;}
 BYTE systemBuffer[SECURITY_MAX_SID_SIZE]={};DWORD n=sizeof(systemBuffer);
 if(!CreateWellKnownSid(WinLocalSystemSid,nullptr,systemBuffer,&n)){
   r.status="CREATED_SYSTEM_SID_UNAVAILABLE";r.rawCode=GetLastError();return r;
 }
 const Assessment a=assess(created.value,user,systemBuffer);
 r.protectedDacl=a.protectedAcl;r.onlyTrusted=a.onlyTrusted;r.aceCount=a.aceCount;
 r.inheritedAces=a.inheritedAces;r.userFullControl=a.userFullControl;
 r.systemFullControl=a.systemFullControl;r.createdId=a.stageId;
 if(!a.inspected){r.rawCode=a.rawCode;r.status="CREATED_DACL_READBACK_FAILED";return r;}
 Handle newParent=openExisting(parent,READ_CONTROL|FILE_READ_ATTRIBUTES|FILE_TRAVERSE);
 r.parentIdentityRechecked=newParent.ok()&&id(newParent.value)==r.parentId;
 r.privacyConfirmed=a.protectedAcl&&a.presentDacl&&a.onlyTrusted&&!a.inheritedAces&&
   r.parentIdentityRechecked&&!r.createdId.empty();
 r.status=r.privacyConfirmed?"CREATED_PRIVATE_DACL_VERIFIED":
   "CREATED_PRIVATE_DACL_OR_PATH_NOT_VERIFIED";
 return r;
}

struct NativeUnicodeName{USHORT Length;USHORT MaximumLength;PWSTR Buffer;};
struct NativeObjectAttributes{ULONG Length;HANDLE RootDirectory;NativeUnicodeName* ObjectName;
 ULONG Attributes;PVOID SecurityDescriptor;PVOID SecurityQualityOfService;};
struct NativeIoStatus{union{LONG Status;PVOID Pointer;};ULONG_PTR Information;};
using NativeNtCreateFile=LONG (NTAPI*)(PHANDLE,ACCESS_MASK,NativeObjectAttributes*,NativeIoStatus*,
  void*,ULONG,ULONG,ULONG,ULONG,void*,ULONG);
Result createPrivateBound(const std::string& parentUtf,const std::string& baseUtf){
 Result r;r.api="ntdll!NtCreateFile(FILE_CREATE,RootDirectory,ProtectedDACL)";
 const std::wstring parent=utf(parentUtf),name=utf(baseUtf);
 if(!absolute(parent)||!baseOk(name)){r.status="REFUSED_INVALID_PATH";return r;}
 if(!realDirectory(parent)){r.status="REFUSED_PARENT_REPARSE_OR_ABSENT";return r;}
 Handle ph=openExisting(parent,READ_CONTROL|FILE_READ_ATTRIBUTES|FILE_TRAVERSE|FILE_ADD_SUBDIRECTORY);
 if(!ph.ok()){r.rawCode=GetLastError();r.status="REFUSED_PARENT_OPEN";return r;}
 r.parentId=id(ph.value);
 bool persistent=false;r.filesystem=filesystem(ph.value,&persistent);r.aclSupported=persistent;
 if(r.filesystem!="NTFS"||!persistent){r.status="REFUSED_NOT_NTFS_PERSISTENT_ACLS";return r;}
 std::vector<BYTE> tokenData;PSID user=nullptr;
 if(!getCurrentSid(tokenData,&user)){r.status="REFUSED_USER_TOKEN";return r;}
 LPWSTR sidRaw=nullptr;
 if(!ConvertSidToStringSidW(user,&sidRaw)){r.rawCode=GetLastError();r.status="REFUSED_SID_STRING";return r;}
 Local sid;
 sid.value=sidRaw;
 const std::wstring descriptor=L"D:P(A;OICI;FA;;;"+std::wstring(sidRaw)+L")(A;OICI;FA;;;SY)";
 PSECURITY_DESCRIPTOR sdRaw=nullptr;
 if(!ConvertStringSecurityDescriptorToSecurityDescriptorW(descriptor.c_str(),SDDL_REVISION_1,&sdRaw,nullptr)){
  r.rawCode=GetLastError();r.status="REFUSED_PRIVATE_DACL_BUILD";return r;
 }
 Local sd;sd.value=sdRaw;
 HMODULE ntdll=GetModuleHandleW(L"ntdll.dll");
 auto nt=ntdll?reinterpret_cast<NativeNtCreateFile>(GetProcAddress(ntdll,"NtCreateFile")):nullptr;
 if(!nt){r.status="REFUSED_NT_CREATE_UNAVAILABLE";return r;}
 NativeUnicodeName uname{static_cast<USHORT>(name.size()*2),
  static_cast<USHORT>((name.size()+1)*2),const_cast<wchar_t*>(name.c_str())};
 NativeObjectAttributes attrs{sizeof(NativeObjectAttributes),ph.value,&uname,0x40u,sdRaw,nullptr};
 NativeIoStatus ios{};
 const char* isPause=getenv("I1_NATIVE_ACL_TEST_PAUSE_BEFORE_CREATE");
 const char* synthetic=getenv("I1_WIN_DACL_SYNTHETIC_ONLY");
 if(isPause&&strcmp(isPause,"1")==0&&synthetic&&strcmp(synthetic,"1")==0){
  fputs("I1_NATIVE_PARENT_HANDLE_PINNED\n",stdout);fflush(stdout);Sleep(1500);
 }
 HANDLE createdRaw=INVALID_HANDLE_VALUE;
 LONG status=nt(&createdRaw,FILE_ALL_ACCESS|SYNCHRONIZE,&attrs,&ios,nullptr,
    FILE_ATTRIBUTE_DIRECTORY,FILE_SHARE_READ|FILE_SHARE_WRITE|FILE_SHARE_DELETE,
    2u,1u|0x20u,nullptr,0);
 r.rawCode=static_cast<uint32_t>(status);
 if(status!=0){
   r.status=r.rawCode==0xC0000035u?"REFUSED_ALREADY_EXISTS":"REFUSED_NT_CREATE_STATUS";
   return r;
 }
 Handle created;created.value=createdRaw;r.created=true;
 r.createdId=id(created.value);
 BYTE systemBuffer[SECURITY_MAX_SID_SIZE]={};DWORD n=sizeof(systemBuffer);
 if(!CreateWellKnownSid(WinLocalSystemSid,nullptr,systemBuffer,&n)){
   r.status="CREATED_SYSTEM_SID_UNAVAILABLE";return r;
 }
 const Assessment a=assess(created.value,user,systemBuffer);
 r.protectedDacl=a.protectedAcl;r.onlyTrusted=a.onlyTrusted;r.aceCount=a.aceCount;
 r.inheritedAces=a.inheritedAces;r.userFullControl=a.userFullControl;
 r.systemFullControl=a.systemFullControl;
 Handle parentAgain=openExisting(parent,READ_CONTROL|FILE_READ_ATTRIBUTES|FILE_TRAVERSE);
 r.parentIdentityRechecked=parentAgain.ok()&&id(parentAgain.value)==r.parentId;
 const std::wstring newPath=join(parent,name);
 Handle byPath=openExisting(newPath,READ_CONTROL|FILE_READ_ATTRIBUTES);
 const bool publishedPathConfirmed=byPath.ok()&&id(byPath.value)==r.createdId&&realDirectory(newPath);
 r.privacyConfirmed=a.inspected&&a.protectedAcl&&a.presentDacl&&a.onlyTrusted&&!a.inheritedAces&&
   r.parentIdentityRechecked&&publishedPathConfirmed&&!r.createdId.empty();
 r.status=r.privacyConfirmed?"CREATED_PRIVATE_DACL_VERIFIED":
   "CREATED_PRIVATE_DACL_OR_PATH_NOT_VERIFIED";
 return r;
}
Result inspectAcl(const std::string& pUtf){
 Result r;r.api="GetSecurityInfo(SE_FILE_OBJECT,DACL_SECURITY_INFORMATION)";
 const auto p=utf(pUtf);if(!absolute(p)){r.status="REFUSED_INVALID_PATH";return r;}
 Handle h=openExisting(p,READ_CONTROL|FILE_READ_ATTRIBUTES);
 if(!h.ok()){r.status="REFUSED_OPEN";r.rawCode=GetLastError();return r;}
 bool persistent=false;r.filesystem=filesystem(h.value,&persistent);r.aclSupported=persistent;
 std::vector<BYTE> tokenData;PSID user=nullptr;
 if(!getCurrentSid(tokenData,&user)){r.status="REFUSED_TOKEN_QUERY";r.rawCode=GetLastError();return r;}
 BYTE systemBuffer[SECURITY_MAX_SID_SIZE]={};DWORD n=sizeof(systemBuffer);
 if(!CreateWellKnownSid(WinLocalSystemSid,nullptr,systemBuffer,&n)){
  r.status="REFUSED_SYSTEM_SID";r.rawCode=GetLastError();return r;
 }
 auto a=assess(h.value,user,systemBuffer);
 r.protectedDacl=a.protectedAcl;r.onlyTrusted=a.onlyTrusted;
 r.aceCount=a.aceCount;r.inheritedAces=a.inheritedAces;
 r.userFullControl=a.userFullControl;r.systemFullControl=a.systemFullControl;
 r.createdId=a.stageId;r.privacyConfirmed=a.inspected&&a.onlyTrusted;
 r.status=a.inspected?"ACL_OBSERVED":"REFUSED_READBACK";r.rawCode=a.rawCode;
 return r;
}
bool readString(napi_env e,napi_value v,std::string& s){
 napi_valuetype t;if(napi_typeof(e,v,&t)!=napi_ok||t!=napi_string)return false;
 size_t n=0;if(napi_get_value_string_utf8(e,v,nullptr,0,&n)!=napi_ok||n>8192)return false;
 std::vector<char> buffer(n+1,0);
 if(napi_get_value_string_utf8(e,v,buffer.data(),buffer.size(),&n)!=napi_ok)return false;
 s.assign(buffer.data(),n);return true;
}
napi_value Make(napi_env e,napi_callback_info i){
 size_t argc=2;napi_value args[2];
 if(napi_get_cb_info(e,i,&argc,args,nullptr,nullptr)!=napi_ok||argc!=2){
  napi_throw_type_error(e,nullptr,"createPrivate requires (absoluteParent, singleBasename)");return nullptr;
 }
 std::string a,b;if(!readString(e,args[0],a)||!readString(e,args[1],b)){
  napi_throw_type_error(e,nullptr,"Invalid UTF-8");return nullptr;
 }
 try{return toJs(e,createPrivate(a,b));}catch(...){napi_throw_error(e,nullptr,"Native create outcome unknown");return nullptr;}
}
napi_value Inspect(napi_env e,napi_callback_info i){
 size_t argc=1;napi_value args[1];std::string p;
 if(napi_get_cb_info(e,i,&argc,args,nullptr,nullptr)!=napi_ok||argc!=1||!readString(e,args[0],p)){
  napi_throw_type_error(e,nullptr,"inspectAcl requires an absolute pathname");return nullptr;
 }
 try{return toJs(e,inspectAcl(p));}catch(...){napi_throw_error(e,nullptr,"Native ACL readback unavailable");return nullptr;}
}
napi_value MakeBound(napi_env e,napi_callback_info i){
 size_t argc=2;napi_value args[2];
 if(napi_get_cb_info(e,i,&argc,args,nullptr,nullptr)!=napi_ok||argc!=2){
  napi_throw_type_error(e,nullptr,"createPrivateBound requires (absoluteParent,singleBasename)");return nullptr;
 }
 std::string a,b;if(!readString(e,args[0],a)||!readString(e,args[1],b)){
  napi_throw_type_error(e,nullptr,"Invalid UTF-8");return nullptr;
 }
 try{return toJs(e,createPrivateBound(a,b));}
 catch(...){napi_throw_error(e,nullptr,"Bound stage creation outcome unknown");return nullptr;}
}
napi_value Init(napi_env e,napi_value exports){
 napi_value f,g,h;napi_create_function(e,"createPrivate",NAPI_AUTO_LENGTH,Make,nullptr,&f);
 napi_create_function(e,"inspectAcl",NAPI_AUTO_LENGTH,Inspect,nullptr,&g);
 napi_create_function(e,"createPrivateBound",NAPI_AUTO_LENGTH,MakeBound,nullptr,&h);
 napi_set_named_property(e,exports,"createPrivate",f);napi_set_named_property(e,exports,"inspectAcl",g);
 napi_set_named_property(e,exports,"createPrivateBound",h);
 return exports;
}
} // namespace
NAPI_MODULE(i1_private_acl,Init)
