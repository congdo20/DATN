from typing import Optional, List, Union
from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from pydantic import IPvAnyAddress
from enum import Enum

class GioiTinhEnum(str, Enum):
    nam = "Nam"
    nu = "Nu"
    khac = "Khac"

class TrangThaiEnum(str, Enum):
    hoat_dong = "Hoat Dong"
    khoa = "Khoa"
    tam_ngung = "Tam Ngung"

# Base Config for all models (replaces individual Config classes)
class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# Region (KhuVuc) Schemas
class KhuVucBase(BaseSchema):
    TenKhuVuc: str = Field(..., max_length=100)
class KhuVucCreate(KhuVucBase):
    pass
class KhuVucUpdate(KhuVucBase):
    pass
class KhuVucUpdateName(BaseSchema):
    TenKhuVuc: str = Field(..., max_length=100)
class KhuVuc(KhuVucBase):
    IdKhuVuc: int


# Camera Schemas
class CameraBase(BaseSchema):
    IpCamera: str
    ViTriLapDat: Optional[str] = Field(None, max_length=200)
    Latitude: Optional[float] = None   # Thêm dòng này
    Longitude: Optional[float] = None  # Thêm dòng này
    TrangThaiCamera: Optional[str] = Field("Hoat Dong", max_length=50)
    NgayLapDat: Optional[date] = None
    BaoTri: Optional[date] = None
class CameraCreate(CameraBase):
    IdKhuVuc: Optional[int] = None
class CameraUpdate(CameraBase):
    IdKhuVuc: Optional[int] = None
class CameraUpdateIp(BaseSchema):
    IpCamera: Union[str, IPvAnyAddress]
class CameraUpdateKhuVuc(BaseSchema):
    IdKhuVuc: Optional[int] = None
class CameraUpdateVitri(BaseSchema):
    ViTriLapDat: Optional[str] = Field(None, max_length=200)
class CameraUpdateStatus(BaseSchema):
    TrangThaiCamera: Optional[str] = Field("Hoat Dong", max_length=50)
class CameraUpdateNgayLapDat(BaseSchema):
    NgayLapDat: Optional[date] = None
class CameraUpdateBaoTri(BaseSchema):
    BaoTri: Optional[date] = None
class Camera(CameraBase):
    IdCamera: int
    # IdKhuVuc: Optional[int] = None
    khuvuc: Optional[KhuVuc] = None
class CameraFilter(BaseSchema):
    IdKhuVuc: Optional[int] = None
    TrangThaiCamera: Optional[str] = None
    IpCamera: Optional[Union[str, IPvAnyAddress]] = None
    ViTriLapDat: Optional[str] = None
    
    
    

# Image (Anh) Schemas
class AnhBase(BaseSchema):
    ThoiGian: datetime
    DuongDan: str = Field(..., max_length=500)
    KichThuoc: Optional[float] = Field(None, gt=0)
class AnhCreate(AnhBase):
    IdCamera: int
class AnhUpdate(AnhBase):
    IdCamera: Optional[int] = None
    ThoiGian: Optional[datetime] = None
    DuongDan: Optional[str] = Field(None, max_length=500)
    KichThuoc: Optional[float] = Field(None, gt=0)
class AnhUpdateCamera(BaseSchema):
    IdCamera: Optional[int] = None
class AnhUpdateThoiGian(BaseSchema):
    ThoiGian: Optional[datetime] = None
class AnhUpdateDuongDan(BaseSchema):
    DuongDan: str = Field(..., max_length=500)
class AnhUpdateKichThuoc(BaseSchema):
    KichThuoc: Optional[float] = Field(None, gt=0)
class Anh(AnhBase):
    IdAnh: int
    camera: Optional[Camera] = None
class AnhFilter(BaseSchema):
    IdCamera: Optional[int] = None
    ThoiGian: Optional[datetime] = None
    DuongDan: Optional[str] = None
    KichThuoc: Optional[float] = None



class TaiKhoanBase(BaseSchema):
    VaiTro: str
    TenNguoiDung: str = Field(..., max_length=100)
    # SoDienThoai: Optional[str] = Field(None, pattern=r"^\+?[0-9]{10,15}$")
    SoDienThoai: Optional[str] = Field(None, pattern=r"^0[0-9]{9}$")
    Email: Optional[EmailStr] = None
    MatKhau: str
    NgaySinh: Optional[date] = None
    GioiTinh: Optional[GioiTinhEnum] = None
    TrangThai: Optional[TrangThaiEnum] = TrangThaiEnum.hoat_dong
