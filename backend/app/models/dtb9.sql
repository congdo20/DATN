DROP DATABASE IF EXISTS SMARTCITY1;
CREATE DATABASE SMARTCITY1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE SMARTCITY1;

CREATE TABLE KhuVuc (
    IdKhuVuc INT PRIMARY KEY AUTO_INCREMENT,
    TenKhuVuc VARCHAR(255) NOT NULL
);

CREATE TABLE Camera (
    IdCamera INT PRIMARY KEY AUTO_INCREMENT,
    IpCamera VARCHAR(255) NOT NULL UNIQUE,
    IdKhuVuc INT,
    ViTriLapDat VARCHAR(255),
    Latitude DECIMAL(10, 7),  -- Thêm trường Vĩ độ
    Longitude DECIMAL(10, 7), -- Thêm trường Kinh độ
    TrangThaiCamera ENUM('Hoat Dong', 'Khong Hoat Dong', 'Hu Hong', 'Bao Tri') DEFAULT 'Hoat Dong',
    NgayLapDat DATE,
    BaoTri DATE,
    FOREIGN KEY (IdKhuVuc) REFERENCES KhuVuc(IdKhuVuc) ON DELETE SET NULL
);

CREATE TABLE Anh (
    IdAnh INT PRIMARY KEY AUTO_INCREMENT,
    IdCamera INT NOT NULL,
    ThoiGian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DuongDan TEXT NOT NULL,
    KichThuoc DECIMAL(10,2),
    FOREIGN KEY (IdCamera) REFERENCES Camera(IdCamera) ON DELETE CASCADE
);

CREATE TABLE TaiKhoan (
    IdTaiKhoan INT PRIMARY KEY AUTO_INCREMENT,
    IdKhuVuc INT,
    VaiTro ENUM('Quan Tri', 'Nhan Vien', 'Giam Sat', 'Nguoi Dan', 'Nguoi Dung') NOT NULL,
    TenNguoiDung VARCHAR(255),
    SoDienThoai VARCHAR(15) UNIQUE,
    Email VARCHAR(255) UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    NgaySinh DATE,
    GioiTinh ENUM('Nam', 'Nu', 'Khac'),
    TrangThai ENUM('Hoat Dong', 'Khoa', 'Tam Ngung') DEFAULT 'Hoat Dong',
    FOREIGN KEY (IdKhuVuc) REFERENCES KhuVuc(IdKhuVuc) ON DELETE CASCADE
);

CREATE TABLE PhuongTien (
    IdPhuongTien INT PRIMARY KEY AUTO_INCREMENT,
    ChuSoHuu VARCHAR(255) NOT NULL,
    BienSo VARCHAR(20) UNIQUE NOT NULL,
    KieuXe VARCHAR(50) NOT NULL,
    MauSac VARCHAR(30) NOT NULL
);

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

CREATE TABLE DanhMucViPham (
    IdDanhMuc INT PRIMARY KEY AUTO_INCREMENT,
    LoaiViPham VARCHAR(255) UNIQUE NOT NULL,
    MucPhat DECIMAL(10,2) NOT NULL
);

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

CREATE TABLE TinhTrangGiaoThong (
    IdTinhTrang INT PRIMARY KEY AUTO_INCREMENT,
    IdCamera INT NOT NULL,
    ThoiGian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    MatDoGiaoThong ENUM('Thong Thoang', 'Dong Duc', 'Un Tac'),
    TocDoTrungBinh DECIMAL(6,2),
    FOREIGN KEY (IdCamera) REFERENCES Camera(IdCamera) ON DELETE CASCADE
);


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
('Nam Từ Liêm'),
('Hà Đông'),
('Bắc từ Liêm');

