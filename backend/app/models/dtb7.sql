-- Sử dụng cơ sở dữ liệu của bạn (nếu cần)
-- USE `smartcity`;

DROP DATABASE IF EXISTS SMARTCITY;
CREATE DATABASE SMARTCITY CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE SMARTCITY;

-- 1. Khu vực
CREATE TABLE KhuVuc (
    IdKhuVuc INT PRIMARY KEY AUTO_INCREMENT,
    TenKhuVuc VARCHAR(255) NOT NULL
);

-- 2. Camera
CREATE TABLE Camera (
    IdCamera INT PRIMARY KEY AUTO_INCREMENT,
    IpCamera VARCHAR(255) NOT NULL UNIQUE,
    IdKhuVuc INT,
    ViTriLapDat VARCHAR(255),
    TrangThaiCamera ENUM('Hoat Dong', 'Khong Hoat Dong', 'Hu Hong', 'Bao Tri') DEFAULT 'Hoat Dong',
    NgayLapDat DATE,
    BaoTri DATE,
    FOREIGN KEY (IdKhuVuc) REFERENCES KhuVuc(IdKhuVuc) ON DELETE SET NULL
);

-- 3. Ảnh
CREATE TABLE Anh (
    IdAnh INT PRIMARY KEY AUTO_INCREMENT,
    IdCamera INT NOT NULL,
    ThoiGian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DuongDan TEXT NOT NULL,
    KichThuoc DECIMAL(10,2),
    FOREIGN KEY (IdCamera) REFERENCES Camera(IdCamera) ON DELETE CASCADE
);

-- 4. Tài khoản
CREATE TABLE TaiKhoan (
    IdTaiKhoan INT PRIMARY KEY AUTO_INCREMENT,
    IdKhuVuc INT,
    VaiTro ENUM('Quan Tri', 'Nhan Vien', 'Giam Sat', 'Nguoi Dan') NOT NULL,
    TenNguoiDung VARCHAR(255),
    SoDienThoai VARCHAR(15) UNIQUE,
    Email VARCHAR(255) UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    NgaySinh DATE,
    GioiTinh ENUM('Nam', 'Nu', 'Khac'),
    TrangThai ENUM('Hoat Dong', 'Khoa', 'Tam Ngung') DEFAULT 'Hoat Dong',
    FOREIGN KEY (IdKhuVuc) REFERENCES KhuVuc(IdKhuVuc) ON DELETE CASCADE
);

-- 5. Phương tiện
CREATE TABLE PhuongTien (
    IdPhuongTien INT PRIMARY KEY AUTO_INCREMENT,
    ChuSoHuu VARCHAR(255) NOT NULL,
    BienSo VARCHAR(20) UNIQUE NOT NULL,
    KieuXe VARCHAR(50) NOT NULL,
    MauSac VARCHAR(30) NOT NULL
);

-- 6. Nhận dạng phương tiện
CREATE TABLE NhanDangPhuongTien (
    IdNhanDangPhuongTien INT PRIMARY KEY AUTO_INCREMENT,
    IdPhuongTien INT NOT NULL,
    IdCamera INT NOT NULL,
    ThoiGian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IdAnh INT NOT NULL,
    ViTri VARCHAR(255),
    DoTinCay FLOAT,
    FOREIGN KEY (IdPhuongTien) REFERENCES PhuongTien(IdPhuongTien) ON DELETE CASCADE,
    FOREIGN KEY (IdCamera) REFERENCES Camera(IdCamera) ON DELETE CASCADE,
    FOREIGN KEY (IdAnh) REFERENCES Anh(IdAnh) ON DELETE CASCADE
);

-- 7. Danh mục vi phạm
CREATE TABLE DanhMucViPham (
    IdDanhMuc INT PRIMARY KEY AUTO_INCREMENT,
    LoaiViPham VARCHAR(255) UNIQUE NOT NULL,
    MucPhat DECIMAL(10,2) NOT NULL
);

-- 8. Phát hiện vi phạm (kết hợp ảnh, phương tiện, camera)
CREATE TABLE PhatHienViPham (
    IdPhatHien INT PRIMARY KEY AUTO_INCREMENT,
    IdCamera INT NOT NULL,
    ThoiGian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ViTri VARCHAR(255),
    IdPhuongTien INT NOT NULL,
    IdDanhMuc INT,
    IdAnh INT NOT NULL,
    TrangThai ENUM('Chua Xu Ly', 'Da Xu Ly', 'Huy') DEFAULT 'Chua Xu Ly',
    FOREIGN KEY (IdCamera) REFERENCES Camera(IdCamera) ON DELETE CASCADE,
    FOREIGN KEY (IdPhuongTien) REFERENCES PhuongTien(IdPhuongTien) ON DELETE CASCADE,
    FOREIGN KEY (IdDanhMuc) REFERENCES DanhMucViPham(IdDanhMuc) ON DELETE SET NULL,
    FOREIGN KEY (IdAnh) REFERENCES Anh(IdAnh) ON DELETE CASCADE
);

-- 9. Nhận dạng người
CREATE TABLE NhanDangNguoi (
    IdNhanDangNguoi INT PRIMARY KEY AUTO_INCREMENT,
    Tuoi INT,
    GioiTinh ENUM('Nam', 'Nu', 'Khac'),
    DacTrung JSON NOT NULL,
    IdAnh INT NOT NULL,
    IdCamera INT NOT NULL,
    ThoiGian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ViTri VARCHAR(255),
    DoTinCay FLOAT,
    FOREIGN KEY (IdCamera) REFERENCES Camera(IdCamera) ON DELETE CASCADE,
    FOREIGN KEY (IdAnh) REFERENCES Anh(IdAnh) ON DELETE CASCADE
);

-- 10. Tình trạng giao thông
CREATE TABLE TinhTrangGiaoThong (
    IdTinhTrang INT PRIMARY KEY AUTO_INCREMENT,
    IdCamera INT NOT NULL,
    ThoiGian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    MatDoGiaoThong ENUM('Thong Thoang', 'Dong Duc', 'Un Tac'),
    TocDoTrungBinh DECIMAL(6,2),
    FOREIGN KEY (IdCamera) REFERENCES Camera(IdCamera) ON DELETE CASCADE
);

--
-- Thêm dữ liệu vào bảng KhuVuc (IdKhuVuc sẽ là 1-10)
-- (Không thay đổi, giữ nguyên)
--
-- INSERT INTO KhuVuc (TenKhuVuc) VALUES
-- ('Hoàn Kiếm'),
-- ('Ba Đình'),
-- ('Đống Đa'),
-- ('Hai Bà Trưng'),
-- ('Tây Hồ'),
-- ('Cầu Giấy'),
-- ('Thanh Xuân'),
-- ('Long Biên'),
-- ('Hoàng Mai'),
-- ('Nam Từ Liêm');

-- --
-- -- Thêm dữ liệu vào bảng Camera (IdCamera sẽ là 1-40)
-- -- (Không thay đổi, giữ nguyên ngày lắp đặt là 2024 và 2025)
-- --
-- INSERT INTO Camera (IpCamera, IdKhuVuc, ViTriLapDat, TrangThaiCamera, NgayLapDat, BaoTri) VALUES
-- -- Khu vực 1: Hoàn Kiếm
-- ('192.168.1.101', 1, 'Ngã tư Hàng Bài - Tràng Tiền', 'Hoat Dong', '2024-01-15', NULL),
-- ('192.168.1.102', 1, 'Khu vực Hồ Gươm', 'Hoat Dong', '2024-02-20', NULL),
-- ('192.168.1.103', 1, 'Đường Đinh Tiên Hoàng', 'Hoat Dong', '2024-03-01', NULL),
-- ('192.168.1.104', 1, 'Phố Tràng Tiền', 'Hu Hong', '2023-11-01', '2024-03-15'),

-- -- Khu vực 2: Ba Đình
-- ('192.168.1.105', 2, 'Quảng trường Ba Đình', 'Hoat Dong', '2024-03-10', NULL),
-- ('192.168.1.106', 2, 'Đường Điện Biên Phủ', 'Hoat Dong', '2024-04-05', NULL),
-- ('192.168.1.107', 2, 'Đường Hùng Vương', 'Hoat Dong', '2024-04-20', NULL),
-- ('192.168.1.108', 2, 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 'Hoat Dong', '2024-05-01', NULL),

-- -- Khu vực 3: Đống Đa
-- ('192.168.1.109', 3, 'Ngã tư Thái Hà - Chùa Bộc', 'Hoat Dong', '2024-05-12', NULL),
-- ('192.168.1.110', 3, 'Khu vực Vincom Center Nguyễn Chí Thanh', 'Hoat Dong', '2024-06-22', NULL),
-- ('192.168.1.111', 3, 'Phố Tây Sơn', 'Hoat Dong', '2024-07-05', NULL),
-- ('192.168.1.112', 3, 'Đường Láng', 'Hu Hong', '2024-01-10', '2024-07-15'),