class TaiKhoanCreate(TaiKhoanBase):
    IdKhuVuc: Optional[int] = None
class TaiKhoanUpdate(BaseSchema):
    TenNguoiDung: Optional[str] = Field(..., max_length=100)
    # SoDienThoai: Optional[str] = Field(None, pattern=r"^\+?[0-9]{10,15}$")
    SoDienThoai: Optional[str] = Field(None, pattern=r"^0[0-9]{9}$")
    NgaySinh: Optional[date] = None
    GioiTinh: Optional[GioiTinhEnum] = None
    VaiTro: Optional[str] = Field(None, max_length=50)
    TrangThai: Optional[TrangThaiEnum] = TrangThaiEnum.hoat_dong  
    IdKhuVuc: Optional[int] = None
    MatKhau: Optional[str] = Field(None, min_length=8)
class TaiKhoanUpdateByEmail(BaseSchema):
    VaiTro: Optional[str] = Field(None, max_length=50)
    TenNguoiDung: str = Field(..., max_length=100)
    SoDienThoai: Optional[str] = Field(None, pattern=r"^\+?[0-9]{10,15}$")
    MatKhau: str = Field(..., min_length=8)
    IdKhuVuc: Optional[int] = None
    NgaySinh: Optional[date] = None
    GioiTinh: Optional[str] = Field(None, max_length=10)
    TrangThai: Optional[str] = Field(None, max_length=50)
class TaiKhoanUpdateVaiTro(BaseSchema):
    VaiTro: Optional[str] = Field(None, max_length=50)
class TaiKhoanUpdateTenNguoiDung(BaseSchema):
    TenNguoiDung: str = Field(..., max_length=100)
class TaiKhoanUpdateSoDienThoai(BaseSchema):
    SoDienThoai: Optional[str] = Field(None, pattern=r"^\+?[0-9]{10,15}$")
class TaiKhoanUpdateMatKhau(BaseSchema):
    MatKhau: str = Field(..., min_length=8)
class TaiKhoanUpdateKhuVuc(BaseSchema):
    IdKhuVuc: Optional[int] = None
class TaiKhoanUpdateNgaySinh(BaseSchema):
    NgaySinh: Optional[date] = None
class TaiKhoanUpdateGioiTinh(BaseSchema):
    GioiTinh: Optional[GioiTinhEnum] = None
class TaiKhoanUpdateTrangThai(BaseSchema):
    TrangThai: Optional[TrangThaiEnum] = TrangThaiEnum.hoat_dong
class TaiKhoan(TaiKhoanBase):
    IdTaiKhoan: int
    khuvuc: Optional[KhuVuc] = None
class TaiKhoanFilter(BaseSchema):
    IdKhuVuc: Optional[int] = None
    VaiTro: Optional[str] = None
    TenNguoiDung: Optional[str] = None
    SoDienThoai: Optional[str] = None
    Email: Optional[EmailStr] = None
    MatKhau: Optional[str] = None
    NgaySinh: Optional[date] = None
    GioiTinh: Optional[GioiTinhEnum] = None
    TrangThai: Optional[TrangThaiEnum] = TrangThaiEnum.hoat_dong
class PhoneCheckResponse(BaseModel):
    exists: bool
    userId: int | None = None
    




class PhuongTienBase(BaseSchema):
    ChuSoHuu: str = Field(..., max_length=255) 
    BienSo: str = Field(..., max_length=20) 
    KieuXe: str = Field(..., max_length=50) 
    MauSac: str = Field(..., max_length=30) 
class PhuongTienCreate(PhuongTienBase):
    pass
class PhuongTienUpdate(PhuongTienBase):
    ChuSoHuu: Optional[str] = Field(None, max_length=255)
    BienSo: Optional[str] = Field(None, max_length=20) # BienSo là UNIQUE, cẩn thận khi cho phép update
    KieuXe: Optional[str] = Field(None, max_length=50)
    MauSac: Optional[str] = Field(None, max_length=30)
class PhuongTienUpdateChuSoHuu(BaseSchema):
    ChuSoHuu: Optional[str] = Field(None, max_length=255)
class PhuongTienUpdateBienSo(BaseSchema):
    BienSo: str = Field(..., max_length=20)  # BienSo là UNIQUE, cẩn thận khi cho phép update
class PhuongTienUpdateKieuXe(BaseSchema):
    KieuXe: Optional[str] = Field(None, max_length=50)