INSERT INTO Camera (IpCamera, IdKhuVuc, ViTriLapDat, Latitude, Longitude, TrangThaiCamera, NgayLapDat, BaoTri) VALUES
-- Khu vực 1: Hoàn Kiếm (21.0285, 105.8542 là trung tâm Hà Nội)
('127.0.0.1:8001/video_feed', 1, 'Ngã tư Hàng Bài - Tràng Tiền', 21.0259, 105.8530, 'Hoat Dong', '2024-01-15', NULL),
('0.0.0.0:8001/video_feed', 1, 'Khu vực Hồ Gươm', 21.0287, 105.8522, 'Hoat Dong', '2024-02-20', NULL),
('127.0.0.1:8000/videos/test.mp4', 1, 'Đường Đinh Tiên Hoàng', 21.0298, 105.8529, 'Hoat Dong', '2024-03-01', NULL),
('127.0.0.1:8000/images/car/508.jpg', 1, 'Phố Tràng Tiền', 21.0255, 105.8538, 'Hoat Dong', '2023-11-01', '2024-03-15'),

('192.168.1.105', 2, 'Quảng trường Ba Đình', 21.0371, 105.8340, 'Hoat Dong', '2024-03-10', NULL),
('192.168.1.106', 2, 'Đường Điện Biên Phủ', 21.0305, 105.8398, 'Hoat Dong', '2024-04-05', NULL),
('192.168.1.107', 2, 'Đường Hùng Vương', 21.0380, 105.8355, 'Hu Hong', '2024-04-20', NULL),
('192.168.1.108', 2, 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 21.0366, 105.8339, 'Hoat Dong', '2024-05-01', NULL),

('192.168.1.109', 3, 'Ngã tư Thái Hà - Chùa Bộc', 21.0125, 105.8198, 'Bao Tri', '2024-05-12', NULL),
('192.168.1.110', 3, 'Khu vực Vincom Center Nguyễn Chí Thanh', 21.0215, 105.8034, 'Hoat Dong', '2024-06-22', NULL),
('192.168.1.111', 3, 'Phố Tây Sơn', 21.0080, 105.8230, 'Hoat Dong', '2024-07-05', NULL),
('192.168.1.112', 3, 'Đường Láng', 21.0190, 105.7980, 'Hu Hong', '2024-01-10', '2024-07-15'),

('192.168.1.113', 4, 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 21.0060, 105.8490, 'Hoat Dong', '2024-07-01', NULL),
('192.168.1.114', 4, 'Khu vực Times City', 20.9995, 105.8750, 'Hoat Dong', '2024-08-18', NULL),
('192.168.1.115', 4, 'Đường Minh Khai', 21.0050, 105.8650, 'Khong Hoat Dong', '2024-09-01', NULL),
('192.168.1.116', 4, 'Đường Trần Khát Chân', 21.0110, 105.8590, 'Hoat Dong', '2024-09-10', NULL), -- Đã sửa vị trí hợp lý hơn

('192.168.1.117', 5, 'Đường Thanh Niên', 21.0415, 105.8350, 'Hoat Dong', '2024-09-25', NULL),
('192.168.1.118', 5, 'Khu vực Công viên Nước Hồ Tây', 21.0660, 105.8200, 'Hoat Dong', '2024-10-30', NULL),
('192.168.1.119', 5, 'Đường Xuân Diệu', 21.0600, 105.8280, 'Hoat Dong', '2024-11-05', NULL),
('192.168.1.120', 5, 'Đường Âu Cơ', 21.0700, 105.8350, 'Hoat Dong', '2024-11-15', NULL),

('192.168.1.121', 6, 'Ngã tư Xuân Thủy - Nguyễn Phong Sắc', 21.0370, 105.7890, 'Hoat Dong', '2024-11-15', NULL),
('192.168.1.122', 6, 'Khu vực Đại học Quốc Gia Hà Nội', 21.0360, 105.7810, 'Hoat Dong', '2024-12-01', NULL),
('192.168.1.123', 6, 'Đường Trần Duy Hưng', 21.0190, 105.7920, 'Hoat Dong', '2024-12-10', NULL),
('192.168.1.124', 6, 'Khu đô thị Trung Hòa Nhân Chính', 21.0070, 105.8010, 'Hu Hong', '2024-02-20', '2024-12-25'), -- Đã sửa vị trí hợp lý hơn