-- -- Khu vực 4: Hai Bà Trưng
-- ('192.168.1.113', 4, 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 'Hoat Dong', '2024-07-01', NULL),
-- ('192.168.1.114', 4, 'Khu vực Times City', 'Hoat Dong', '2024-08-18', NULL),
-- ('192.168.1.115', 4, 'Đường Minh Khai', 'Hoat Dong', '2024-09-01', NULL),
-- ('192.168.1.116', 4, 'Khu đô thị Ciputra', 'Hoat Dong', '2024-09-10', NULL),

-- -- Khu vực 5: Tây Hồ
-- ('192.168.1.117', 5, 'Đường Thanh Niên', 'Hoat Dong', '2024-09-25', NULL),
-- ('192.168.1.118', 5, 'Khu vực Công viên Nước Hồ Tây', 'Hoat Dong', '2024-10-30', NULL),
-- ('192.168.1.119', 5, 'Đường Xuân Diệu', 'Hoat Dong', '2024-11-05', NULL),
-- ('192.168.1.120', 5, 'Đường Âu Cơ', 'Hoat Dong', '2024-11-15', NULL),

-- -- Khu vực 6: Cầu Giấy
-- ('192.168.1.121', 6, 'Ngã tư Xuân Thủy - Nguyễn Phong Sắc', 'Hoat Dong', '2024-11-15', NULL),
-- ('192.168.1.122', 6, 'Khu vực Đại học Quốc Gia Hà Nội', 'Hoat Dong', '2024-12-01', NULL),
-- ('192.168.1.123', 6, 'Đường Trần Duy Hưng', 'Hoat Dong', '2024-12-10', NULL),
-- ('192.168.1.124', 6, 'Khu công nghiệp Thăng Long', 'Hu Hong', '2024-02-20', '2024-12-25'),

-- -- Khu vực 7: Thanh Xuân
-- ('192.168.1.125', 7, 'Ngã tư Khuất Duy Tiến - Nguyễn Trãi', 'Hoat Dong', '2025-01-10', NULL),
-- ('192.168.1.126', 7, 'Khu vực Royal City', 'Hoat Dong', '2025-02-28', NULL),
-- ('192.168.1.127', 7, 'Đường Nguyễn Văn Trỗi', 'Hoat Dong', '2025-03-05', NULL),
-- ('192.168.1.128', 7, 'Đường Nguyễn Trãi (khu vực khác)', 'Hoat Dong', '2025-03-15', NULL),

-- -- Khu vực 8: Long Biên
-- ('192.168.1.129', 8, 'Cầu Chương Dương', 'Hoat Dong', '2025-04-12', NULL),
-- ('192.168.1.130', 8, 'Khu vực Aeon Mall Long Biên', 'Hoat Dong', '2025-04-15', NULL),
-- ('192.168.1.131', 8, 'Đường Ngô Gia Tự', 'Hoat Dong', '2025-04-20', NULL),
-- ('192.168.1.132', 8, 'Cầu Vĩnh Tuy', 'Hoat Dong', '2025-04-25', NULL),

-- -- Khu vực 9: Hoàng Mai
-- ('192.168.1.133', 9, 'Ngã tư Giải Phóng - Vành đai 3', 'Hoat Dong', '2025-05-01', NULL),
-- ('192.168.1.134', 9, 'Khu vực Bến xe Giáp Bát', 'Hoat Dong', '2025-05-05', NULL),
-- ('192.168.1.135', 9, 'Đường Kim Đồng', 'Hoat Dong', '2025-05-10', NULL),
-- ('192.168.1.136', 9, 'Đường Trần Phú (Hoàng Mai)', 'Hoat Dong', '2025-05-15', NULL),

-- -- Khu vực 10: Nam Từ Liêm
-- ('192.168.1.137', 10, 'Đường Lê Đức Thọ', 'Hoat Dong', '2025-05-20', NULL),
-- ('192.168.1.138', 10, 'Khu vực Sân vận động Mỹ Đình', 'Hoat Dong', '2025-05-25', NULL),
-- ('192.168.1.139', 10, 'Đường Hàm Nghi', 'Hoat Dong', '2025-05-30', NULL),
-- ('192.168.1.140', 10, 'Đường Mễ Trì', 'Hoat Dong', '2025-06-01', NULL);

-- --
-- -- Thêm dữ liệu vào bảng Anh (IdAnh sẽ là 1-20)
-- -- Thời gian chụp ảnh được đặt trong khoảng thời gian diễn ra các sự kiện.
-- --
-- INSERT INTO Anh (IdCamera, DuongDan, KichThuoc) VALUES
-- (1, '/images/cam1_20250606_0800_1.jpg', 1.25), -- IdAnh = 1 (08:00:00)
-- (1, '/images/cam1_20250606_0805_2.jpg', 1.10), -- IdAnh = 2 (08:05:00)
-- (2, '/images/cam2_20250606_0810_1.jpg', 0.98), -- IdAnh = 3 (08:10:00)
-- (2, '/images/cam2_20250606_0815_2.jpg', 1.05), -- IdAnh = 4 (08:15:00)
-- (3, '/images/cam3_20250606_0820_1.jpg', 1.50), -- IdAnh = 5 (08:20:00)
-- (3, '/images/cam3_20250606_0825_2.jpg', 1.30), -- IdAnh = 6 (08:25:00)
-- (4, '/images/cam4_20250606_0830_1.jpg', 1.05), -- IdAnh = 7 (08:30:00 - camera hỏng, có thể là ảnh cũ)
-- (5, '/images/cam5_20250606_0835_1.jpg', 1.18), -- IdAnh = 8 (08:35:00)
-- (5, '/images/cam5_20250606_0840_2.jpg', 0.95), -- IdAnh = 9 (08:40:00)
-- (6, '/images/cam6_20250606_0845_1.jpg', 1.00), -- IdAnh = 10 (08:45:00)
-- (7, '/images/cam7_20250606_0850_1.jpg', 1.20), -- IdAnh = 11 (08:50:00)
-- (8, '/images/cam8_20250606_0855_1.jpg', 1.35), -- IdAnh = 12 (08:55:00)
-- (9, '/images/cam9_20250606_0900_1.jpg', 1.40), -- IdAnh = 13 (09:00:00)
-- (10, '/images/cam10_20250606_0905_1.jpg', 1.12), -- IdAnh = 14 (09:05:00)
-- (11, '/images/cam11_20250606_0910_1.jpg', 0.88), -- IdAnh = 15 (09:10:00)
-- (12, '/images/cam12_20250606_0915_1.jpg', 1.08), -- IdAnh = 16 (09:15:00)
-- (13, '/images/cam13_20250606_0920_1.jpg', 1.22), -- IdAnh = 17 (09:20:00)
-- (14, '/images/cam14_20250606_0925_1.jpg', 1.15), -- IdAnh = 18 (09:25:00)
-- (15, '/images/cam15_20250606_0930_1.jpg', 0.99), -- IdAnh = 19 (09:30:00)
-- (16, '/images/cam16_20250606_0935_1.jpg', 1.07); -- IdAnh = 20 (09:35:00)

-- --
-- -- Thêm dữ liệu vào bảng TaiKhoan (IdTaiKhoan sẽ là 1-10)
-- -- (Không thay đổi, giữ nguyên)
-- --
-- INSERT INTO TaiKhoan (IdKhuVuc, VaiTro, TenNguoiDung, SoDienThoai, Email, MatKhau, NgaySinh, GioiTinh, TrangThai) VALUES
-- (1, 'Quan Tri', 'Nguyễn Văn An', '0901112233', 'nguyen.an@smartcity.vn', 'password@123', '1988-01-20', 'Nam', 'Hoat Dong'),
-- (2, 'Nhan Vien', 'Trần Thị Bình', '0912223344', 'tran.binh@smartcity.vn', 'password@456', '1992-07-10', 'Nu', 'Hoat Dong'),
-- (1, 'Giam Sat', 'Lê Cảnh Duy', '0933445566', 'le.duy@smartcity.vn', 'password@789', '1985-03-05', 'Nam', 'Hoat Dong'),
-- (3, 'Nhan Vien', 'Phạm Thị Giang', '0944556677', 'pham.giang@smartcity.vn', 'password@abc', '1990-11-25', 'Nu', 'Hoat Dong'),
-- (4, 'Quan Tri', 'Đỗ Văn Hùng', '0966778899', 'do.hung@smartcity.vn', 'password@xyz', '1979-09-12', 'Nam', 'Hoat Dong'),
-- (5, 'Nhan Vien', 'Hoàng Thị Khanh', '0977889900', 'hoang.khanh@smartcity.vn', 'password@def', '1996-02-18', 'Nu', 'Hoat Dong'),
-- (6, 'Giam Sat', 'Vũ Minh Long', '0988990011', 'vu.long@smartcity.vn', 'password@ghi', '1983-04-30', 'Nam', 'Hoat Dong'),
-- (7, 'Nhan Vien', 'Nguyễn Thị My', '0900112233', 'nguyen.my@smartcity.vn', 'password@jkl', '1994-06-08', 'Nu', 'Hoat Dong'),
-- (8, 'Quan Tri', 'Đinh Công Nam', '0911223355', 'dinh.nam@smartcity.vn', 'password@mno', '1980-10-01', 'Nam', 'Hoat Dong'),
-- (9, 'Nhan Vien', 'Bùi Thị Oanh', '0922334466', 'bui.oanh@smartcity.vn', 'password@pqr', '1991-01-01', 'Nu', 'Hoat Dong');