class PhuongTienUpdateMauSac(BaseSchema):
    MauSac: Optional[str] = Field(None, max_length=30)
class PhuongTien(PhuongTienBase):
    IdPhuongTien: int
class PhuongTienFilter(BaseSchema):
    BienSo: Optional[str]
    KieuXe: Optional[str]
    MauSac: Optional[str]
    ChuSoHuu: Optional[str]






class NhanDangPhuongTienBase(BaseSchema):
    ThoiGian: datetime
    ViTri: Optional[str] = None
    DoTinCay: Optional[float] = None
class NhanDangPhuongTienCreate(NhanDangPhuongTienBase):
    IdPhuongTien: int
    IdCamera: int
    IdAnh: int
    # phuongtien: Optional[PhuongTien] = None
    # camera: Optional[Camera] = None
    
class NhanDangPhuongTienUpdate(NhanDangPhuongTienBase):
    IdPhuongTien: int
    IdCamera: int
    IdAnh: int
class NhanDangPhuongTienUpdatePhuongTien(BaseSchema):
    IdPhuongTien: int
class NhanDangPhuongTienUpdateCamera(BaseSchema):
    IdCamera: int
class NhanDangPhuongTienUpdateAnh(BaseSchema):
    IdAnh: int
class NhanDangPhuongTienUpdateThoiGian(BaseSchema):
    ThoiGian: Optional[datetime] = None
class NhanDangPhuongTienUpdateViTri(BaseSchema):
    ViTri: Optional[str] = None
class NhanDangPhuongTienUpdateDoTinCay(BaseSchema):
    DoTinCay: Optional[float] = None
class NhanDangPhuongTien(NhanDangPhuongTienBase):
    IdNhanDangPhuongTien: int
    # IdPhuongTien: int
    # IdCamera: int
    phuongtien: Optional[PhuongTien] = None
    # camera: Optional[Camera] = None
    anh: Optional[Anh] = None
class NhanDangPhuongTienFilter(BaseSchema):
    IdPhuongTien: Optional[int] = None
    IdCamera: Optional[int] = None
    ThoiGian: Optional[datetime] = None
    ViTri: Optional[str] = None
    DoTinCay: Optional[float] = None
class DoTinCayUpdate(BaseModel):
    DoTinCay: float



# DanhMucViPham
class DanhMucViPhamBase(BaseSchema):
    LoaiViPham: str
    MucPhat: float
class DanhMucViPhamCreate(DanhMucViPhamBase):
    pass
class DanhMucViPhamUpdate(DanhMucViPhamBase):
    pass
class DanhMucViPhamUpdateLoaiViPham(BaseSchema):
    LoaiViPham: str
class DanhMucViPhamUpdateMucPhat(BaseSchema):
    MucPhat: float
class DanhMucViPham(DanhMucViPhamBase):
    IdDanhMuc: int
class DanhMucViPhamFilter(BaseSchema):
    LoaiViPham: Optional[str] = None
    MucPhat: Optional[float] = None
# class ViPhamBase(BaseSchema):
#     TrangThai: str = Field(..., max_length=50)

# class ViPhamCreate(ViPhamBase):
#     IdPhuongTien: int
#     IdDanhMuc: int
#     IdAnh: int
#     TrangThai: str = Field(..., max_length=50)
    
# class ViPhamUpdate(ViPhamBase):
#     IdPhuongTien: int
#     IdDanhMuc: int
#     IdAnh: int
#     TrangThai: str = Field(..., max_length=50)

# class ViPham(ViPhamBase):
#     IdViPham: int
#     IdPhuongTien: int
#     IdDanhMuc: int
#     IdAnh: Optional[int] = None
    
#     anh: Optional[Anh]
#     danhmucvipham: Optional[DanhMucViPham]




class PhatHienViPhamBase(BaseSchema):
    ThoiGian: datetime
    ViTri: Optional[str] = None
    TrangThai: Optional[str] = "Chua Xu Ly"
    # DuongDanHinhAnh: Optional[str] = None
class PhatHienViPhamCreate(PhatHienViPhamBase):
    IdCamera: int
    IdPhuongTien: int
    IdDanhMuc: Optional[int] = None
    IdAnh: int
class PhatHienViPhamUpdate(PhatHienViPhamBase):
    IdCamera: int
    IdPhuongTien: int
    IdDanhMuc: Optional[int] = None
    IdAnh: int