('192.168.1.125', 7, 'Ngã tư Khuất Duy Tiến - Nguyễn Trãi', 20.9940, 105.7950, 'Hoat Dong', '2025-01-10', NULL),
('192.168.1.126', 7, 'Khu vực Royal City', 20.9990, 105.8110, 'Hoat Dong', '2025-02-28', NULL),
('192.168.1.127', 7, 'Đường Nguyễn Văn Trỗi', 20.9960, 105.8050, 'Hoat Dong', '2025-03-05', NULL),
('192.168.1.128', 7, 'Đường Nguyễn Trãi (khu vực khác)', 20.9900, 105.7980, 'Hoat Dong', '2025-03-15', NULL),

('192.168.1.129', 8, 'Cầu Chương Dương', 21.0350, 105.8750, 'Hoat Dong', '2025-04-12', NULL),
('192.168.1.130', 8, 'Khu vực Aeon Mall Long Biên', 21.0090, 105.8890, 'Hoat Dong', '2025-04-15', NULL),
('192.168.1.131', 8, 'Đường Ngô Gia Tự', 21.0500, 105.8700, 'Hoat Dong', '2025-04-20', NULL),
('192.168.1.132', 8, 'Cầu Vĩnh Tuy', 21.0060, 105.8790, 'Hoat Dong', '2025-04-25', NULL),

('192.168.1.133', 9, 'Ngã tư Giải Phóng - Vành đai 3', 20.9850, 105.8390, 'Hoat Dong', '2025-05-01', NULL),
('192.168.1.134', 9, 'Khu vực Bến xe Giáp Bát', 20.9830, 105.8450, 'Hoat Dong', '2025-05-05', NULL),
('192.168.1.135', 9, 'Đường Kim Đồng', 20.9890, 105.8500, 'Hoat Dong', '2025-05-10', NULL),
('192.168.1.136', 9, 'Đường Tam Trinh', 20.9800, 105.8600, 'Hoat Dong', '2025-05-15', NULL), -- Đã sửa vị trí hợp lý hơn

-- Khu vực 10: Nam Từ Liêm
('192.168.1.137', 10, 'Đường Lê Đức Thọ', 21.0290, 105.7760, 'Hoat Dong', '2025-05-20', NULL),
('192.168.1.138', 10, 'Khu vực Sân vận động Mỹ Đình', 21.0200, 105.7790, 'Hoat Dong', '2025-05-25', NULL),
('192.168.1.139', 10, 'Đường Hàm Nghi', 21.0250, 105.7700, 'Hoat Dong', '2025-05-30', NULL),
('192.168.1.140', 10, 'Đường Mễ Trì', 21.0150, 105.7750, 'Hoat Dong', '2025-06-01', NULL);