-- --
-- -- Thêm dữ liệu vào bảng PhuongTien (IdPhuongTien sẽ là 1-15)
-- -- (Không thay đổi, giữ nguyên)
-- --
-- INSERT INTO PhuongTien (ChuSoHuu, BienSo, KieuXe, MauSac) VALUES
-- ('Nguyễn Văn An', '29A-123.45', 'Xe máy', 'Đỏ'),
-- ('Trần Thị Bình', '30G-543.21', 'Ô tô', 'Trắng'),
-- ('Lê Cảnh Duy', '29B-987.65', 'Xe máy', 'Xanh dương'),
-- ('Phạm Thị Giang', '30H-112.23', 'Ô tô', 'Đen'),
-- ('Hoàng Văn Hùng', '29C-445.56', 'Xe máy', 'Vàng'),
-- ('Nguyễn Thị Thu', '33K-678.90', 'Ô tô', 'Bạc'),
-- ('Trần Quang Vinh', '18M-123.99', 'Xe máy', 'Đen'),
-- ('Phạm Duy Anh', '29F-789.01', 'Ô tô', 'Đỏ'),
-- ('Lê Thanh Hải', '30A-234.56', 'Xe tải', 'Xám'),
-- ('Vũ Thị Lan', '31B-345.67', 'Xe máy', 'Hồng'),
-- ('Đặng Văn Kiên', '29D-876.54', 'Xe ô tô', 'Xanh lá'),
-- ('Hoàng Thị Mai', '30K-998.87', 'Xe đạp điện', 'Trắng'),
-- ('Trần Văn Nghĩa', '29E-001.12', 'Xe máy', 'Nâu'),
-- ('Nguyễn Hải Yến', '30F-223.34', 'Ô tô', 'Be'),
-- ('Lê Hữu Phúc', '29G-556.67', 'Xe máy', 'Cam');

-- --
-- -- Thêm dữ liệu vào bảng NhanDangPhuongTien (IdNhanDangPhuongTien tự tăng)
-- -- Thời gian được điều chỉnh để khớp với thời gian ảnh được chụp hoặc sau đó một chút.
-- --
-- INSERT INTO NhanDangPhuongTien (IdPhuongTien, IdCamera, ThoiGian, IdAnh, ViTri, DoTinCay) VALUES
-- (1, 1, '2025-06-06 08:00:15', 1, 'Ngã tư Hàng Bài - Tràng Tiền', 0.95), -- Ảnh 1 (08:00:00)
-- (2, 2, '2025-06-06 08:10:20', 3, 'Khu vực Hồ Gươm', 0.88), -- Ảnh 3 (08:10:00)
-- (3, 3, '2025-06-06 08:20:25', 5, 'Quảng trường Ba Đình', 0.92), -- Ảnh 5 (08:20:00)
-- (4, 5, '2025-06-06 08:35:30', 8, 'Ngã tư Thái Hà - Chùa Bộc', 0.85), -- Ảnh 8 (08:35:00)
-- (5, 7, '2025-06-06 08:50:35', 11, 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 0.90), -- Ảnh 11 (08:50:00)
-- (6, 1, '2025-06-06 08:05:10', 2, 'Ngã tư Hàng Bài - Tràng Tiền', 0.93), -- Ảnh 2 (08:05:00)
-- (7, 2, '2025-06-06 08:15:15', 4, 'Khu vực Hồ Gươm', 0.87), -- Ảnh 4 (08:15:00)
-- (8, 3, '2025-06-06 08:25:20', 6, 'Quảng trường Ba Đình', 0.91), -- Ảnh 6 (08:25:00)
-- (9, 8, '2025-06-06 08:55:05', 12, 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 0.96), -- Ảnh 12 (08:55:00)
-- (10, 10, '2025-06-06 09:05:10', 14, 'Khu vực Công viên Nước Hồ Tây', 0.89), -- Ảnh 14 (09:05:00)
-- (11, 12, '2025-06-06 09:15:15', 16, 'Khu vực Đại học Quốc Gia Hà Nội', 0.94), -- Ảnh 16 (09:15:00)
-- (12, 14, '2025-06-06 09:25:20', 18, 'Khu vực Royal City', 0.82), -- Ảnh 18 (09:25:00)
-- (13, 16, '2025-06-06 09:35:25', 20, 'Khu vực Aeon Mall Long Biên', 0.97), -- Ảnh 20 (09:35:00)
-- (14, 18, '2025-06-06 09:30:10', 19, 'Khu vực Bến xe Giáp Bát', 0.80), -- Ảnh 19 (09:30:00)
-- (15, 20, '2025-06-06 09:20:15', 17, 'Khu vực Sân vận động Mỹ Đình', 0.90); -- Ảnh 17 (09:20:00)

-- --
-- -- Thêm dữ liệu vào bảng DanhMucViPham (IdDanhMuc sẽ là 1-6)
-- -- (Không thay đổi, giữ nguyên)
-- --
-- INSERT INTO DanhMucViPham (LoaiViPham, MucPhat) VALUES
-- ('Vượt đèn đỏ', 500000),
-- ('Chạy quá tốc độ', 800000),
-- ('Đỗ xe sai quy định', 300000),
-- ('Đi ngược chiều', 1000000),
-- ('Không đội mũ bảo hiểm', 250000),
-- ('Vượt quá vạch dừng', 150000);

-- --
-- -- Thêm dữ liệu vào bảng PhatHienViPham (IdPhatHien tự tăng)
-- -- Thời gian được điều chỉnh để khớp với thời gian ảnh được chụp hoặc sau đó một chút.
-- --
-- INSERT INTO PhatHienViPham (IdCamera, ThoiGian, ViTri, IdPhuongTien, IdDanhMuc, IdAnh, TrangThai) VALUES
-- (1, '2025-06-06 08:00:40', 'Ngã tư Hàng Bài - Tràng Tiền', 1, 1, 1, 'Chua Xu Ly'), -- Ảnh 1 (08:00:00)
-- (2, '2025-06-06 08:10:45', 'Khu vực Hồ Gươm', 2, 2, 3, 'Da Xu Ly'), -- Ảnh 3 (08:10:00)
-- (3, '2025-06-06 08:20:50', 'Quảng trường Ba Đình', 3, 3, 5, 'Chua Xu Ly'), -- Ảnh 5 (08:20:00)
-- (5, '2025-06-06 08:35:55', 'Ngã tư Thái Hà - Chùa Bộc', 4, 1, 8, 'Chua Xu Ly'), -- Ảnh 8 (08:35:00)
-- (7, '2025-06-06 08:51:00', 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 5, 4, 11, 'Huy'), -- Ảnh 11 (08:50:00)
-- (1, '2025-06-06 08:05:15', 'Phố Đinh Tiên Hoàng', 6, 5, 2, 'Chua Xu Ly'), -- Ảnh 2 (08:05:00)
-- (2, '2025-06-06 08:15:20', 'Khu vực Hồ Gươm', 7, 6, 4, 'Da Xu Ly'), -- Ảnh 4 (08:15:00)
-- (3, '2025-06-06 08:25:25', 'Quảng trường Ba Đình', 8, 1, 6, 'Chua Xu Ly'), -- Ảnh 6 (08:25:00)
-- (8, '2025-06-06 08:55:30', 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 9, 2, 12, 'Da Xu Ly'), -- Ảnh 12 (08:55:00)
-- (10, '2025-06-06 09:05:35', 'Khu vực Công viên Nước Hồ Tây', 10, 3, 14, 'Chua Xu Ly'), -- Ảnh 14 (09:05:00)
-- (12, '2025-06-06 09:15:40', 'Khu vực Đại học Quốc Gia Hà Nội', 11, 4, 16, 'Chua Xu Ly'), -- Ảnh 16 (09:15:00)
-- (14, '2025-06-06 09:25:45', 'Khu vực Royal City', 12, 5, 18, 'Huy'), -- Ảnh 18 (09:25:00)
-- (16, '2025-06-06 09:35:50', 'Khu vực Aeon Mall Long Biên', 13, 6, 20, 'Da Xu Ly'), -- Ảnh 20 (09:35:00)
-- (18, '2025-06-06 09:30:15', 'Khu vực Bến xe Giáp Bát', 14, 1, 19, 'Chua Xu Ly'), -- Ảnh 19 (09:30:00)
-- (20, '2025-06-06 09:20:20', 'Khu vực Sân vận động Mỹ Đình', 15, 2, 17, 'Chua Xu Ly'); -- Ảnh 17 (09:20:00)


