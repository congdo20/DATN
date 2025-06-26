import os
import pymysql

# Cấu hình
VIDEO_DIR = "/Users/trinhdo/Code/HTML/DATN/backend/app/videos/video"
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "Do200102",  # Thay bằng mật khẩu thật
    "database": "SMARTCITY1",
    "charset": "utf8mb4"
}
BASE_URL = "127.0.0.1:8000/videos/video"
START_CAMERA_ID = 8

# Kết nối DB
conn = pymysql.connect(**DB_CONFIG)
cursor = conn.cursor()

# Lấy danh sách video
video_files = [f for f in os.listdir(VIDEO_DIR) if f.lower().endswith(('.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv'))]
video_files.sort()  # Sắp xếp để gán lần lượt

# Lấy danh sách IdCamera >= 8, số lượng bằng số video
cursor.execute("SELECT IdCamera FROM Camera WHERE IdCamera >= %s ORDER BY IdCamera ASC LIMIT %s", (START_CAMERA_ID, len(video_files)))
camera_ids = [row[0] for row in cursor.fetchall()]

# Gán từng video cho từng camera
for cam_id, video in zip(camera_ids, video_files):
    video_url = f"{BASE_URL}/{video}"
    cursor.execute(
        "UPDATE Camera SET IpCamera = %s WHERE IdCamera = %s",
        (video_url, cam_id)
    )
    print(f"Đã gán {video_url} cho camera IdCamera={cam_id}")

conn.commit()
cursor.close()
conn.close()
print("Hoàn thành cập nhật IpCamera cho các camera.")