INSERT INTO Anh (IdCamera, DuongDan, ThoiGian, KichThuoc) VALUES
(1, '/images/car/51A-01204.jpg', '2025-06-10 23:01:00', 1.10),
(1, '/images/car/51A-01204(1).jpg', '2025-06-10 23:00:00', 1.25),
(2, '/images/car/51A-05227(1).jpg', '2025-06-10 23:02:00', 0.98),
(3, '/images/car/51A-05227.jpg', '2025-06-10 23:03:00', 1.05),
(4, '/images/car/51A-69172.jpg', '2025-06-10 23:04:00', 1.50),
(3, '/images/car/51A-69172(1).jpg', '2025-06-10 23:05:00', 1.30),
(4, '/images/car/51F-16159.jpg', '2025-06-10 23:06:00', 1.05),
(5, '/images/car/51F-06948(1).jpg', '2025-06-10 23:07:00', 1.18),
(6, '/images/car/51F-06948.jpg', '2025-06-10 23:08:00', 0.95),
(5, '/images/car/51F-88270.jpg', '2025-06-10 23:09:00', 1.00),
(7, '/images/car/51F-59881.jpg', '2025-06-10 23:10:00', 1.20),
(8, '/images/car/86A-06844.jpg', '2025-06-10 23:11:00', 1.35),
(9, '/images/motorbike/52U7-8693.jpg', '2025-06-10 23:12:00', 1.40),
(10, '/images/motorbike/59C1-65331.jpg', '2025-06-10 23:13:00', 1.12),
(11, '/images/motorbike/59E1-21500.jpg', '2025-06-10 23:14:00', 0.88),
(12, '/images/motorbike/59F1-13860.jpg', '2025-06-10 23:15:00', 1.08),
(13, '/images/motorbike/59F1-68955.jpg', '2025-06-10 23:16:00', 1.22),
(14, '/images/motorbike/59H1-54986.jpg', '2025-06-10 23:17:00', 1.15),
(15, '/images/motorbike/59L2-06377.jpg', '2025-06-10 23:18:00', 0.99),
(16, '/images/motorbike/59P1-66480.jpg', '2025-06-10 23:19:00', 1.07),
(7, '/images/car/51F-88270(1).jpg', '2025-06-10 23:09:00', 1.00),
(5, '/images/car/51F-88270(2).jpg', '2025-06-10 23:09:00', 1.00),
(8, '/images/car/51F-88270(3).jpg', '2025-06-10 23:09:00', 1.00),
(1, '/images/person/ducanh.jpg', '2025-06-10 23:01:00', 1.10),
(1, '/images/person/ducanh1.jpg', '2025-06-10 23:00:00', 1.25),
(2, '/images/person/do.jpg', '2025-06-10 23:02:00', 0.98),
(3, '/images/person/do1.jpg', '2025-06-10 23:03:00', 1.05),
(4, '/images/person/quang.jpg', '2025-06-10 23:04:00', 1.50);

INSERT INTO TaiKhoan (IdKhuVuc, VaiTro, TenNguoiDung, SoDienThoai, Email, MatKhau, NgaySinh, GioiTinh, TrangThai) VALUES
(1, 'Quan Tri', 'Nguyễn Văn An', '0901112233', 'giamsat2@smartcity.vn', 'Do200102!', '1988-01-20', 'Nam', 'Hoat Dong'),
(2, 'Nhan Vien', 'Trần Thị Bình', '0912223344', 'nhanvien1@smartcity.vn', 'Do200102!', '1992-07-10', 'Nu', 'Hoat Dong'),
(1, 'Giam Sat', 'Lê Cảnh Duy', '0933445566', 'giamsat1@smartcity.vn', 'Do200102!', '1985-03-05', 'Nam', 'Hoat Dong'),
(3, 'Nguoi Dung', 'Phạm Thị Giang', '0944556677', 'nguoidung1@smartcity.vn', 'Do200102!', '1990-11-25', 'Nu', 'Hoat Dong'),
(4, 'Nguoi Dan', 'Đỗ Văn Hùng', '0966778899', 'nguoidan1@smartcity.vn', 'Do200102!', '1979-09-12', 'Nam', 'Hoat Dong'),
(4, 'Quan Tri', 'Nguyễn Công Trình Độ', '0975462068', 'quantri1@smartcity.vn', 'Do200102!', '2002-01-20', 'Nam', 'Hoat Dong');