-- --
-- -- Thêm dữ liệu vào bảng NhanDangNguoi (IdNhanDangNguoi tự tăng)
-- -- Thời gian được điều chỉnh để khớp với thời gian ảnh được chụp hoặc sau đó một chút.
-- --
-- INSERT INTO NhanDangNguoi (Tuoi, GioiTinh, DacTrung, IdAnh, IdCamera, ThoiGian, ViTri, DoTinCay) VALUES
-- -- Người 1: Nam, 35 tuổi, ở Khu vực Hồ Gươm
-- (35, 'Nam', JSON_OBJECT(
--     'TrangPhuc', 'Áo khoác da đen, quần jean xanh đậm',
--     'PhuKien', 'Đeo kính râm kiểu phi công, mang ba lô thể thao màu xám',
--     'Toc', 'Ngắn, vuốt keo gọn gàng',
--     'HinhDang', 'Cao ráo, vóc dáng cân đối'
-- ), 1, 1, '2025-06-06 08:00:20', 'Khu vực Hồ Gươm', 0.92), -- Ảnh 1 (08:00:00)

-- -- Người 2: Nữ, 28 tuổi, ở Đường Thanh Niên
-- (28, 'Nu', JSON_OBJECT(
--     'TrangPhuc', 'Váy maxi họa tiết hoa nhí màu xanh pastel',
--     'PhuKien', 'Túi xách đeo chéo nhỏ màu nâu, khuyên tai tròn bạc',
--     'Toc', 'Tóc dài ngang lưng, uốn xoăn nhẹ ở đuôi',
--     'HinhDang', 'Thon thả, dáng người mảnh mai'
-- ), 2, 2, '2025-06-06 08:05:25', 'Đường Thanh Niên', 0.85), -- Ảnh 2 (08:05:00)

-- -- Người 3: Nam, 45 tuổi, ở Quảng trường Ba Đình
-- (45, 'Nam', JSON_OBJECT(
--     'TrangPhuc', 'Áo sơ mi trắng dài tay, quần tây đen, giày da',
--     'PhuKien', 'Đồng hồ đeo tay mặt tròn, cà vạt sọc nhỏ',
--     'Toc', 'Hói phần đỉnh đầu, tóc hai bên cắt ngắn',
--     'HinhDang', 'Dáng người cao to, hơi có bụng'
-- ), 3, 3, '2025-06-06 08:10:30', 'Quảng trường Ba Đình', 0.98), -- Ảnh 3 (08:10:00)

-- -- Người 4: Nữ, 22 tuổi, ở Khu vực Hồ Gươm
-- (22, 'Nu', JSON_OBJECT(
--     'TrangPhuc', 'Quần jean rách gối, áo phông in hình hoạt hình, áo khoác denim',
--     'PhuKien', 'Ba lô vải màu vàng, đội mũ lưỡi trai ngược',
--     'Toc', 'Tóc búi cao kiểu củ tỏi, một vài sợi tóc con rủ xuống',
--     'HinhDang', 'Nhỏ nhắn, thon gọn, năng động'
-- ), 4, 2, '2025-06-06 08:15:35', 'Khu vực Hồ Gươm', 0.89), -- Ảnh 4 (08:15:00)

-- -- Người 5: Nam, 50 tuổi, ở Quảng trường Ba Đình
-- (50, 'Nam', JSON_OBJECT(
--     'TrangPhuc', 'Bộ vest màu xám than, áo sơ mi xanh nhạt, cà vạt chấm bi',
--     'PhuKien', 'Cặp da màu đen, bút cài túi áo',
--     'Toc', 'Tóc bạc hai bên thái dương, chải gọn gàng',
--     'HinhDang', 'Vóc dáng trung bình, điềm đạm'
-- ), 5, 3, '2025-06-06 08:20:40', 'Quảng trường Ba Đình', 0.95), -- Ảnh 5 (08:20:00)

-- -- Người 6: Nữ, 30 tuổi, ở Vincom Center Nguyễn Chí Thanh
-- (30, 'Nu', JSON_OBJECT(
--     'TrangPhuc', 'Đầm xòe màu đỏ đô, dài đến gối',
--     'PhuKien', 'Khuyên tai dài đính đá, vòng tay mảnh',
--     'Toc', 'Tóc xoăn lọn lớn, thả tự nhiên',
--     'HinhDang', 'Dáng người đồng hồ cát, thanh lịch'
-- ), 6, 3, '2025-06-06 08:25:45', 'Vincom Center Nguyễn Chí Thanh', 0.87), -- Ảnh 6 (08:25:00)

-- -- Người 7: Nam, 40 tuổi, ở Phố Tràng Tiền (dữ liệu cũ từ camera hỏng)
-- (40, 'Nam', JSON_OBJECT(
--     'TrangPhuc', 'Quần short kaki be, áo phông sọc ngang trắng xanh',
--     'PhuKien', 'Mũ lưỡi trai màu xanh navy, dép xỏ ngón',
--     'Toc', 'Tóc cắt ngắn, cạo sát hai bên',
--     'HinhDang', 'Vạm vỡ, cơ bắp, dáng thể thao'
-- ), 7, 4, '2025-06-06 08:30:50', 'Phố Tràng Tiền', 0.90), -- Ảnh 7 (08:30:00)

-- -- Người 8: Nữ, 25 tuổi, ở Ngã tư Thái Hà - Chùa Bộc
-- (25, 'Nu', JSON_OBJECT(
--     'TrangPhuc', 'Áo hoodie màu tím pastel, quần jogger đen',
--     'PhuKien', 'Tai nghe chụp tai lớn màu trắng, túi tote vải',
--     'Toc', 'Tóc nhuộm màu khói, buộc đuôi ngựa cao',
--     'HinhDang', 'Nhỏ nhắn, dáng người gầy'
-- ), 8, 5, '2025-06-06 08:35:55', 'Ngã tư Thái Hà - Chùa Bộc', 0.83), -- Ảnh 8 (08:35:00)

-- -- Người 9: Nam, 60 tuổi, ở Ngã tư Thái Hà - Chùa Bộc
-- (60, 'Nam', JSON_OBJECT(
--     'TrangPhuc', 'Áo ba lỗ màu trắng, quần đùi caro',
--     'PhuKien', 'Kính lão gọng nhựa đen, đi dép lê',
--     'Toc', 'Đầu hói hoàn toàn, chỉ còn ít tóc bạc hai bên',
--     'HinhDang', 'Gầy yếu, lưng hơi còng'
-- ), 9, 5, '2025-06-06 08:40:05', 'Ngã tư Thái Hà - Chùa Bộc', 0.75), -- Ảnh 9 (08:40:00)

-- -- Người 10: Nữ, 18 tuổi, ở Khu vực Đại học Quốc Gia Hà Nội
-- (18, 'Nu', JSON_OBJECT(
--     'TrangPhuc', 'Đồng phục học sinh (áo trắng, quần xanh), áo khoác đồng phục khoác ngoài',
--     'PhuKien', 'Cặp sách lớn màu đen, đeo thẻ học sinh',
--     'Toc', 'Tóc thẳng dài, buộc nửa đầu',
--     'HinhDang', 'Dáng người gầy, cao'
-- ), 10, 6, '2025-06-06 08:45:10', 'Khu vực Đại học Quốc Gia Hà Nội', 0.94), -- Ảnh 10 (08:45:00)

-- -- Người 11: Nam, 32 tuổi, ở Ngã tư Đại Cồ Việt - Trần Khát Chân
-- (32, 'Nam', JSON_OBJECT(
--     'TrangPhuc', 'Bộ vest màu xanh navy, áo sơ mi kẻ sọc nhỏ',
--     'PhuKien', 'Không có',
--     'Toc', 'Ngắn, rẽ ngôi lệch',
--     'HinhDang', 'Vóc dáng trung bình, lịch sự'
-- ), 11, 7, '2025-06-06 08:50:15', 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 0.96), -- Ảnh 11 (08:50:00)

-- -- Người 12: Nữ, 29 tuổi, ở Khu vực Lăng Chủ tịch Hồ Chí Minh
-- (29, 'Nu', JSON_OBJECT(
--     'TrangPhuc', 'Áo len dệt kim màu kem, quần skinny jean đen',
--     'PhuKien', 'Khăn quàng cổ họa tiết, găng tay len',
--     'Toc', 'Tóc dài qua vai, mái bằng',
--     'HinhDang', 'Nhỏ nhắn, cao dưới 1m60'
-- ), 12, 8, '2025-06-06 08:55:20', 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 0.88), -- Ảnh 12 (08:55:00)

