import json
import pymysql
import os
import random

# Cấu hình
IMAGE_BASE_DIR = "app/images/images"  # Đường dẫn thực tế trên đĩa (nơi chứa ảnh)
JSON_FILE = "app/images/vn3k.json"    # File mô tả

# Kết nối cơ sở dữ liệu
conn = pymysql.connect(
    host="localhost",
    user="root",
    password="Do200102",  # ← Thay bằng mật khẩu của bạn
    database="SMARTCITY1",
    charset="utf8mb4"
)
cursor = conn.cursor()

# Đọc file JSON
try:
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"❌ Không tìm thấy file JSON tại: {JSON_FILE}")
    exit()

added = 0
skipped = 0
errors = 0

for item in data:
    try:
        file_path = item["file_path"]

        # `file_path` là đường dẫn tương đối trong thư mục ảnh chính (ví dụ: "DANgoc_01/02991_2.jpg")
        # Đường dẫn để lưu vào CSDL, có dạng: /images/images/DANgoc_01/02991_2.jpg
        db_path = os.path.join("/images/images", file_path)

        # Đường dẫn đầy đủ trên đĩa để kiểm tra file tồn tại
        # Ví dụ: app/images/images/DANgoc_01/02991_2.jpg
        full_path = os.path.join(IMAGE_BASE_DIR, file_path)

        if not os.path.exists(full_path):
            print(f"❌ Ảnh không tồn tại trên đĩa: {full_path}")
            errors += 1
            continue

        # Kiểm tra ảnh đã tồn tại trong DB chưa
        cursor.execute("SELECT IdAnh FROM Anh WHERE DuongDan = %s", (db_path,))
        exists = cursor.fetchone()
        if exists:
            print(f"⚠️ Ảnh đã tồn tại trong DB, bỏ qua: {db_path}")
            skipped += 1
            continue

        # Gán camera ngẫu nhiên từ 1 đến 41
        camera_id = random.randint(1, 41)

        # Lấy vị trí lắp đặt của camera từ DB
        cursor.execute("SELECT ViTriLapDat FROM Camera WHERE IdCamera = %s", (camera_id,))
        result = cursor.fetchone()
        camera_location = result[0] if result and result[0] else "Vị trí không xác định"

        # Kích thước file KB
        kich_thuoc = os.path.getsize(full_path) / 1024

        # Thêm vào bảng `Anh`
        cursor.execute("""
            INSERT INTO Anh (IdCamera, DuongDan, KichThuoc)
            VALUES (%s, %s, %s)
        """, (camera_id, db_path, kich_thuoc))
        anh_id = cursor.lastrowid

        # JSON đặc trưng
        dac_trung = {
            "dataset_person_id": item.get("id"),
            "captions": item["captions"]
        }

        # Thêm vào bảng `NhanDangNguoi`
        cursor.execute("""
            INSERT INTO NhanDangNguoi (
                DacTrung, IdAnh, IdCamera, ViTri, DoTinCay
            )
            VALUES (%s, %s, %s, %s, %s)
        """, (
            json.dumps(dac_trung, ensure_ascii=False),
            anh_id,
            camera_id,
            camera_location,
            1.0
        ))
        added += 1
        print(f"✅ Đã thêm ảnh: {db_path} (Camera: {camera_id}, Vị trí: {camera_location})")

    except Exception as e:
        print(f"❗ Lỗi với ảnh {item.get('file_path', 'unknown')}: {e}")
        errors += 1

# Lưu thay đổi
conn.commit()
cursor.close()
conn.close()

# Tổng kết
print("\n--- TỔNG KẾT ---")
print(f"✅ Đã thêm mới: {added} ảnh")
print(f"⏭️ Bỏ qua: {skipped} ảnh (đã tồn tại)")
print(f"❌ Lỗi: {errors} ảnh") 