class PhatHienViPhamUpdateCamera(BaseSchema):
    IdCamera: int
class PhatHienViPhamUpdatePhuongTien(BaseSchema):
    IdPhuongTien: int
class PhatHienViPhamUpdateDanhMuc(BaseSchema):
    IdDanhMuc: Optional[int] = None
class PhatHienViPhamUpdateAnh(BaseSchema):
    IdAnh: int
class PhatHienViPhamUpdateThoiGian(BaseSchema):
    ThoiGian: Optional[datetime] = None
class PhatHienViPhamUpdateViTri(BaseSchema):
    ViTri: Optional[str] = None
class PhatHienViPhamUpdateTrangThai(BaseSchema):
    TrangThai: Optional[str] = "Chua Xu Ly"
class PhatHienViPham(PhatHienViPhamBase):
    IdPhatHien: int
    # camera: Optional[Camera] = None
    phuongtien: Optional[PhuongTien] = None
    danhmuc: Optional[DanhMucViPham] = None
    anh: Optional[Anh] = None
    # IdViPham: int
    # IdCamera: int
    # vipham: Optional[ViPham] = None
    # camera: Optional[Camera] = None
class PhatHienViPhamFilter(BaseSchema):
    IdCamera: Optional[int] = None
    IdPhuongTien: Optional[int] = None
    IdDanhMuc: Optional[int] = None
    ThoiGian: Optional[datetime] = None
    ViTri: Optional[str] = None
    TrangThai: Optional[str] = "Chua Xu Ly"
    # DuongDanHinhAnh: Optional[str] = None




# class NguoiBase(BaseSchema):
#     Tuoi: Optional[int] = None
#     GioiTinh: Optional[str] = None
#     DacTrung: Optional[str] = None

# class NguoiCreate(NguoiBase):
#     IdAnh: Optional[int] = None
    
# class NguoiUpdate(NguoiBase):
#     IdAnh: Optional[int] = None

# class Nguoi(NguoiBase):
#     IdNguoi: int
#     IdAnh: Optional[int] = None
    
#     anh: Optional[Anh] = None



class DacTrungData(BaseSchema):
    TrangPhuc: Optional[str] = None
    PhuKien: Optional[str] = None
    HinhDang: Optional[str] = None
    Toc: Optional[str] = None
class NhanDangNguoiBase(BaseSchema):
    Tuoi: Optional[int] = None
    GioiTinh: Optional[str] = None
    # DacTrung: Optional[dict] = None
    DacTrung: DacTrungData
    ThoiGian: datetime
    ViTri: Optional[str] = None
    DoTinCay: Optional[float] = None
class NhanDangNguoiCreate(NhanDangNguoiBase):
    IdCamera: int
    IdAnh: int
    Tuoi: Optional[int] = None
    GioiTinh: Optional[str] = None
    # DacTrung: Optional[dict] = None
    DacTrung: DacTrungData
    ThoiGian: datetime
    ViTri: Optional[str] = None
    DoTinCay: Optional[float] = None
class NhanDangNguoiUpdate(NhanDangNguoiBase):
    IdCamera: int
    IdAnh: int
    Tuoi: Optional[int] = None
    GioiTinh: Optional[str] = None
    # DacTrung: Optional[dict] = None
    DacTrung: DacTrungData
    ThoiGian: datetime
    ViTri: Optional[str] = None
    DoTinCay: Optional[float] = None
class NhanDangNguoiUpdateCamera(BaseSchema):
    IdCamera: int
class NhanDangNguoiUpdateAnh(BaseSchema):
    IdAnh: int
class NhanDangNguoiUpdateTuoi(BaseSchema):
    Tuoi: Optional[int] = None
class NhanDangNguoiUpdateGioiTinh(BaseSchema):
    GioiTinh: Optional[str] = None
class NhanDangNguoiUpdateDacTrung(BaseSchema):
    DacTrung: DacTrungData
class NhanDangNguoiUpdateThoiGian(BaseSchema):
    ThoiGian: Optional[datetime] = None
class NhanDangNguoiUpdateViTri(BaseSchema):
    ViTri: Optional[str] = None
class NhanDangNguoiUpdateDoTinCay(BaseSchema):
    DoTinCay: Optional[float] = None
class NhanDangNguoi(NhanDangNguoiBase):
    IdNhanDangNguoi: int
    # IdCamera: int
    anh: Optional[Anh] = None