-- -- Người 13: Nam, 48 tuổi, ở Ngã tư Giải Phóng - Vành đai 3
-- (48, 'Nam', JSON_OBJECT(
--     'TrangPhuc', 'Áo phông oversize màu xám, quần jogger lửng',
--     'PhuKien', 'Đồng hồ thể thao lớn, đội mũ lưỡi trai',
--     'Toc', 'Tóc ngắn, hơi lởm chởm',
--     'HinhDang', 'Vóc dáng mập mạp, thấp'
-- ), 13, 9, '2025-06-06 09:00:25', 'Ngã tư Giải Phóng - Vành đai 3', 0.91), -- Ảnh 13 (09:00:00)

-- -- Người 14: Nữ, 20 tuổi, ở Khu vực Sân vận động Mỹ Đình
-- (20, 'Nu', JSON_OBJECT(
--     'TrangPhuc', 'Quần jean ống rộng, áo crop top trắng, áo sơ mi khoác ngoài',
--     'PhuKien', 'Giày sneaker cao cổ, kính râm gọng lớn',
--     'Toc', 'Tóc xoăn gợn sóng, buộc đuôi ngựa thấp',
--     'HinhDang', 'Cao, thon, dáng người mẫu'
-- ), 14, 10, '2025-06-06 09:05:30', 'Khu vực Sân vận động Mỹ Đình', 0.86), -- Ảnh 14 (09:05:00)

-- -- Người 15: Nam, 55 tuổi, ở Ngã tư Xuân Thủy - Nguyễn Phong Sắc
-- (55, 'Nam', JSON_OBJECT(
--     'TrangPhuc', 'Áo khoác gió màu xanh đậm, quần vải ống đứng',
--     'PhuKien', 'Mũ len màu đen, găng tay len',
--     'Toc', 'Đầu hói phần đỉnh, tóc hai bên bạc',
--     'HinhDang', 'Vóc dáng trung bình, hơi gù lưng'
-- ), 15, 11, '2025-06-06 09:10:35', 'Ngã tư Xuân Thủy - Nguyễn Phong Sắc', 0.79); -- Ảnh 15 (09:10:00)

-- --
-- -- Thêm dữ liệu vào bảng TinhTrangGiaoThong (IdTinhTrangGiaoThong tự tăng)
-- -- Thời gian được điều chỉnh để khớp với thời gian ảnh được chụp hoặc sau đó một chút.
-- --
-- INSERT INTO TinhTrangGiaoThong (IdCamera, ThoiGian, MatDoGiaoThong, TocDoTrungBinh) VALUES
-- (1, '2025-06-06 08:00:50', 'Thong Thoang', 45.5), -- Ảnh 1 (08:00:00)
-- (2, '2025-06-06 08:10:55', 'Dong Duc', 25.0), -- Ảnh 3 (08:10:00)
-- (3, '2025-06-06 08:20:00', 'Un Tac', 10.2), -- Ảnh 5 (08:20:00)
-- (5, '2025-06-06 08:35:05', 'Thong Thoang', 52.1), -- Ảnh 8 (08:35:00)
-- (7, '2025-06-06 08:50:10', 'Dong Duc', 30.8), -- Ảnh 11 (08:50:00)
-- (1, '2025-06-06 08:05:15', 'Dong Duc', 28.5), -- Ảnh 2 (08:05:00)
-- (2, '2025-06-06 08:15:20', 'Thong Thoang', 38.0), -- Ảnh 4 (08:15:00)
-- (3, '2025-06-06 08:25:25', 'Un Tac', 15.0), -- Ảnh 6 (08:25:00)
-- (8, '2025-06-06 08:55:30', 'Thong Thoang', 40.0), -- Ảnh 12 (08:55:00)
-- (10, '2025-06-06 09:05:35', 'Dong Duc', 22.0), -- Ảnh 14 (09:05:00)
-- (12, '2025-06-06 09:15:40', 'Thong Thoang', 35.0), -- Ảnh 16 (09:15:00)
-- (14, '2025-06-06 09:25:45', 'Un Tac', 8.5), -- Ảnh 18 (09:25:00)
-- (16, '2025-06-06 09:35:50', 'Dong Duc', 20.0), -- Ảnh 20 (09:35:00)
-- (18, '2025-06-06 09:30:55', 'Thong Thoang', 48.0), -- Ảnh 19 (09:30:00)
-- (20, '2025-06-06 09:20:00', 'Un Tac', 12.0); -- Ảnh 17 (09:20:00)

-- Sử dụng cơ sở dữ liệu của bạn (nếu cần)
-- USE `smartcity`;

--
-- Thêm dữ liệu vào bảng KhuVuc (IdKhuVuc sẽ là 1-10)
-- (Không thay đổi, giữ nguyên)
--
INSERT INTO KhuVuc (TenKhuVuc) VALUES
('Hoàn Kiếm'),
('Ba Đình'),
('Đống Đa'),
('Hai Bà Trưng'),
('Tây Hồ'),
('Cầu Giấy'),
('Thanh Xuân'),
('Long Biên'),
('Hoàng Mai'),
('Nam Từ Liêm');

--
-- Thêm dữ liệu vào bảng Camera (IdCamera sẽ là 1-40)
-- (Không thay đổi, giữ nguyên ngày lắp đặt là 2024 và 2025)
--
INSERT INTO Camera (IpCamera, IdKhuVuc, ViTriLapDat, TrangThaiCamera, NgayLapDat, BaoTri) VALUES
-- Khu vực 1: Hoàn Kiếm
('192.168.1.101', 1, 'Ngã tư Hàng Bài - Tràng Tiền', 'Hoat Dong', '2024-01-15', NULL),
('192.168.1.102', 1, 'Khu vực Hồ Gươm', 'Hoat Dong', '2024-02-20', NULL),
('192.168.1.103', 1, 'Đường Đinh Tiên Hoàng', 'Hoat Dong', '2024-03-01', NULL),
('192.168.1.104', 1, 'Phố Tràng Tiền', 'Hu Hong', '2023-11-01', '2024-03-15'),

-- Khu vực 2: Ba Đình
('192.168.1.105', 2, 'Quảng trường Ba Đình', 'Hoat Dong', '2024-03-10', NULL),
('192.168.1.106', 2, 'Đường Điện Biên Phủ', 'Hoat Dong', '2024-04-05', NULL),
('192.168.1.107', 2, 'Đường Hùng Vương', 'Hoat Dong', '2024-04-20', NULL),
('192.168.1.108', 2, 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 'Hoat Dong', '2024-05-01', NULL),

-- Khu vực 3: Đống Đa
('192.168.1.109', 3, 'Ngã tư Thái Hà - Chùa Bộc', 'Hoat Dong', '2024-05-12', NULL),
('192.168.1.110', 3, 'Khu vực Vincom Center Nguyễn Chí Thanh', 'Hoat Dong', '2024-06-22', NULL),
('192.168.1.111', 3, 'Phố Tây Sơn', 'Hoat Dong', '2024-07-05', NULL),
('192.168.1.112', 3, 'Đường Láng', 'Hu Hong', '2024-01-10', '2024-07-15'),

-- Khu vực 4: Hai Bà Trưng
('192.168.1.113', 4, 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 'Hoat Dong', '2024-07-01', NULL),
('192.168.1.114', 4, 'Khu vực Times City', 'Hoat Dong', '2024-08-18', NULL),
('192.168.1.115', 4, 'Đường Minh Khai', 'Hoat Dong', '2024-09-01', NULL),
('192.168.1.116', 4, 'Khu đô thị Ciputra', 'Hoat Dong', '2024-09-10', NULL),

-- Khu vực 5: Tây Hồ
('192.168.1.117', 5, 'Đường Thanh Niên', 'Hoat Dong', '2024-09-25', NULL),
('192.168.1.118', 5, 'Khu vực Công viên Nước Hồ Tây', 'Hoat Dong', '2024-10-30', NULL),
('192.168.1.119', 5, 'Đường Xuân Diệu', 'Hoat Dong', '2024-11-05', NULL),
('192.168.1.120', 5, 'Đường Âu Cơ', 'Hoat Dong', '2024-11-15', NULL),

-- Khu vực 6: Cầu Giấy
('192.168.1.121', 6, 'Ngã tư Xuân Thủy - Nguyễn Phong Sắc', 'Hoat Dong', '2024-11-15', NULL),
('192.168.1.122', 6, 'Khu vực Đại học Quốc Gia Hà Nội', 'Hoat Dong', '2024-12-01', NULL),
('192.168.1.123', 6, 'Đường Trần Duy Hưng', 'Hoat Dong', '2024-12-10', NULL),
('192.168.1.124', 6, 'Khu công nghiệp Thăng Long', 'Hu Hong', '2024-02-20', '2024-12-25'),

-- Khu vực 7: Thanh Xuân
('192.168.1.125', 7, 'Ngã tư Khuất Duy Tiến - Nguyễn Trãi', 'Hoat Dong', '2025-01-10', NULL),
('192.168.1.126', 7, 'Khu vực Royal City', 'Hoat Dong', '2025-02-28', NULL),
('192.168.1.127', 7, 'Đường Nguyễn Văn Trỗi', 'Hoat Dong', '2025-03-05', NULL),
('192.168.1.128', 7, 'Đường Nguyễn Trãi (khu vực khác)', 'Hoat Dong', '2025-03-15', NULL),

