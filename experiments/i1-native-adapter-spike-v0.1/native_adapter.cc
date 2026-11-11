#define NAPI_VERSION 8
#include <node_api.h>
#include <string>
#include <vector>
#include <cstdio>
#include <cstring>
#include <cstdint>
#include <cstddef>
#include <sstream>
#include <iomanip>
#ifdef _WIN32
#define NOMINMAX
#include <windows.h>
#else
#include <cerrno>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#ifdef __linux__
#include <sys/syscall.h>
#include <sys/vfs.h>
#ifndef RENAME_NOREPLACE
#define RENAME_NOREPLACE (1u)
#endif
#else
#include <sys/mount.h>
extern "C" int renameatx_np(int, const char*, int, const char*, unsigned int);
#ifndef RENAME_EXCL
#define RENAME_EXCL (0x00000004u)
#endif
#endif
#endif
namespace {
struct Result {
  bool committed = false;
  bool locatorConfirmed = false;
  std::string status = "PRECONDITION_FAILED";
  std::string api = "NONE";
  std::string sourceId = "";
  std::string parentId = "";
  std::string volume = "UNKNOWN";
  uint32_t rawCode = 0;
  std::string errorNamespace = "NONE";
};
std::string hex64(uint64_t x) { std::ostringstream s; s << std::hex << std::setw(16) << std::setfill('0') << x; return s.str(); }
void setStr(napi_env env,napi_value o,const char* k,const std::string& s){napi_value v; napi_create_string_utf8(env,s.c_str(),s.size(),&v);napi_set_named_property(env,o,k,v);}
void setBool(napi_env env,napi_value o,const char* k,bool b){napi_value v; napi_get_boolean(env,b,&v);napi_set_named_property(env,o,k,v);}
void setNum(napi_env env,napi_value o,const char* k,uint32_t n){napi_value v; napi_create_uint32(env,n,&v);napi_set_named_property(env,o,k,v);}
napi_value resultToJs(napi_env env, const Result& r){napi_value v; napi_create_object(env,&v);setStr(env,v,"status",r.status);setStr(env,v,"api",r.api);setStr(env,v,"sourceIdentity",r.sourceId);setStr(env,v,"parentIdentity",r.parentId);setStr(env,v,"filesystem",r.volume);setStr(env,v,"errorNamespace",r.errorNamespace);setNum(env,v,"rawCode",r.rawCode);setBool(env,v,"committed",r.committed);setBool(env,v,"locatorConfirmed",r.locatorConfirmed);setBool(env,v,"noFallback",true);return v;}
bool nameOk(const std::string& s){if(s.empty()||s=="."||s==".."||s.size()>240)return false;for(unsigned char c:s){if(c==0||c=='/'||c=='\\'||c==':')return false;}return true;}
#ifdef _WIN32
std::wstring wutf(const std::string& s){int n=MultiByteToWideChar(CP_UTF8,MB_ERR_INVALID_CHARS,s.c_str(),static_cast<int>(s.size()),nullptr,0);if(n<=0)return {};std::wstring w(static_cast<size_t>(n),L'\0');if(!MultiByteToWideChar(CP_UTF8,MB_ERR_INVALID_CHARS,s.c_str(),static_cast<int>(s.size()),&w[0],n))return {};return w;}
bool absOk(const std::string& s){std::wstring w=wutf(s);return !w.empty() && ((w.size()>2 && ((w[1]==L':' && (w[2]==L'\\'||w[2]==L'/')))) || (w.size()>3&&w[0]==L'\\'&&w[1]==L'\\'));}
struct WinHandle {HANDLE h=INVALID_HANDLE_VALUE;WinHandle()=default;WinHandle(const WinHandle&)=delete;WinHandle& operator=(const WinHandle&)=delete;WinHandle(WinHandle&& other) noexcept:h(other.h){other.h=INVALID_HANDLE_VALUE;}WinHandle& operator=(WinHandle&& other) noexcept{if(this!=&other){if(h!=INVALID_HANDLE_VALUE)CloseHandle(h);h=other.h;other.h=INVALID_HANDLE_VALUE;}return *this;}~WinHandle(){if(h!=INVALID_HANDLE_VALUE)CloseHandle(h);}bool ok()const{return h!=INVALID_HANDLE_VALUE;}};
std::string idWin(HANDLE h){BY_HANDLE_FILE_INFORMATION i{};if(!GetFileInformationByHandle(h,&i))return "UNKNOWN";return hex64(i.dwVolumeSerialNumber)+":"+hex64((uint64_t(i.nFileIndexHigh)<<32)|i.nFileIndexLow);}
std::string winFs(HANDLE h){wchar_t fs[80]={};if(!GetVolumeInformationByHandleW(h,nullptr,0,nullptr,nullptr,nullptr,fs,80))return "UNKNOWN";int n=WideCharToMultiByte(CP_UTF8,0,fs,-1,nullptr,0,nullptr,nullptr);if(n<=1)return "UNKNOWN";std::string o(static_cast<size_t>(n),'\0');if(WideCharToMultiByte(CP_UTF8,0,fs,-1,&o[0],n,nullptr,nullptr)<=0)return "UNKNOWN";o.resize(static_cast<size_t>(n-1));return o;}
std::wstring joinWin(const std::wstring& a,const std::wstring& b){return a+(a.back()==L'\\'||a.back()==L'/'?L"":L"\\")+b;}
WinHandle openDir(const std::wstring& p,DWORD access){WinHandle h;h.h=CreateFileW(p.c_str(),access,FILE_SHARE_READ|FILE_SHARE_WRITE|FILE_SHARE_DELETE,nullptr,OPEN_EXISTING,FILE_FLAG_BACKUP_SEMANTICS|FILE_FLAG_OPEN_REPARSE_POINT,nullptr);if(h.ok()){DWORD a=GetFileAttributesW(p.c_str());if(a==INVALID_FILE_ATTRIBUTES||!(a&FILE_ATTRIBUTE_DIRECTORY)||(a&FILE_ATTRIBUTE_REPARSE_POINT)){CloseHandle(h.h);h.h=INVALID_HANDLE_VALUE;SetLastError(ERROR_ACCESS_DENIED);}}return h;}
struct NtIoStatus {union{LONG Status;void* Pointer;};ULONG_PTR Information;};
struct RenameHeader{BYTE Replace; BYTE Reserved[7]; HANDLE RootDirectory; DWORD FileNameLength; WCHAR FileName[1];};
using NtSetInfo=LONG (NTAPI*)(HANDLE,NtIoStatus*,void*,ULONG,int);
Result commit(const std::string& sp,const std::string& sn,const std::string& dp,const std::string& dn){
  Result r;r.api="ntdll!NtSetInformationFile(FileRenameInformation=10,ReplaceIfExists=FALSE)";r.errorNamespace="NTSTATUS";
  std::wstring a=wutf(sp),b=wutf(dp),as=wutf(sn),bs=wutf(dn);
  if(a.empty()||b.empty()||as.empty()||bs.empty()||!absOk(sp)||!absOk(dp)){r.status="REFUSED_INVALID_ARGUMENT";return r;}
  WinHandle parent=openDir(b,FILE_TRAVERSE|FILE_READ_ATTRIBUTES);
  if(!parent.ok()){r.rawCode=GetLastError();r.errorNamespace="Win32";r.status="REFUSED_PARENT_HANDLE";return r;}
  WinHandle srcParent=openDir(a,FILE_TRAVERSE|FILE_READ_ATTRIBUTES);
  if(!srcParent.ok()){r.rawCode=GetLastError();r.errorNamespace="Win32";r.status="REFUSED_SOURCE_PARENT";return r;}
  WinHandle src=openDir(joinWin(a,as),DELETE|FILE_READ_ATTRIBUTES);
  if(!src.ok()){r.rawCode=GetLastError();r.errorNamespace="Win32";r.status="REFUSED_SOURCE_OBJECT";return r;}
  r.sourceId=idWin(src.h);r.parentId=idWin(parent.h);r.volume=winFs(parent.h);
  HMODULE ntdll=GetModuleHandleW(L"ntdll.dll");NtSetInfo native=ntdll?reinterpret_cast<NtSetInfo>(GetProcAddress(ntdll,"NtSetInformationFile")):nullptr;
  if(!native){r.status="REFUSED_NATIVE_UNAVAILABLE";return r;}
  const size_t offset=offsetof(RenameHeader,FileName),bytes=bs.size()*sizeof(WCHAR);
  std::vector<unsigned char> buffer(offset+bytes+sizeof(WCHAR),0);
  auto* p=reinterpret_cast<RenameHeader*>(buffer.data());p->Replace=FALSE;p->RootDirectory=parent.h;p->FileNameLength=static_cast<DWORD>(bytes);
  memcpy(buffer.data()+offset,bs.data(),bytes);
  NtIoStatus ios{};LONG rc=native(src.h,&ios,p,static_cast<ULONG>(buffer.size()),10);
  r.rawCode=static_cast<uint32_t>(rc);
  if(rc!=0){r.status=static_cast<uint32_t>(rc)==0xC0000035u?"REFUSED_ALREADY_EXISTS":"REFUSED_NATIVE_ERROR";return r;}
  r.committed=true;
  WinHandle parentAgain=openDir(b,FILE_TRAVERSE|FILE_READ_ATTRIBUTES);
  WinHandle target=openDir(joinWin(b,bs),FILE_READ_ATTRIBUTES);
  r.locatorConfirmed=parentAgain.ok()&&target.ok()&&idWin(parentAgain.h)==r.parentId&&idWin(target.h)==r.sourceId;
  r.status=r.locatorConfirmed?"COMMITTED_CONFIRMED":"COMMITTED_LOCATOR_UNCONFIRMED";
  return r;
}
#else
bool absOk(const std::string& s){return !s.empty()&&s[0]=='/';}
struct FD{int fd=-1;~FD(){if(fd>=0)close(fd);}bool ok()const{return fd>=0;}};
std::string idPosix(const struct stat& s){return hex64(static_cast<uint64_t>(s.st_dev))+":"+hex64(static_cast<uint64_t>(s.st_ino));}
Result commit(const std::string& sp,const std::string& sn,const std::string& dp,const std::string& dn){
  Result r;
#ifdef __linux__
  r.api="syscall(renameat2,RENAME_NOREPLACE)";
#else
  r.api="renameatx_np(RENAME_EXCL)";
#endif
  r.errorNamespace="POSIX_errno";
  if(!absOk(sp)||!absOk(dp)){r.status="REFUSED_INVALID_ARGUMENT";return r;}
  int flags=O_RDONLY|O_DIRECTORY|O_CLOEXEC;
#ifdef O_NOFOLLOW
  flags|=O_NOFOLLOW;
#endif
  FD srcParent,dstParent,src;
  srcParent.fd=open(sp.c_str(),flags);if(!srcParent.ok()){r.status="REFUSED_SOURCE_PARENT";r.rawCode=errno;return r;}
  dstParent.fd=open(dp.c_str(),flags);if(!dstParent.ok()){r.status="REFUSED_PARENT_HANDLE";r.rawCode=errno;return r;}
  src.fd=openat(srcParent.fd,sn.c_str(),flags);if(!src.ok()){r.status="REFUSED_SOURCE_OBJECT";r.rawCode=errno;return r;}
  struct stat ss{},ps{};if(fstat(src.fd,&ss)||fstat(dstParent.fd,&ps)){r.status="REFUSED_STAT";r.rawCode=errno;return r;}
  r.sourceId=idPosix(ss);r.parentId=idPosix(ps);
#ifdef __linux__
  struct statfs fss{};if(fstatfs(dstParent.fd,&fss)==0)r.volume="linux-f_type:"+hex64(static_cast<uint64_t>(fss.f_type));
  int rc=static_cast<int>(syscall(SYS_renameat2,srcParent.fd,sn.c_str(),dstParent.fd,dn.c_str(),RENAME_NOREPLACE));
#else
  struct statfs fss{};if(fstatfs(dstParent.fd,&fss)==0)r.volume=fss.f_fstypename;
  int rc=renameatx_np(srcParent.fd,sn.c_str(),dstParent.fd,dn.c_str(),RENAME_EXCL);
#endif
  if(rc!=0){r.rawCode=errno;r.status=errno==EEXIST?"REFUSED_ALREADY_EXISTS":(errno==ENOSYS||errno==EINVAL||errno==ENOTSUP?"REFUSED_NATIVE_UNSUPPORTED":"REFUSED_NATIVE_ERROR");return r;}
  r.committed=true;
  struct stat after{},reopened{},dir{};
  bool viafd=fstatat(dstParent.fd,dn.c_str(),&after,AT_SYMLINK_NOFOLLOW)==0&&idPosix(after)==r.sourceId;
  bool viapath=lstat((dp+"/"+dn).c_str(),&reopened)==0&&idPosix(reopened)==r.sourceId;
  bool dirpath=stat(dp.c_str(),&dir)==0&&idPosix(dir)==r.parentId;
  r.locatorConfirmed=viafd&&viapath&&dirpath;
  r.status=r.locatorConfirmed?"COMMITTED_CONFIRMED":"COMMITTED_LOCATOR_UNCONFIRMED";
  return r;
}
#endif
bool readStr(napi_env env,napi_value v,std::string& out){napi_valuetype t; if(napi_typeof(env,v,&t)!=napi_ok||t!=napi_string)return false;size_t n=0;if(napi_get_value_string_utf8(env,v,nullptr,0,&n)!=napi_ok||n>8192)return false;std::vector<char> a(n+1,0);if(napi_get_value_string_utf8(env,v,a.data(),a.size(),&n)!=napi_ok)return false;out.assign(a.data(),n);return true;}
napi_value Rename(napi_env env,napi_callback_info info){size_t argc=4;napi_value args[4]; if(napi_get_cb_info(env,info,&argc,args,nullptr,nullptr)!=napi_ok||argc!=4){napi_throw_type_error(env,nullptr,"Exactly four string arguments required");return nullptr;}std::string s[4];for(int i=0;i<4;i++)if(!readStr(env,args[i],s[i])){napi_throw_type_error(env,nullptr,"Invalid UTF-8 path argument");return nullptr;}if(!nameOk(s[1])||!nameOk(s[3])){napi_throw_type_error(env,nullptr,"Single-component basenames required");return nullptr;}try{return resultToJs(env,commit(s[0],s[1],s[2],s[3]));}catch(...){napi_throw_error(env,nullptr,"Native adapter internal failure; commit state unknown");return nullptr;}}
napi_value Init(napi_env env,napi_value exports){napi_value fn; napi_create_function(env,"renameNoReplace",NAPI_AUTO_LENGTH,Rename,nullptr,&fn);napi_set_named_property(env,exports,"renameNoReplace",fn);return exports;}
} // namespace
NAPI_MODULE(i1_native_spike,Init)
