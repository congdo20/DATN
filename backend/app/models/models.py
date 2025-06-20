from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Enum, Date, DateTime, Text, ForeignKey
)
from sqlalchemy.orm import relationship
from ..database import Base
from sqlalchemy.dialects.mysql import JSON

# Khu vực
class KhuVuc(Base):
    __tablename__ = "KhuVuc"

    IdKhuVuc = Column(Integer, primary_key=True, index=True, autoincrement=True)
    TenKhuVuc = Column(String(255), nullable=False)

    camera = relationship("Camera", back_populates="khuvuc")
    taikhoan = relationship("TaiKhoan", back_populates="khuvuc")


# Tài khoản
class TaiKhoan(Base):
    __tablename__ = "TaiKhoan"

    IdTaiKhoan = Column(Integer, primary_key=True, index=True, autoincrement=True)
    IdKhuVuc = Column(Integer, ForeignKey("KhuVuc.IdKhuVuc", ondelete="CASCADE"))
    VaiTro = Column(Enum('Quan Tri', 'Nhan Vien', 'Giam Sat', 'Nguoi Dan', 'Nguoi Dung'), nullable=False)
    TenNguoiDung = Column(String(255), nullable=False)
    SoDienThoai = Column(String(15), unique=True)
    Email = Column(String(255), unique=True)
    MatKhau = Column(String(255), nullable=False)
    NgaySinh = Column(Date)
    GioiTinh = Column(Enum('Nam', 'Nu', 'Khac'))
    TrangThai = Column(Enum('Hoat Dong', 'Khoa', 'Tam Ngung'), default='Hoat Dong')

    khuvuc = relationship("KhuVuc", back_populates="taikhoan")


# Camera
class Camera(Base):
    __tablename__ = "Camera"

    IdCamera = Column(Integer, primary_key=True, index=True, autoincrement=True)
    IpCamera = Column(String(255), unique=True, nullable=False)
    IdKhuVuc = Column(Integer, ForeignKey("KhuVuc.IdKhuVuc", ondelete="SET NULL"))
    ViTriLapDat = Column(String(255))
    Latitude = Column(Float)  # Thêm dòng này
    Longitude = Column(Float) # Thêm dòng này
    TrangThaiCamera = Column(Enum('Hoat Dong', 'Khong Hoat Dong', 'Hu Hong', 'Bao Tri'),
                             default='Hoat Dong')
    NgayLapDat = Column(Date)
    BaoTri = Column(Date)

    khuvuc = relationship("KhuVuc", back_populates="camera")
    anh = relationship("Anh", back_populates="camera")
    nhandangphuongtien = relationship("NhanDangPhuongTien", back_populates="camera")
    nhandangnguoi = relationship("NhanDangNguoi", back_populates="camera")
    tinhtranggiaothong = relationship("TinhTrangGiaoThong", back_populates="camera")
    phathienvipham = relationship("PhatHienViPham", back_populates="camera")


# Ảnh
class Anh(Base):
    __tablename__ = "Anh"

    IdAnh = Column(Integer, primary_key=True, index=True, autoincrement=True)
    IdCamera = Column(Integer, ForeignKey("Camera.IdCamera", ondelete="CASCADE"), nullable=False)
    ThoiGian = Column(DateTime, default=datetime.utcnow)
    DuongDan = Column(Text, nullable=False)
    KichThuoc = Column(Float(10, 2))

    camera = relationship("Camera", back_populates="anh")
    phathienvipham = relationship("PhatHienViPham", back_populates="anh")
    nhandangnguoi = relationship("NhanDangNguoi", back_populates="anh")
    nhandangphuongtien = relationship("NhanDangPhuongTien", back_populates="anh")
    # vipham = relationship("ViPham", back_populates="anh")
    # nguoi = relationship("Nguoi", back_populates="anh")


# Phương tiện
class PhuongTien(Base):
    __tablename__ = "PhuongTien"

    IdPhuongTien = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ChuSoHuu = Column(String(255), nullable=False)
    BienSo = Column(String(20), unique=True, nullable=False)
    KieuXe = Column(String(50))
    MauSac = Column(String(30))

    nhandangphuongtien = relationship("NhanDangPhuongTien", back_populates="phuongtien")
    phathienvipham = relationship("PhatHienViPham", back_populates="phuongtien")
    # vipham = relationship("ViPham", back_populates="phuongtien")


# Nhận dạng phương tiện
class NhanDangPhuongTien(Base):
    __tablename__ = "NhanDangPhuongTien"

    IdNhanDangPhuongTien = Column(Integer, primary_key=True, index=True, autoincrement=True)
    IdPhuongTien = Column(Integer, ForeignKey("PhuongTien.IdPhuongTien", ondelete="CASCADE"), nullable=False)
    IdCamera = Column(Integer, ForeignKey("Camera.IdCamera", ondelete="CASCADE"), nullable=False)
    ThoiGian = Column(DateTime, default=datetime.utcnow)
    IdAnh = Column(Integer, ForeignKey("Anh.IdAnh", ondelete="SET NULL"), nullable=False)
    ViTri = Column(String(255))
    DoTinCay = Column(Float)

    phuongtien = relationship("PhuongTien", back_populates="nhandangphuongtien")
    camera = relationship("Camera", back_populates="nhandangphuongtien")
    anh = relationship("Anh", back_populates="nhandangphuongtien")