INSERT INTO PhuongTien (ChuSoHuu, BienSo, KieuXe, MauSac) VALUES
('Nguyễn Văn An', '52U7-8693', 'Xe máy', 'Đen'),
('Trần Thị Bình', '51A-01204', 'Ô tô', 'Be'),
('Lê Cảnh Duy', '59C1-65331', 'Xe máy', 'Trắng'),
('Phạm Thị Giang', '51A-05227', 'Ô tô', 'Bạc'),
('Hoàng Văn Hùng', '59F1-68955', 'Xe máy', 'Vàng'),
('Nguyễn Thị Thu', '51A-69172', 'Ô tô', 'Đỏ'),
('Trần Quang Vinh', '59F1-13860', 'Xe máy', 'Đen'),
('Phạm Duy Anh', '51F-16159', 'Ô tô', 'Đỏ'),
('Lê Thanh Hải', '51F-06948', 'Ô tô', 'Xám'),
('Vũ Thị Lan', '59E1-21500', 'Xe máy', 'Đen'),
('Đặng Văn Kiên', '51F-59881', 'Ô tô', 'Đỏ'),
('Hoàng Thị Mai', '59H1-54986', 'Xe máy', 'Đồng'),
('Trần Văn Nghĩa', '59L2-06377', 'Xe máy', 'Nâu'),
('Nguyễn Hải Yến', '51F-88270', 'Ô tô', 'Đỏ'),
('Lê Hữu Phúc', '59P1-66480', 'Xe máy', 'Đen');


INSERT INTO DanhMucViPham (LoaiViPham, MucPhat) VALUES
('Vượt đèn đỏ', 5000000),
('Chạy quá tốc độ', 1000000),
('Đỗ xe sai quy định', 500000),
('Đi ngược chiều', 3000000),
('Không đội mũ bảo hiểm', 250000),
('Vượt quá vạch dừng', 150000);


INSERT INTO NhanDangPhuongTien (IdPhuongTien, IdCamera, ThoiGian, IdAnh, ViTri, DoTinCay) VALUES
(14, 6, '2025-06-10 23:01:15', 10, 'Đường Điện Biên Phủ', 0.95),
(14, 7, '2025-06-10 23:03:10', 21, 'Đường Hùng Vương', 0.88),
(14, 5, '2025-06-10 23:04:50', 22, 'Quảng trường Ba Đình', 0.92),
(14, 8, '2025-06-10 23:07:55', 23, 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 0.85),

(2, 1, '2025-06-10 23:11:35', 1, 'Ngã tư Hàng Bài - Tràng Tiền', 0.90),
(2, 4, '2025-06-10 23:02:10', 2, 'Phố Tràng Tiền', 0.93),
(3, 10, '2025-06-10 23:03:55', 14, 'Khu vực Vincom Center Nguyễn Chí Thanh', 0.87),
(4, 2, '2025-06-10 23:06:20', 6, 'Khu vực Hồ Gươm', 0.91),

(4, 3, '2025-06-10 23:06:20', 6, 'Đường Đinh Tiên Hoàng', 0.91),
(5, 13, '2025-06-10 23:11:55', 17, 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 0.96),
(6, 4, '2025-06-10 23:14:10', 5, 'Phố Tràng Tiền', 0.89),
(6, 3, '2025-06-10 23:16:15', 6, 'Đường Đinh Tiên Hoàng', 0.94),

(7, 12, '2025-06-10 23:18:20', 16, 'Đường Láng', 0.82),
(8, 4, '2025-06-10 23:20:25', 7, 'Phố Tràng Tiền', 0.97),
(9, 6, '2025-06-10 23:19:10', 9, 'Đường Điện Biên Phủ', 0.80),
(10, 11, '2025-06-10 23:16:45', 15, 'Phố Tây Sơn', 0.90);