class NhanDangNguoiFilter(BaseSchema):
    IdCamera: Optional[int] = None
    IdAnh: Optional[int] = None
    Tuoi: Optional[int] = None
    GioiTinh: Optional[str] = None
    DacTrung: Optional[DacTrungData] = None
    ThoiGian: Optional[datetime] = None
    ViTri: Optional[str] = None
    DoTinCay: Optional[float] = None

# class UpdateDoTinCayRequest(BaseModel):
#     DoTinCay: float
class UpdateDoTinCayRequest(BaseModel):
    DoTinCay: float = Field(..., ge=0, le=1, description="Giá trị từ 0.0 đến 1.0")



class TinhTrangGiaoThongBase(BaseSchema):
    ThoiGian: datetime
    MatDoGiaoThong: str
    TocDoTrungBinh: Optional[float] = None
class TinhTrangGiaoThongCreate(TinhTrangGiaoThongBase):
    IdCamera: int
class TinhTrangGiaoThongUpdate(TinhTrangGiaoThongBase):
    IdCamera: int
class TinhTrangGiaoThongUpdateCamera(BaseSchema):
    IdCamera: int
class TinhTrangGiaoThongUpdateThoiGian(BaseSchema):
    ThoiGian: Optional[datetime] = None
class TinhTrangGiaoThongUpdateMatDo(BaseSchema):
    MatDoGiaoThong: str
class TinhTrangGiaoThongUpdateTocDo(BaseSchema):
    TocDoTrungBinh: Optional[float] = None
class TinhTrangGiaoThong(TinhTrangGiaoThongBase):
    IdTinhTrang: int
    # IdCamera: int
    camera: Optional[Camera] = None
class TinhTrangGiaoThongFilter(BaseSchema):
    IdCamera: Optional[int] = None
    ThoiGian: Optional[datetime] = None
    MatDoGiaoThong: Optional[str] = None
    TocDoTrungBinh: Optional[float] = None
    
class ThongKeGiaoThong(BaseSchema):
    camera_id: int
    toc_do_trung_binh: float
    so_lan_kiem_tra: int
    toc_do_cao_nhat: float
    toc_do_thap_nhat: float
    thoi_gian_bat_dau: Optional[datetime] = None
    thoi_gian_ket_thuc: Optional[datetime] = None

# Traffic Density Distribution Schema
class PhanBoMatDo(BaseSchema):
    mat_do: str
    so_luong: int




# Relationship Schemas
class KhuVucWithCameras(KhuVuc):
    cameras: List[Camera] = []
class CameraWithImages(Camera):
    anhs: List[Anh] = [] 
class CameraWithAll(Camera):
    anhs: List[Anh] = []
    nhandangphuongtiens: List[NhanDangPhuongTien] = []
    phathienvipham: List[PhatHienViPham] = []
    nhandangnguois: List[NhanDangNguoi] = []
    tinhtranggiaothongs: List[TinhTrangGiaoThong] = []
class CameraWithKhuVuc(Camera):
    khuvuc: Optional[KhuVuc] = None # Thay khu_vuc
    anh: List[Anh] = []
    tinhtranggiaothong: List['TinhTrangGiaoThong'] = [] # Thay tinh_trang_giao_thong
class PhuongTienWithNhanDang(PhuongTien):
    nhandangphuongtien: List['NhanDangPhuongTien'] = [] # Thay nhan_dang
    phathienvipham: List['PhatHienViPham'] = [] # Thay phat_hien_vi_pham
# Authentication Schemas
class Token(BaseSchema):
    access_token: str
    token_type: str
class TokenData(BaseSchema):
    email: Optional[str] = None
    role: Optional[str] = None
# Utility Schemas
class PaginatedResponse(BaseSchema):
    total: int
    page: int
    per_page: int
    items: List[Union[
        KhuVuc, Camera, TaiKhoan, PhuongTien, DanhMucViPham, TinhTrangGiaoThong, Anh
    ]]
class StatsResponse(BaseSchema):
    total_cameras: int
    active_cameras: int
    total_violations: int
    pending_violations: int
# Filter Schemas
# class CameraFilter(BaseSchema):
#     trang_thai: Optional[str] = None
#     id_khu_vuc: Optional[int] = None
#     ip_camera: Optional[str] = None

# class PhuongTienFilter(BaseSchema):
#     bien_so: Optional[str] = None
#     kieu_xe: Optional[str] = None
#     mau_sac: Optional[str] = None

# Traffic Statistics Schema

    