# Danh mục vi phạm
class DanhMucViPham(Base):
    __tablename__ = "DanhMucViPham"

    IdDanhMuc = Column(Integer, primary_key=True, index=True, autoincrement=True)
    LoaiViPham = Column(String(255), unique=True, nullable=False)
    MucPhat = Column(Float(10, 2), nullable=False)
    
    phathienvipham = relationship("PhatHienViPham", back_populates="danhmuc")

    # vipham = relationship("ViPham", back_populates="danhmuc")


# Vi phạm
# class ViPham(Base):
#     __tablename__ = "ViPham"

#     IdViPham = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     IdPhuongTien = Column(Integer, ForeignKey("PhuongTien.IdPhuongTien", ondelete="CASCADE"))
#     IdAnh = Column(Integer, ForeignKey("Anh.IdAnh", ondelete="CASCADE"))
#     IdDanhMuc = Column(Integer, ForeignKey("DanhMucViPham.IdDanhMuc", ondelete="SET NULL"))
#     TrangThai = Column(Enum('Chua Xu Ly', 'Da Xu Ly', 'Huy'), default='Chua Xu Ly')

#     phuongtien = relationship("PhuongTien", back_populates="vipham")
#     anh = relationship("Anh", back_populates="vipham")
#     danhmuc = relationship("DanhMucViPham", back_populates="vipham")
#     phathien = relationship("PhatHienViPham", back_populates="vipham")


# Phát hiện vi phạm
class PhatHienViPham(Base):
    __tablename__ = "PhatHienViPham"

    IdPhatHien = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # IdViPham = Column(Integer, ForeignKey("ViPham.IdViPham", ondelete="CASCADE"))
    IdCamera = Column(Integer, ForeignKey("Camera.IdCamera", ondelete="CASCADE"), nullable=False)
    ThoiGian = Column(DateTime, default=datetime.utcnow)
    ViTri = Column(String(255))
    IdPhuongTien = Column(Integer, ForeignKey("PhuongTien.IdPhuongTien", ondelete="SET NULL"), nullable=False)
    IdDanhMuc = Column(Integer, ForeignKey("DanhMucViPham.IdDanhMuc", ondelete="SET NULL"))
    IdAnh = Column(Integer, ForeignKey("Anh.IdAnh", ondelete="SET NULL"), nullable=False)
    TrangThai = Column(Enum('Chua Xu Ly', 'Da Xu Ly', 'Huy'), default='Chua Xu Ly')
    # DuongDanHinhAnh = Column(Text)
    # vipham = relationship("ViPham", back_populates="phathien")
    camera = relationship("Camera", back_populates="phathienvipham")
    phuongtien = relationship("PhuongTien", back_populates="phathienvipham")
    anh = relationship("Anh", back_populates="phathienvipham")
    danhmuc = relationship("DanhMucViPham", back_populates="phathienvipham")


# Người
# class Nguoi(Base):
#     __tablename__ = "Nguoi"

#     IdNguoi = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     Tuoi = Column(Integer)
#     GioiTinh = Column(Enum('Nam', 'Nu', 'Khac'))
#     DacTrung = Column(Text)
#     IdAnh = Column(Integer, ForeignKey("Anh.IdAnh", ondelete="SET NULL"))

#     anh = relationship("Anh", back_populates="nguoi")
#     nhandangnguoi = relationship("NhanDangNguoi", back_populates="nguoi")


# Nhận dạng người
class NhanDangNguoi(Base):
    __tablename__ = "NhanDangNguoi"

    IdNhanDangNguoi = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # IdNguoi = Column(Integer, ForeignKey("Nguoi.IdNguoi", ondelete="CASCADE"))
    Tuoi = Column(Integer)
    GioiTinh = Column(Enum('Nam', 'Nu', 'Khac'))
    DacTrung = Column(JSON, nullable=False)  # DacTrung lưu trữ các đặc điểm nhận dạng dưới dạng JSON
    IdAnh = Column(Integer, ForeignKey("Anh.IdAnh", ondelete="SET NULL"), nullable=False)
    IdCamera = Column(Integer, ForeignKey("Camera.IdCamera", ondelete="CASCADE"), nullable=False)
    ThoiGian = Column(DateTime, default=datetime.utcnow)
    ViTri = Column(String(255))
    DoTinCay = Column(Float)

    # nguoi = relationship("Nguoi", back_populates="nhandangnguoi")
    camera = relationship("Camera", back_populates="nhandangnguoi")
    anh = relationship("Anh", back_populates="nhandangnguoi")


# Tình trạng giao thông
class TinhTrangGiaoThong(Base):
    __tablename__ = "TinhTrangGiaoThong"

    IdTinhTrang = Column(Integer, primary_key=True, index=True, autoincrement=True)
    IdCamera = Column(Integer, ForeignKey("Camera.IdCamera", ondelete="CASCADE"), nullable=False)
    ThoiGian = Column(DateTime, default=datetime.utcnow)
    MatDoGiaoThong = Column(Enum('Thong Thoang', 'Dong Duc', 'Un Tac'))
    TocDoTrungBinh = Column(Float(6, 2))

    camera = relationship("Camera", back_populates="tinhtranggiaothong")