-- Khu vực 8: Long Biên
('192.168.1.129', 8, 'Cầu Chương Dương', 'Hoat Dong', '2025-04-12', NULL),
('192.168.1.130', 8, 'Khu vực Aeon Mall Long Biên', 'Hoat Dong', '2025-04-15', NULL),
('192.168.1.131', 8, 'Đường Ngô Gia Tự', 'Hoat Dong', '2025-04-20', NULL),
('192.168.1.132', 8, 'Cầu Vĩnh Tuy', 'Hoat Dong', '2025-04-25', NULL),

-- Khu vực 9: Hoàng Mai
('192.168.1.133', 9, 'Ngã tư Giải Phóng - Vành đai 3', 'Hoat Dong', '2025-05-01', NULL),
('192.168.1.134', 9, 'Khu vực Bến xe Giáp Bát', 'Hoat Dong', '2025-05-05', NULL),
('192.168.1.135', 9, 'Đường Kim Đồng', 'Hoat Dong', '2025-05-10', NULL),
('192.168.1.136', 9, 'Đường Trần Phú (Hoàng Mai)', 'Hoat Dong', '2025-05-15', NULL),

-- Khu vực 10: Nam Từ Liêm
('192.168.1.137', 10, 'Đường Lê Đức Thọ', 'Hoat Dong', '2025-05-20', NULL),
('192.168.1.138', 10, 'Khu vực Sân vận động Mỹ Đình', 'Hoat Dong', '2025-05-25', NULL),
('192.168.1.139', 10, 'Đường Hàm Nghi', 'Hoat Dong', '2025-05-30', NULL),
('192.168.1.140', 10, 'Đường Mễ Trì', 'Hoat Dong', '2025-06-01', NULL);

--
-- Thêm dữ liệu vào bảng Anh (IdAnh sẽ là 1-20)
-- Thời gian chụp ảnh được đặt là 2025-06-10, và các sự kiện nhận dạng/phát hiện sẽ SAU thời gian này.
--
INSERT INTO Anh (IdCamera, DuongDan, ThoiGianChup, KichThuoc) VALUES
(1, '/images/cam1_20250610_2300_1.jpg', '2025-06-10 23:00:00', 1.25), -- IdAnh = 1
(1, '/images/cam1_20250610_2301_00.jpg', '2025-06-10 23:01:00', 1.10), -- IdAnh = 2
(2, '/images/cam2_20250610_2302_00.jpg', '2025-06-10 23:02:00', 0.98), -- IdAnh = 3
(2, '/images/cam2_20250610_2303_00.jpg', '2025-06-10 23:03:00', 1.05), -- IdAnh = 4
(3, '/images/cam3_20250610_2304_00.jpg', '2025-06-10 23:04:00', 1.50), -- IdAnh = 5
(3, '/images/cam3_20250610_2305_00.jpg', '2025-06-10 23:05:00', 1.30), -- IdAnh = 6
(4, '/images/cam4_20250610_2306_00.jpg', '2025-06-10 23:06:00', 1.05), -- IdAnh = 7 (camera hỏng, ảnh này có thể là ảnh cũ hoặc ảnh cuối cùng trước khi hỏng)
(5, '/images/cam5_20250610_2307_00.jpg', '2025-06-10 23:07:00', 1.18), -- IdAnh = 8
(5, '/images/cam5_20250610_2308_00.jpg', '2025-06-10 23:08:00', 0.95), -- IdAnh = 9
(6, '/images/cam6_20250610_2309_00.jpg', '2025-06-10 23:09:00', 1.00), -- IdAnh = 10
(7, '/images/cam7_20250610_2310_00.jpg', '2025-06-10 23:10:00', 1.20), -- IdAnh = 11
(8, '/images/cam8_20250610_2311_00.jpg', '2025-06-10 23:11:00', 1.35), -- IdAnh = 12
(9, '/images/cam9_20250610_2312_00.jpg', '2025-06-10 23:12:00', 1.40), -- IdAnh = 13
(10, '/images/cam10_20250610_2313_00.jpg', '2025-06-10 23:13:00', 1.12), -- IdAnh = 14
(11, '/images/cam11_20250610_2314_00.jpg', '2025-06-10 23:14:00', 0.88), -- IdAnh = 15
(12, '/images/cam12_20250610_2315_00.jpg', '2025-06-10 23:15:00', 1.08), -- IdAnh = 16
(13, '/images/cam13_20250610_2316_00.jpg', '2025-06-10 23:16:00', 1.22), -- IdAnh = 17
(14, '/images/cam14_20250610_2317_00.jpg', '2025-06-10 23:17:00', 1.15), -- IdAnh = 18
(15, '/images/cam15_20250610_2318_00.jpg', '2025-06-10 23:18:00', 0.99), -- IdAnh = 19
(16, '/images/cam16_20250610_2319_00.jpg', '2025-06-10 23:19:00', 1.07); -- IdAnh = 20

--
-- Thêm dữ liệu vào bảng TaiKhoan (IdTaiKhoan sẽ là 1-10)
-- (Không thay đổi, giữ nguyên)
--
INSERT INTO TaiKhoan (IdKhuVuc, VaiTro, TenNguoiDung, SoDienThoai, Email, MatKhau, NgaySinh, GioiTinh, TrangThai) VALUES
(1, 'Quan Tri', 'Nguyễn Văn An', '0901112233', 'nguyen.an@smartcity.vn', 'password@123', '1988-01-20', 'Nam', 'Hoat Dong'),
(2, 'Nhan Vien', 'Trần Thị Bình', '0912223344', 'tran.binh@smartcity.vn', 'password@456', '1992-07-10', 'Nu', 'Hoat Dong'),
(1, 'Giam Sat', 'Lê Cảnh Duy', '0933445566', 'le.duy@smartcity.vn', 'password@789', '1985-03-05', 'Nam', 'Hoat Dong'),
(3, 'Nhan Vien', 'Phạm Thị Giang', '0944556677', 'pham.giang@smartcity.vn', 'password@abc', '1990-11-25', 'Nu', 'Hoat Dong'),
(4, 'Quan Tri', 'Đỗ Văn Hùng', '0966778899', 'do.hung@smartcity.vn', 'password@xyz', '1979-09-12', 'Nam', 'Hoat Dong'),
(5, 'Nhan Vien', 'Hoàng Thị Khanh', '0977889900', 'hoang.khanh@smartcity.vn', 'password@def', '1996-02-18', 'Nu', 'Hoat Dong'),
(6, 'Giam Sat', 'Vũ Minh Long', '0988990011', 'vu.long@smartcity.vn', 'password@ghi', '1983-04-30', 'Nam', 'Hoat Dong'),
(7, 'Nhan Vien', 'Nguyễn Thị My', '0900112233', 'nguyen.my@smartcity.vn', 'password@jkl', '1994-06-08', 'Nu', 'Hoat Dong'),
(8, 'Quan Tri', 'Đinh Công Nam', '0911223355', 'dinh.nam@smartcity.vn', 'password@mno', '1980-10-01', 'Nam', 'Hoat Dong'),
(9, 'Nhan Vien', 'Bùi Thị Oanh', '0922334466', 'bui.oanh@smartcity.vn', 'password@pqr', '1991-01-01', 'Nu', 'Hoat Dong');

--
-- Thêm dữ liệu vào bảng PhuongTien (IdPhuongTien sẽ là 1-15)
-- (Không thay đổi, giữ nguyên)
--
INSERT INTO PhuongTien (ChuSoHuu, BienSo, KieuXe, MauSac) VALUES
('Nguyễn Văn An', '29A-123.45', 'Xe máy', 'Đỏ'),
('Trần Thị Bình', '30G-543.21', 'Ô tô', 'Trắng'),
('Lê Cảnh Duy', '29B-987.65', 'Xe máy', 'Xanh dương'),
('Phạm Thị Giang', '30H-112.23', 'Ô tô', 'Đen'),
('Hoàng Văn Hùng', '29C-445.56', 'Xe máy', 'Vàng'),
('Nguyễn Thị Thu', '33K-678.90', 'Ô tô', 'Bạc'),
('Trần Quang Vinh', '18M-123.99', 'Xe máy', 'Đen'),
('Phạm Duy Anh', '29F-789.01', 'Ô tô', 'Đỏ'),
('Lê Thanh Hải', '30A-234.56', 'Xe tải', 'Xám'),
('Vũ Thị Lan', '31B-345.67', 'Xe máy', 'Hồng'),
('Đặng Văn Kiên', '29D-876.54', 'Xe ô tô', 'Xanh lá'),
('Hoàng Thị Mai', '30K-998.87', 'Xe đạp điện', 'Trắng'),
('Trần Văn Nghĩa', '29E-001.12', 'Xe máy', 'Nâu'),
('Nguyễn Hải Yến', '30F-223.34', 'Ô tô', 'Be'),
('Lê Hữu Phúc', '29G-556.67', 'Xe máy', 'Cam');

