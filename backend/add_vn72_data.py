import json
import pymysql
import os
import random

# Cấu hình
IMAGE_BASE_DIR = "app/images/images"  # Đường dẫn thực tế trên đĩa (nơi chứa ảnh)
JSON_FILE = "app/images/vn72.json"    # File mô tả
# JSON_FILE = "app/images/vn3k.json"    # File mô tả

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

        # Chuẩn hóa đường dẫn để lưu vào DB có dạng: /images/images/...
        if "TRAINNING_DATA/" in file_path:
            sub_path = file_path[file_path.index("TRAINNING_DATA/"):]
            rel_path = os.path.join("/images/images", sub_path)
        elif "TEST_DATA/" in file_path:
            sub_path = file_path[file_path.index("TEST_DATA/"):]
            rel_path = os.path.join("/images/images", sub_path)
        else:
            print(f"⚠️ Đường dẫn không hợp lệ: {file_path}")
            errors += 1
            continue

        # Đường dẫn trên đĩa
        full_path = os.path.join(IMAGE_BASE_DIR, sub_path)

        if not os.path.exists(full_path):
            print(f"❌ Ảnh không tồn tại trên đĩa: {full_path}")
            errors += 1
            continue

        # Kiểm tra ảnh đã tồn tại trong DB chưa
        cursor.execute("SELECT IdAnh FROM Anh WHERE DuongDan = %s", (rel_path,))
        exists = cursor.fetchone()
        if exists:
            print(f"⚠️ Ảnh đã tồn tại trong DB, bỏ qua: {rel_path}")
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
        """, (camera_id, rel_path, kich_thuoc))
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
        print(f"✅ Đã thêm ảnh: {rel_path} (Camera: {camera_id}, Vị trí: {camera_location})")

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
















# import json
# import pymysql
# import os
# import random

# # Cấu hình
# IMAGE_BASE_DIR = "app/images/images"  # Đường dẫn tương đối từ vị trí chạy script
# JSON_FILE = "app/images/vn72.json"    # Đường dẫn tương đối từ vị trí chạy script
    
# conn = pymysql.connect(
#     host="localhost",
#     user="root",
#     password="Do200102",  # ← Thay bằng mật khẩu của bạn
#     database="SMARTCITY1",
#     charset="utf8mb4"
# )
# cursor = conn.cursor()

# # Đọc file JSON
# try:
#     with open(JSON_FILE, "r", encoding="utf-8") as f:
#         data = json.load(f)
# except FileNotFoundError:
#     print(f"❌ Không tìm thấy file JSON tại: {JSON_FILE}")
#     exit()

# added = 0
# skipped = 0
# errors = 0

# for item in data:
#     try:
#         file_path = item["file_path"]
        
#         # Đảm bảo chỉ lấy phần đường dẫn sau /images/images/
#         if "TRAINNING_DATA/" in file_path:
#             rel_path = file_path[file_path.index("TRAINNING_DATA/"):]
#         elif "TEST_DATA/" in file_path:
#             rel_path = file_path[file_path.index("TEST_DATA/"):]
#         else:
#             rel_path = file_path  # fallback nếu không khớp
        
#         full_path = os.path.join(IMAGE_BASE_DIR, rel_path)

#         if not os.path.exists(full_path):
#             print(f"❌ Ảnh không tồn tại trên đĩa: {full_path}")
#             errors += 1
#             continue

#         # Kiểm tra ảnh đã tồn tại trong DB chưa
#         cursor.execute("SELECT IdAnh FROM Anh WHERE DuongDan = %s", (rel_path,))
#         exists = cursor.fetchone()
#         if exists:
#             print(f"⚠️ Ảnh đã tồn tại trong DB, bỏ qua: {rel_path}")
#             skipped += 1
#             continue

#         # Gán camera ngẫu nhiên từ 1 đến 41
#         camera_id = random.randint(1, 41)

#         # Lấy vị trí lắp đặt của camera từ DB
#         cursor.execute("SELECT ViTriLapDat FROM Camera WHERE IdCamera = %s", (camera_id,))
#         result = cursor.fetchone()
#         camera_location = result[0] if result and result[0] else "Vị trí không xác định"

#         # Tính kích thước file (KB)
#         kich_thuoc = os.path.getsize(full_path) / 1024

#         # Thêm ảnh vào bảng `Anh`
#         cursor.execute("""
#             INSERT INTO Anh (IdCamera, DuongDan, KichThuoc)
#             VALUES (%s, %s, %s)
#         """, (camera_id, rel_path, kich_thuoc))
#         anh_id = cursor.lastrowid

