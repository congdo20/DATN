from sqlalchemy.orm import Session
from models import models
from database import SessionLocal
from datetime import date

def seed_data():
    db: Session = SessionLocal()
    try:
        # KhuVuc
        khu_vucs = [
            models.KhuVuc(TenKhuVuc=name) for name in [
                'Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng', 'Tây Hồ',
                'Cầu Giấy', 'Thanh Xuân', 'Long Biên', 'Hoàng Mai', 'Nam Từ Liêm'
            ]
        ]
        db.add_all(khu_vucs)
        db.commit()

        # Camera
        cameras = [
            models.Camera(IpCamera='192.168.1.101', IdKhuVuc=1, ViTriLapDat='Ngã tư Hàng Bài - Tràng Tiền', TrangThaiCamera='Hoat Dong', NgayLapDat=date(2024,1,15)),
            models.Camera(IpCamera='192.168.1.102', IdKhuVuc=1, ViTriLapDat='Khu vực Hồ Gươm', TrangThaiCamera='Hoat Dong', NgayLapDat=date(2024,2,20)),
            models.Camera(IpCamera='192.168.1.103', IdKhuVuc=2, ViTriLapDat='Quảng trường Ba Đình', TrangThaiCamera='Hoat Dong', NgayLapDat=date(2024,3,10)),
            models.Camera(IpCamera='192.168.1.104', IdKhuVuc=2, ViTriLapDat='Đường Điện Biên Phủ', TrangThaiCamera='Hu Hong', NgayLapDat=date(2023,11,1), BaoTri=date(2024,3,15)),
            models.Camera(IpCamera='192.168.1.105', IdKhuVuc=3, ViTriLapDat='Ngã tư Thái Hà - Chùa Bộc', TrangThaiCamera='Hoat Dong', NgayLapDat=date(2024,4,5)),
            models.Camera(IpCamera='192.168.1.106', IdKhuVuc=3, ViTriLapDat='Khu vực Vincom Center Nguyễn Chí Thanh', TrangThaiCamera='Hoat Dong', NgayLapDat=date(2024,5,12)),
            models.Camera(IpCamera='192.168.1.107', IdKhuVuc=4, ViTriLapDat='Ngã tư Đại Cồ Việt - Trần Khát Chân', TrangThaiCamera='Hoat Dong', NgayLapDat=date(2024,6,22)),
            models.Camera(IpCamera='192.168.1.108', IdKhuVuc=4, ViTriLapDat='Khu vực Times City', TrangThaiCamera='Hoat Dong', NgayLapDat=date(2024,7,1)),
            models.Camera(IpCamera='192.168.1.109', IdKhuVuc=5, ViTriLapDat='Đường Thanh Niên', TrangThaiCamera='Hoat Dong', NgayLapDat=date(2024,8,18)),
            models.Camera(IpCamera='192.168.1.110', IdKhuVuc=5, ViTriLapDat='Khu vực Công viên Nước Hồ Tây', TrangThaiCamera='Hoat Dong', NgayLapDat=date(2024,9,25)),
        ]
        db.add_all(cameras)
        db.commit()

        # Anh
        anhs = [
            models.Anh(IdCamera=1, DuongDan='/images/camera1_20240115_1000.jpg', KichThuoc=1.25),
            models.Anh(IdCamera=1, DuongDan='/images/camera1_20240115_1005.jpg', KichThuoc=1.10),
            models.Anh(IdCamera=2, DuongDan='/images/camera2_20240220_1100.jpg', KichThuoc=0.98),
            models.Anh(IdCamera=3, DuongDan='/images/camera3_20240310_1200.jpg', KichThuoc=1.50),
            models.Anh(IdCamera=4, DuongDan='/images/camera4_20231101_0900.jpg', KichThuoc=1.05),
        ]
        db.add_all(anhs)
        db.commit()

        # TaiKhoan
        tai_khoans = [
            models.TaiKhoan(IdKhuVuc=1, VaiTro='Quan Tri', SoDienThoai='0901234567', Email='admin1@smartcity.vn', MatKhau='admin123', NgaySinh=date(1990,5,15), GioiTinh='Nam'),
            models.TaiKhoan(IdKhuVuc=2, VaiTro='Nhan Vien', SoDienThoai='0987654321', Email='staff1@smartcity.vn', MatKhau='staff456', NgaySinh=date(1995,8,22), GioiTinh='Nu'),
            models.TaiKhoan(IdKhuVuc=1, VaiTro='Giam Sat', SoDienThoai='0911223344', Email='monitor1@smartcity.vn', MatKhau='monitor789', NgaySinh=date(1988,12,10), GioiTinh='Nam'),
            models.TaiKhoan(IdKhuVuc=3, VaiTro='Nhan Vien', SoDienThoai='0977889900', Email='staff2@smartcity.vn', MatKhau='staffabc', NgaySinh=date(1992,3,1), GioiTinh='Nu'),
        ]
        db.add_all(tai_khoans)
        db.commit()

        # PhuongTien
        phuong_tiens = [
            models.PhuongTien(ChuSoHuu='Nguyễn Văn A', BienSo='29A-12345', KieuXe='Xe máy', MauSac='Đỏ'),
            models.PhuongTien(ChuSoHuu='Trần Thị B', BienSo='30G-54321', KieuXe='Ô tô', MauSac='Trắng'),
            models.PhuongTien(ChuSoHuu='Lê Văn C', BienSo='29B-98765', KieuXe='Xe máy', MauSac='Xanh'),
            models.PhuongTien(ChuSoHuu='Phạm Thị D', BienSo='30H-11223', KieuXe='Ô tô', MauSac='Đen'),
            models.PhuongTien(ChuSoHuu='Hoàng Văn E', BienSo='29C-44556', KieuXe='Xe máy', MauSac='Vàng'),
        ]
        db.add_all(phuong_tiens)
        db.commit()

        # NhanDangPhuongTien
        nhan_dang_pt = [
            models.NhanDangPhuongTien(IdPhuongTien=1, IdCamera=1, ViTri='Ngã tư Hàng Bài - Tràng Tiền', DoTinCay=0.95),
            models.NhanDangPhuongTien(IdPhuongTien=2, IdCamera=2, ViTri='Khu vực Hồ Gươm', DoTinCay=0.88),
            models.NhanDangPhuongTien(IdPhuongTien=3, IdCamera=3, ViTri='Quảng trường Ba Đình', DoTinCay=0.92),
            models.NhanDangPhuongTien(IdPhuongTien=4, IdCamera=5, ViTri='Ngã tư Thái Hà - Chùa Bộc', DoTinCay=0.85),
            models.NhanDangPhuongTien(IdPhuongTien=5, IdCamera=7, ViTri='Ngã tư Đại Cồ Việt - Trần Khát Chân', DoTinCay=0.90),
        ]
        db.add_all(nhan_dang_pt)
        db.commit()

        # DanhMucViPham
        danh_muc_vp = [
            models.DanhMucViPham(LoaiViPham='Vượt đèn đỏ', MucPhat=500000),
            models.DanhMucViPham(LoaiViPham='Chạy quá tốc độ', MucPhat=800000),
            models.DanhMucViPham(LoaiViPham='Đỗ xe sai quy định', MucPhat=300000),
            models.DanhMucViPham(LoaiViPham='Đi ngược chiều', MucPhat=1000000),
        ]
        db.add_all(danh_muc_vp)
        db.commit()

        # ViPham
        vi_phams = [
            models.ViPham(IdPhuongTien=1, IdAnh=1, IdDanhMuc=1),
            models.ViPham(IdPhuongTien=2, IdAnh=None, IdDanhMuc=2),
            models.ViPham(IdPhuongTien=3, IdAnh=None, IdDanhMuc=3),
            models.ViPham(IdPhuongTien=4, IdAnh=None, IdDanhMuc=1),
            models.ViPham(IdPhuongTien=5, IdAnh=None, IdDanhMuc=4),
        ]
        db.add_all(vi_phams)
        db.commit()

        # PhatHienViPham
        phat_hien_vp = [
            models.PhatHienViPham(IdViPham=1, IdCamera=1, ViTri='Ngã tư Hàng Bài - Tràng Tiền', DuongDanHinhAnh='/violations/violation1.jpg'),
            models.PhatHienViPham(IdViPham=2, IdCamera=2, ViTri='Đường Điện Biên Phủ', DuongDanHinhAnh='/violations/violation2.jpg'),
            models.PhatHienViPham(IdViPham=3, IdCamera=3, ViTri='Phố Tây Sơn', DuongDanHinhAnh='/violations/violation3.jpg'),
            models.PhatHienViPham(IdViPham=4, IdCamera=5, ViTri='Đường Minh Khai', DuongDanHinhAnh='/violations/violation4.jpg'),
            models.PhatHienViPham(IdViPham=5, IdCamera=7, ViTri='Đường Xuân Diệu', DuongDanHinhAnh='/violations/violation5.jpg'),
        ]
        db.add_all(phat_hien_vp)
        db.commit()

        # Nguoi
        nguois = [
            models.Nguoi(Tuoi=35, GioiTinh='Nam', DacTrungKhuonMat='...', IdAnh=None),
            models.Nguoi(Tuoi=28, GioiTinh='Nu', DacTrungKhuonMat='...', IdAnh=None),
            models.Nguoi(Tuoi=45, GioiTinh='Nam', DacTrungKhuonMat='...', IdAnh=None),
        ]
        db.add_all(nguois)
        db.commit()

        # NhanDangNguoi
        nhan_dang_nguoi = [
            models.NhanDangNguoi(IdNguoi=1, IdCamera=1, ViTri='Khu vực Hồ Gươm', DoTinCay=0.92),
            models.NhanDangNguoi(IdNguoi=2, IdCamera=2, ViTri='Đường Thanh Niên', DoTinCay=0.85),
            models.NhanDangNguoi(IdNguoi=3, IdCamera=3, ViTri='Quảng trường Ba Đình', DoTinCay=0.98),
            models.NhanDangNguoi(IdNguoi=1, IdCamera=5, ViTri='Ngã tư Thái Hà - Chùa Bộc', DoTinCay=0.89),
            models.NhanDangNguoi(IdNguoi=2, IdCamera=7, ViTri='Khu vực Times City', DoTinCay=0.91),
        ]
        db.add_all(nhan_dang_nguoi)
        db.commit()

        # TinhTrangGiaoThong
        tinh_trang = [
            models.TinhTrangGiaoThong(IdCamera=1, MatDoGiaoThong='Thong Thoang', TocDoTrungBinh=45.5),
            models.TinhTrangGiaoThong(IdCamera=2, MatDoGiaoThong='Dong Duc', TocDoTrungBinh=25.0),
            models.TinhTrangGiaoThong(IdCamera=3, MatDoGiaoThong='Un Tac', TocDoTrungBinh=10.2),
            models.TinhTrangGiaoThong(IdCamera=5, MatDoGiaoThong='Thong Thoang', TocDoTrungBinh=52.1),
            models.TinhTrangGiaoThong(IdCamera=7, MatDoGiaoThong='Dong Duc', TocDoTrungBinh=30.8),
        ]
        db.add_all(tinh_trang)
        db.commit()

        print("Seed dữ liệu thành công!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()