--
-- Thêm dữ liệu vào bảng NhanDangPhuongTien (IdNhanDangPhuongTien tự tăng)
-- Thời gian được điều chỉnh để khớp với thời gian ảnh được chụp hoặc sau đó một chút.
--
INSERT INTO NhanDangPhuongTien (IdPhuongTien, IdCamera, ThoiGian, IdAnh, ViTri, DoTinCay) VALUES
(1, 1, '2025-06-10 23:00:15', 1, 'Ngã tư Hàng Bài - Tràng Tiền', 0.95), -- Ảnh 1 (23:00:00)
(2, 2, '2025-06-10 23:02:10', 3, 'Khu vực Hồ Gươm', 0.88), -- Ảnh 3 (23:02:00)
(3, 3, '2025-06-10 23:04:20', 5, 'Quảng trường Ba Đình', 0.92), -- Ảnh 5 (23:04:00)
(4, 5, '2025-06-10 23:07:30', 8, 'Ngã tư Thái Hà - Chùa Bộc', 0.85), -- Ảnh 8 (23:07:00)
(5, 7, '2025-06-10 23:10:35', 11, 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 0.90), -- Ảnh 11 (23:10:00)
(6, 1, '2025-06-10 23:01:10', 2, 'Ngã tư Hàng Bài - Tràng Tiền', 0.93), -- Ảnh 2 (23:01:00)
(7, 2, '2025-06-10 23:03:15', 4, 'Khu vực Hồ Gươm', 0.87), -- Ảnh 4 (23:03:00)
(8, 3, '2025-06-10 23:05:20', 6, 'Quảng trường Ba Đình', 0.91), -- Ảnh 6 (23:05:00)
(9, 8, '2025-06-10 23:11:05', 12, 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 0.96), -- Ảnh 12 (23:11:00)
(10, 10, '2025-06-10 23:13:10', 14, 'Khu vực Công viên Nước Hồ Tây', 0.89), -- Ảnh 14 (23:13:00)
(11, 12, '2025-06-10 23:15:15', 16, 'Khu vực Đại học Quốc Gia Hà Nội', 0.94), -- Ảnh 16 (23:15:00)
(12, 14, '2025-06-10 23:17:20', 18, 'Khu vực Royal City', 0.82), -- Ảnh 18 (23:17:00)
(13, 16, '2025-06-10 23:19:25', 20, 'Khu vực Aeon Mall Long Biên', 0.97), -- Ảnh 20 (23:19:00)
(14, 18, '2025-06-10 23:18:10', 19, 'Khu vực Bến xe Giáp Bát', 0.80), -- Ảnh 19 (23:18:00)
(15, 20, '2025-06-10 23:16:15', 17, 'Khu vực Sân vận động Mỹ Đình', 0.90); -- Ảnh 17 (23:16:00)

--
-- Thêm dữ liệu vào bảng DanhMucViPham (IdDanhMuc sẽ là 1-6)
-- (Không thay đổi, giữ nguyên)
--
INSERT INTO DanhMucViPham (LoaiViPham, MucPhat) VALUES
('Vượt đèn đỏ', 500000),
('Chạy quá tốc độ', 800000),
('Đỗ xe sai quy định', 300000),
('Đi ngược chiều', 1000000),
('Không đội mũ bảo hiểm', 250000),
('Vượt quá vạch dừng', 150000);

--
-- Thêm dữ liệu vào bảng PhatHienViPham (IdPhatHien tự tăng)
-- Thời gian được điều chỉnh để khớp với thời gian ảnh được chụp hoặc sau đó một chút.
--
INSERT INTO PhatHienViPham (IdCamera, ThoiGian, ViTri, IdPhuongTien, IdDanhMuc, IdAnh, TrangThai) VALUES
(1, '2025-06-10 23:00:40', 'Ngã tư Hàng Bài - Tràng Tiền', 1, 1, 1, 'Chua Xu Ly'), -- Ảnh 1 (23:00:00)
(2, '2025-06-10 23:02:45', 'Khu vực Hồ Gươm', 2, 2, 3, 'Da Xu Ly'), -- Ảnh 3 (23:02:00)
(3, '2025-06-10 23:04:50', 'Quảng trường Ba Đình', 3, 3, 5, 'Chua Xu Ly'), -- Ảnh 5 (23:04:00)
(5, '2025-06-10 23:07:55', 'Ngã tư Thái Hà - Chùa Bộc', 4, 1, 8, 'Chua Xu Ly'), -- Ảnh 8 (23:07:00)
(7, '2025-06-10 23:10:00', 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 5, 4, 11, 'Huy'), -- Ảnh 11 (23:10:00)
(1, '2025-06-10 23:01:15', 'Phố Đinh Tiên Hoàng', 6, 5, 2, 'Chua Xu Ly'), -- Ảnh 2 (23:01:00)
(2, '2025-06-10 23:03:20', 'Khu vực Hồ Gươm', 7, 6, 4, 'Da Xu Ly'), -- Ảnh 4 (23:03:00)
(3, '2025-06-10 23:05:25', 'Quảng trường Ba Đình', 8, 1, 6, 'Chua Xu Ly'), -- Ảnh 6 (23:05:00)
(8, '2025-06-10 23:11:30', 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 9, 2, 12, 'Da Xu Ly'), -- Ảnh 12 (23:11:00)
(10, '2025-06-10 23:13:35', 'Khu vực Công viên Nước Hồ Tây', 10, 3, 14, 'Chua Xu Ly'), -- Ảnh 14 (23:13:00)
(12, '2025-06-10 23:15:40', 'Khu vực Đại học Quốc Gia Hà Nội', 11, 4, 16, 'Chua Xu Ly'), -- Ảnh 16 (23:15:00)
(14, '2025-06-10 23:17:45', 'Khu vực Royal City', 12, 5, 18, 'Huy'), -- Ảnh 18 (23:17:00)
(16, '2025-06-10 23:19:50', 'Khu vực Aeon Mall Long Biên', 13, 6, 20, 'Da Xu Ly'), -- Ảnh 20 (23:19:00)
(18, '2025-06-10 23:18:15', 'Khu vực Bến xe Giáp Bát', 14, 1, 19, 'Chua Xu Ly'), -- Ảnh 19 (23:18:00)
(20, '2025-06-10 23:16:20', 'Khu vực Sân vận động Mỹ Đình', 15, 2, 17, 'Chua Xu Ly'); -- Ảnh 17 (23:16:00)

--
-- Thêm dữ liệu vào bảng NhanDangNguoi (IdNhanDangNguoi tự tăng)
-- Thời gian được điều chỉnh để khớp với thời gian ảnh được chụp hoặc sau đó một chút.
--
INSERT INTO NhanDangNguoi (Tuoi, GioiTinh, DacTrung, IdAnh, IdCamera, ThoiGian, ViTri, DoTinCay) VALUES
-- Người 1: Nam, 35 tuổi, ở Khu vực Hồ Gươm
(35, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo khoác da đen, quần jean xanh đậm',
    'PhuKien', 'Đeo kính râm kiểu phi công, mang ba lô thể thao màu xám',
    'Toc', 'Ngắn, vuốt keo gọn gàng',
    'HinhDang', 'Cao ráo, vóc dáng cân đối'
), 1, 1, '2025-06-10 23:00:20', 'Khu vực Hồ Gươm', 0.92), -- Ảnh 1 (23:00:00)

-- Người 2: Nữ, 28 tuổi, ở Đường Thanh Niên
(28, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Váy maxi họa tiết hoa nhí màu xanh pastel',
    'PhuKien', 'Túi xách đeo chéo nhỏ màu nâu, khuyên tai tròn bạc',
    'Toc', 'Tóc dài ngang lưng, uốn xoăn nhẹ ở đuôi',
    'HinhDang', 'Thon thả, dáng người mảnh mai'
), 2, 2, '2025-06-10 23:01:25', 'Đường Thanh Niên', 0.85), -- Ảnh 2 (23:01:00)

-- Người 3: Nam, 45 tuổi, ở Quảng trường Ba Đình
(45, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo sơ mi trắng dài tay, quần tây đen, giày da',
    'PhuKien', 'Đồng hồ đeo tay mặt tròn, cà vạt sọc nhỏ',
    'Toc', 'Hói phần đỉnh đầu, tóc hai bên cắt ngắn',
    'HinhDang', 'Dáng người cao to, hơi có bụng'
), 3, 3, '2025-06-10 23:02:30', 'Quảng trường Ba Đình', 0.98), -- Ảnh 3 (23:02:00)

-- Người 4: Nữ, 22 tuổi, ở Khu vực Hồ Gươm
(22, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Quần jean rách gối, áo phông in hình hoạt hình, áo khoác denim',
    'PhuKien', 'Ba lô vải màu vàng, đội mũ lưỡi trai ngược',
    'Toc', 'Tóc búi cao kiểu củ tỏi, một vài sợi tóc con rủ xuống',
    'HinhDang', 'Nhỏ nhắn, thon gọn, năng động'
), 4, 2, '2025-06-10 23:03:35', 'Khu vực Hồ Gươm', 0.89), -- Ảnh 4 (23:03:00)