INSERT INTO NhanDangNguoi (Tuoi, GioiTinh, DacTrung, IdAnh, IdCamera, ThoiGian, ViTri, DoTinCay) VALUES
(35, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo khoác da đen, quần jean xanh đậm',
    'PhuKien', 'Đeo kính râm kiểu phi công, mang ba lô thể thao màu xám',
    'Toc', 'Ngắn, vuốt keo gọn gàng',
    'HinhDang', 'Cao ráo, vóc dáng cân đối'
), 1, 1, '2025-06-10 23:01:20', 'Khu vực Hồ Gươm', 0.92),
(28, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Váy maxi họa tiết hoa nhí màu xanh pastel',
    'PhuKien', 'Túi xách đeo chéo nhỏ màu nâu, khuyên tai tròn bạc',
    'Toc', 'Tóc dài ngang lưng, uốn xoăn nhẹ ở đuôi',
    'HinhDang', 'Thon thả, dáng người mảnh mai'
), 2, 2, '2025-06-10 23:02:25', 'Đường Thanh Niên', 0.85),
(45, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo sơ mi trắng dài tay, quần tây đen, giày da',
    'PhuKien', 'Đồng hồ đeo tay mặt tròn, cà vạt sọc nhỏ',
    'Toc', 'Hói phần đỉnh đầu, tóc hai bên cắt ngắn',
    'HinhDang', 'Dáng người cao to, hơi có bụng'
), 3, 3, '2025-06-10 23:03:00', 'Quảng trường Ba Đình', 0.98),
(22, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Quần jean rách gối, áo phông in hình hoạt hình, áo khoác denim',
    'PhuKien', 'Ba lô vải màu vàng, đội mũ lưỡi trai ngược',
    'Toc', 'Tóc búi cao kiểu củ tỏi, một vài sợi tóc con rủ xuống',
    'HinhDang', 'Nhỏ nhắn, thon gọn, năng động'
), 4, 2, '2025-06-10 23:04:35', 'Khu vực Hồ Gươm', 0.89),
(50, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Bộ vest màu xám than, áo sơ mi xanh nhạt, cà vạt chấm bi',
    'PhuKien', 'Cặp da màu đen, bút cài túi áo',
    'Toc', 'Tóc bạc hai bên thái dương, chải gọn gàng',
    'HinhDang', 'Vóc dáng trung bình, điềm đạm'
), 5, 3, '2025-06-10 23:04:40', 'Quảng trường Ba Đình', 0.95),
(30, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Đầm xòe màu đỏ đô, dài đến gối',
    'PhuKien', 'Khuyên tai dài đính đá, vòng tay mảnh',
    'Toc', 'Tóc xoăn lọn lớn, thả tự nhiên',
    'HinhDang', 'Dáng người đồng hồ cát, thanh lịch'
), 6, 3, '2025-06-10 23:05:45', 'Vincom Center Nguyễn Chí Thanh', 0.87),
(40, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Quần short kaki be, áo phông sọc ngang trắng xanh',
    'PhuKien', 'Mũ lưỡi trai màu xanh navy, dép xỏ ngón',
    'Toc', 'Tóc cắt ngắn, cạo sát hai bên',
    'HinhDang', 'Vạm vỡ, cơ bắp, dáng thể thao'
), 7, 4, '2025-06-10 23:06:50', 'Phố Tràng Tiền', 0.90),
(25, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Áo hoodie màu tím pastel, quần jogger đen',
    'PhuKien', 'Tai nghe chụp tai lớn màu trắng, túi tote vải',
    'Toc', 'Tóc nhuộm màu khói, buộc đuôi ngựa cao',
    'HinhDang', 'Nhỏ nhắn, dáng người gầy'
), 8, 5, '2025-06-10 23:07:55', 'Ngã tư Thái Hà - Chùa Bộc', 0.83),
(60, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo ba lỗ màu trắng, quần đùi caro',
    'PhuKien', 'Kính lão gọng nhựa đen, đi dép lê',
    'Toc', 'Đầu hói hoàn toàn, chỉ còn ít tóc bạc hai bên',
    'HinhDang', 'Gầy yếu, lưng hơi còng'
), 9, 5, '2025-06-10 23:09:05', 'Ngã tư Thái Hà - Chùa Bộc', 0.75),
(18, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Đồng phục học sinh (áo trắng, quần xanh), áo khoác đồng phục khoác ngoài',
    'PhuKien', 'Cặp sách lớn màu đen, đeo thẻ học sinh',
    'Toc', 'Tóc thẳng dài, buộc nửa đầu',
    'HinhDang', 'Dáng người gầy, cao'
), 10, 6, '2025-06-10 23:10:10', 'Khu vực Đại học Quốc Gia Hà Nội', 0.94),
(32, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Bộ vest màu xanh navy, áo sơ mi kẻ sọc nhỏ',
    'PhuKien', 'Không có',
    'Toc', 'Ngắn, rẽ ngôi lệch',
    'HinhDang', 'Vóc dáng trung bình, lịch sự'
), 11, 7, '2025-06-10 23:10:55', 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 0.96),
(29, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Áo len dệt kim màu kem, quần skinny jean đen',
    'PhuKien', 'Khăn quàng cổ họa tiết, găng tay len',
    'Toc', 'Tóc dài qua vai, mái bằng',
    'HinhDang', 'Nhỏ nhắn, cao dưới 1m60'
), 12, 8, '2025-06-10 23:11:20', 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 0.88),
(48, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo phông oversize màu xám, quần jogger lửng',
    'PhuKien', 'Đồng hồ thể thao lớn, đội mũ lưỡi trai',
    'Toc', 'Tóc ngắn, hơi lởm chởm',
    'HinhDang', 'Vóc dáng mập mạp, thấp'
), 13, 9, '2025-06-10 23:12:25', 'Ngã tư Giải Phóng - Vành đai 3', 0.91),
(20, 'Nu', JSON_OBJECT(
    'TrangPhuc', 'Quần jean ống rộng, áo crop top trắng, áo sơ mi khoác ngoài',
    'PhuKien', 'Giày sneaker cao cổ, kính râm gọng lớn',
    'Toc', 'Tóc xoăn gợn sóng, buộc đuôi ngựa thấp',
    'HinhDang', 'Cao, thon, dáng người mẫu'
), 14, 10, '2025-06-10 23:13:30', 'Khu vực Sân vận động Mỹ Đình', 0.86),
(55, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo khoác gió màu xanh đậm, quần vải ống đứng',
    'PhuKien', 'Mũ len màu đen, găng tay len',
    'Toc', 'Đầu hói phần đỉnh, tóc hai bên bạc',
    'HinhDang', 'Vóc dáng trung bình, hơi gù lưng'
), 15, 11, '2025-06-10 23:14:35', 'Ngã tư Xuân Thủy - Nguyễn Phong Sắc', 0.79),
(20, 'Nam', JSON_OBJECT(
	'TrangPhuc', 'Áo sơ mi trắng dài tay',
    'PhuKien', 'Balo màu be, mũ đen, đeo kính cận',
    'Toc', 'Không rõ',
    'HinhDang', 'Dáng người gầy'
), 24, 1, '2025-06-10 23:01:20', 'Khu vực Hồ Gươm', 0.92),
(25, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo sơ mi xanh rêu dài tay, quần bò xanh đậm',
    'PhuKien', 'Vòng cổ',
    'Toc', 'Tóc ngắn',
    'HinhDang', 'Dáng người cao gầy'
), 25, 1, '2025-06-10 23:03:00', 'Quảng trường Ba Đình', 0.98),
(23, 'Nam', JSON_OBJECT(
	'TrangPhuc', 'Áo dài đen, quần thể dục xanh đậm',
    'PhuKien', 'Đeo khẩu trang xanh, mang ba lô thể thao màu xanh',
    'Toc', 'Màu vàng, ngắn, vuốt keo gọn gàng',
    'HinhDang', 'Cao ráo, vóc dáng cân đối'
), 26, 2, '2025-06-10 23:02:25', 'Đường Thanh Niên', 0.85),
(22, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Quần áo thể thao ngắn',
    'PhuKien', 'Giày màu hồng',
    'Toc', 'Tóc ngắn, vuốt gọn gàng',
    'HinhDang', 'Vóc dáng cao ráo, cân đối'
), 27, 3, '2025-06-10 23:04:35', 'Khu vực Hồ Gươm', 0.89),
(21, 'Nam', JSON_OBJECT(
    'TrangPhuc', 'Áo polo màu xanh, quần bò đen',
    'PhuKien', 'Cặp da màu đen',
    'Toc', 'Tóc đen, vuốt cao',
    'HinhDang', 'Vóc dáng trung bình'
), 5, 3, '2025-06-10 23:04:40', 'Quảng trường Ba Đình', 0.95);