#         # Đặc trưng: lưu cả dataset_person_id và captions dưới dạng JSON
#         dac_trung = {
#             "dataset_person_id": item.get("id"),
#             "captions": item["captions"]
#         }

#         # Thêm vào bảng `NhanDangNguoi` với vị trí từ camera
#         cursor.execute("""
#             INSERT INTO NhanDangNguoi (
#                 DacTrung, IdAnh, IdCamera, ViTri, DoTinCay
#             )
#             VALUES (%s, %s, %s, %s, %s)
#         """, (
#             json.dumps(dac_trung, ensure_ascii=False),
#             anh_id,
#             camera_id,
#             camera_location,  # <-- Cập nhật vị trí tại đây
#             1.0
#         ))
#         added += 1
#         print(f"✅ Đã thêm ảnh: {rel_path} (Camera: {camera_id}, Vị trí: {camera_location})")

#     except Exception as e:
#         print(f"❗ Lỗi với ảnh {item.get('file_path', 'unknown')}: {e}")
#         errors += 1

# # Lưu thay đổi
# conn.commit()

# # --- XÓA DỮ LIỆU ĐÃ THÊM (NẾU CẦN) ---
# def delete_vn72_data():
#     try:
#         confirm = input("Bạn có chắc chắn muốn xoá tất cả ảnh và nhận dạng người vừa thêm? (yes/no): ")
#         if confirm.strip().lower() != 'yes':
#             print("❌ Đã huỷ thao tác xoá.")
#             return

#         # Dùng ViTri LIKE '%Dataset VN72%' hoặc một đặc điểm chung nếu có
#         # Cách an toàn hơn là lưu ID các ảnh đã thêm vào list rồi xoá theo ID
#         print("Tiến hành xoá dữ liệu...")
        
#         # Xoá trước ở NhanDangNguoi
#         # Điều kiện xoá cần chính xác, ở đây ví dụ xoá tất cả những gì từ dataset
#         cursor.execute("DELETE FROM NhanDangNguoi WHERE ViTri IS NOT NULL AND IdNhanDangNguoi > 0") # Thay đổi điều kiện này cho phù hợp
        
#         # Sau đó xoá ở Anh
#         # Xóa các ảnh không còn được tham chiếu trong NhanDangNguoi hoặc các bảng khác
#         cursor.execute("""
#             DELETE FROM Anh 
#             WHERE IdAnh NOT IN (SELECT IdAnh FROM NhanDangNguoi)
#               AND IdAnh NOT IN (SELECT IdAnh FROM PhatHienViPham)
#               AND (DuongDan LIKE %s OR DuongDan LIKE %s)
#         """, ("%TRAINNING_DATA%", "%TEST_DATA%"))

#         conn.commit()
#         print("✅ Đã xoá xong dữ liệu.")
#     except Exception as e:
#         print(f"Lỗi khi xoá dữ liệu: {e}")

# # Bỏ comment dòng dưới để chạy chức năng xoá
# # delete_vn72_data()

# # Đóng kết nối
# cursor.close()
# conn.close()

# print("\n--- TỔNG KẾT ---")
# print(f"✅ Đã thêm mới: {added} ảnh")
# print(f"⏭️ Bỏ qua: {skipped} ảnh (đã tồn tại)")
# print(f"❌ Lỗi: {errors} ảnh")