-- Người 5: Nam, 50 tuổi, ở Quảng trường Ba Đình
(50, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Bộ vest màu xám than, áo sơ mi xanh nhạt, cà vạt chấm bi',
    'PhuKien', 'Cặp da màu đen, bút cài túi áo',
    'Toc', 'Tóc bạc hai bên thái dương, chải gọn gàng',
    'HinhDang', 'Vóc dáng trung bình, điềm đạm'
), 5, 3, '2025-06-10 23:04:40', 'Quảng trường Ba Đình', 0.95), -- Ảnh 5 (23:04:00)

-- Người 6: Nữ, 30 tuổi, ở Vincom Center Nguyễn Chí Thanh
(30, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Đầm xòe màu đỏ đô, dài đến gối',
    'PhuKien', 'Khuyên tai dài đính đá, vòng tay mảnh',
    'Toc', 'Tóc xoăn lọn lớn, thả tự nhiên',
    'HinhDang', 'Dáng người đồng hồ cát, thanh lịch'
), 6, 3, '2025-06-10 23:05:45', 'Vincom Center Nguyễn Chí Thanh', 0.87), -- Ảnh 6 (23:05:00)

-- Người 7: Nam, 40 tuổi, ở Phố Tràng Tiền (dữ liệu cũ từ camera hỏng)
(40, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Quần short kaki be, áo phông sọc ngang trắng xanh',
    'PhuKien', 'Mũ lưỡi trai màu xanh navy, dép xỏ ngón',
    'Toc', 'Tóc cắt ngắn, cạo sát hai bên',
    'HinhDang', 'Vạm vỡ, cơ bắp, dáng thể thao'
), 7, 4, '2025-06-10 23:06:50', 'Phố Tràng Tiền', 0.90), -- Ảnh 7 (23:06:00)

-- Người 8: Nữ, 25 tuổi, ở Ngã tư Thái Hà - Chùa Bộc
(25, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Áo hoodie màu tím pastel, quần jogger đen',
    'PhuKien', 'Tai nghe chụp tai lớn màu trắng, túi tote vải',
    'Toc', 'Tóc nhuộm màu khói, buộc đuôi ngựa cao',
    'HinhDang', 'Nhỏ nhắn, dáng người gầy'
), 8, 5, '2025-06-10 23:07:55', 'Ngã tư Thái Hà - Chùa Bộc', 0.83), -- Ảnh 8 (23:07:00)

-- Người 9: Nam, 60 tuổi, ở Ngã tư Thái Hà - Chùa Bộc
(60, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo ba lỗ màu trắng, quần đùi caro',
    'PhuKien', 'Kính lão gọng nhựa đen, đi dép lê',
    'Toc', 'Đầu hói hoàn toàn, chỉ còn ít tóc bạc hai bên',
    'HinhDang', 'Gầy yếu, lưng hơi còng'
), 9, 5, '2025-06-10 23:08:05', 'Ngã tư Thái Hà - Chùa Bộc', 0.75), -- Ảnh 9 (23:08:00)

-- Người 10: Nữ, 18 tuổi, ở Khu vực Đại học Quốc Gia Hà Nội
(18, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Đồng phục học sinh (áo trắng, quần xanh), áo khoác đồng phục khoác ngoài',
    'PhuKien', 'Cặp sách lớn màu đen, đeo thẻ học sinh',
    'Toc', 'Tóc thẳng dài, buộc nửa đầu',
    'HinhDang', 'Dáng người gầy, cao'
), 10, 6, '2025-06-10 23:09:10', 'Khu vực Đại học Quốc Gia Hà Nội', 0.94), -- Ảnh 10 (23:09:00)

-- Người 11: Nam, 32 tuổi, ở Ngã tư Đại Cồ Việt - Trần Khát Chân
(32, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Bộ vest màu xanh navy, áo sơ mi kẻ sọc nhỏ',
    'PhuKien', 'Không có',
    'Toc', 'Ngắn, rẽ ngôi lệch',
    'HinhDang', 'Vóc dáng trung bình, lịch sự'
), 11, 7, '2025-06-10 23:10:15', 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 0.96), -- Ảnh 11 (23:10:00)

-- Người 12: Nữ, 29 tuổi, ở Khu vực Lăng Chủ tịch Hồ Chí Minh
(29, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Áo len dệt kim màu kem, quần skinny jean đen',
    'PhuKien', 'Khăn quàng cổ họa tiết, găng tay len',
    'Toc', 'Tóc dài qua vai, mái bằng',
    'HinhDang', 'Nhỏ nhắn, cao dưới 1m60'
), 12, 8, '2025-06-10 23:11:20', 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 0.88), -- Ảnh 12 (23:11:00)

-- Người 13: Nam, 48 tuổi, ở Ngã tư Giải Phóng - Vành đai 3
(48, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo phông oversize màu xám, quần jogger lửng',
    'PhuKien', 'Đồng hồ thể thao lớn, đội mũ lưỡi trai',
    'Toc', 'Tóc ngắn, hơi lởm chởm',
    'HinhDang', 'Vóc dáng mập mạp, thấp'
), 13, 9, '2025-06-10 23:12:25', 'Ngã tư Giải Phóng - Vành đai 3', 0.91), -- Ảnh 13 (23:12:00)

-- Người 14: Nữ, 20 tuổi, ở Khu vực Sân vận động Mỹ Đình
(20, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Quần jean ống rộng, áo crop top trắng, áo sơ mi khoác ngoài',
    'PhuKien', 'Giày sneaker cao cổ, kính râm gọng lớn',
    'Toc', 'Tóc xoăn gợn sóng, buộc đuôi ngựa thấp',
    'HinhDang', 'Cao, thon, dáng người mẫu'
), 14, 10, '2025-06-10 23:13:30', 'Khu vực Sân vận động Mỹ Đình', 0.86), -- Ảnh 14 (23:13:00)

-- Người 15: Nam, 55 tuổi, ở Ngã tư Xuân Thủy - Nguyễn Phong Sắc
(55, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo khoác gió màu xanh đậm, quần vải ống đứng',
    'PhuKien', 'Mũ len màu đen, găng tay len',
    'Toc', 'Đầu hói phần đỉnh, tóc hai bên bạc',
    'HinhDang', 'Vóc dáng trung bình, hơi gù lưng'
), 15, 11, '2025-06-10 23:14:35', 'Ngã tư Xuân Thủy - Nguyễn Phong Sắc', 0.79); -- Ảnh 15 (23:14:00)

--
-- Thêm dữ liệu vào bảng TinhTrangGiaoThong (IdTinhTrangGiaoThong tự tăng)
-- Thời gian được điều chỉnh để khớp với thời gian ảnh được chụp hoặc sau đó một chút.
--
INSERT INTO TinhTrangGiaoThong (IdCamera, ThoiGian, MatDoGiaoThong, TocDoTrungBinh) VALUES
(1, '2025-06-10 23:00:50', 'Thong Thoang', 45.5), -- Ảnh 1 (23:00:00)
(2, '2025-06-10 23:02:55', 'Dong Duc', 25.0), -- Ảnh 3 (23:02:00)
(3, '2025-06-10 23:04:00', 'Un Tac', 10.2), -- Ảnh 5 (23:04:00)
(5, '2025-06-10 23:07:05', 'Thong Thoang', 52.1), -- Ảnh 8 (23:07:00)
(7, '2025-06-10 23:10:10', 'Dong Duc', 30.8), -- Ảnh 11 (23:10:00)
(1, '2025-06-10 23:01:15', 'Dong Duc', 28.5), -- Ảnh 2 (23:01:00)
(2, '2025-06-10 23:03:20', 'Thong Thoang', 38.0), -- Ảnh 4 (23:03:00)
(3, '2025-06-10 23:05:25', 'Un Tac', 15.0), -- Ảnh 6 (23:05:00)
(8, '2025-06-10 23:11:30', 'Thong Thoang', 40.0), -- Ảnh 12 (23:11:00)
(10, '2025-06-10 23:13:35', 'Dong Duc', 22.0), -- Ảnh 14 (23:13:00)
(12, '2025-06-10 23:15:40', 'Thong Thoang', 35.0), -- Ảnh 16 (23:15:00)
(14, '2025-06-10 23:17:45', 'Un Tac', 8.5), -- Ảnh 18 (23:17:00)
(16, '2025-06-10 23:19:50', 'Dong Duc', 20.0), -- Ảnh 20 (23:19:00)
(18, '2025-06-10 23:18:55', 'Thong Thoang', 48.0), -- Ảnh 19 (23:18:00)
(20, '2025-06-10 23:16:00', 'Un Tac', 12.0); -- Ảnh 17 (23:16:00)