INSERT INTO PhatHienViPham (IdCamera, ThoiGian, ViTri, IdPhuongTien, IdDanhMuc, IdAnh, TrangThai) VALUES
(1, '2025-06-10 23:00:40', 'Ngã tư Hàng Bài - Tràng Tiền', 1, 1, 13, 'Chua Xu Ly'),
(2, '2025-06-10 23:02:45', 'Khu vực Hồ Gươm', 2, 2, 1, 'Da Xu Ly'),
(3, '2025-06-10 23:04:50', 'Quảng trường Ba Đình', 3, 3, 14, 'Chua Xu Ly'),
(5, '2025-06-10 23:07:55', 'Ngã tư Thái Hà - Chùa Bộc', 4, 1, 4, 'Chua Xu Ly'),
(7, '2025-06-10 23:11:00', 'Ngã tư Đại Cồ Việt - Trần Khát Chân', 5, 4, 17, 'Huy'),
(1, '2025-06-10 23:02:15', 'Phố Đinh Tiên Hoàng', 6, 5, 5, 'Chua Xu Ly'),
(2, '2025-06-10 23:03:45', 'Khu vực Hồ Gươm', 7, 6, 16, 'Da Xu Ly'),
(3, '2025-06-10 23:05:55', 'Quảng trường Ba Đình', 8, 1, 7, 'Chua Xu Ly'),
(8, '2025-06-10 23:13:30', 'Khu vực Lăng Chủ tịch Hồ Chí Minh', 9, 2, 9, 'Da Xu Ly'),
(10, '2025-06-10 23:14:35', 'Khu vực Công viên Nước Hồ Tây', 10, 3, 15, 'Chua Xu Ly'),
(12, '2025-06-10 23:15:40', 'Khu vực Đại học Quốc Gia Hà Nội', 11, 4, 11, 'Chua Xu Ly'),
(14, '2025-06-10 23:17:45', 'Khu vực Royal City', 12, 5, 18, 'Huy'),
(16, '2025-06-10 23:20:00', 'Khu vực Aeon Mall Long Biên', 13, 6, 19, 'Da Xu Ly'),
(18, '2025-06-10 23:19:15', 'Khu vực Bến xe Giáp Bát', 14, 1, 10, 'Chua Xu Ly'),
(20, '2025-06-10 23:17:20', 'Khu vực Sân vận động Mỹ Đình', 15, 2, 20, 'Chua Xu Ly');


INSERT INTO TinhTrangGiaoThong (IdCamera, ThoiGian, MatDoGiaoThong, TocDoTrungBinh) VALUES
(1, '2025-06-10 23:00:50', 'Thong Thoang', 45.5),
(2, '2025-06-10 23:03:55', 'Dong Duc', 25.0),
(3, '2025-06-10 23:05:50', 'Un Tac', 10.2),
(5, '2025-06-10 23:09:30', 'Thong Thoang', 52.1),
(7, '2025-06-10 23:11:10', 'Dong Duc', 30.8),
(1, '2025-06-10 23:02:15', 'Dong Duc', 28.5),
(2, '2025-06-10 23:05:20', 'Thong Thoang', 38.0),
(3, '2025-06-10 23:06:25', 'Un Tac', 15.0),
(8, '2025-06-10 23:12:30', 'Thong Thoang', 40.0),
(10, '2025-06-10 23:14:35', 'Dong Duc', 22.0),
(12, '2025-06-10 23:17:40', 'Thong Thoang', 35.0),
(14, '2025-06-10 23:18:45', 'Un Tac', 8.5),
(16, '2025-06-10 23:20:50', 'Dong Duc', 20.0),
(18, '2025-06-10 23:18:55', 'Thong Thoang', 48.0),
(20, '2025-06-10 23:17:00', 'Un Tac', 12.0);