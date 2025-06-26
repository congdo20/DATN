import time
import random
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import models

TRAFFIC_DENSITIES = ['Thong Thoang', 'Dong Duc', 'Un Tac']

def get_active_camera_ids(db: Session):
    cameras = db.query(models.Camera).filter(models.Camera.TrangThaiCamera == 'Hoat Dong').all()
    return [cam.IdCamera for cam in cameras]

def generate_speed(mat_do):
    if mat_do == 'Thong Thoang':
        return round(random.uniform(35, 60), 2)
    elif mat_do == 'Dong Duc':
        return round(random.uniform(15, 35), 2)
    else:
        return round(random.uniform(5, 15), 2)

def add_random_traffic_status():
    db = SessionLocal()
    try:
        camera_ids = get_active_camera_ids(db)
        if not camera_ids:
            print("Không có camera hoạt động để thêm dữ liệu.")
            return
        for cam_id in camera_ids:
            mat_do = random.choice(TRAFFIC_DENSITIES)
            toc_do = generate_speed(mat_do)
            now = datetime.now()
            traffic = models.TinhTrangGiaoThong(
                IdCamera=cam_id,
                ThoiGian=now,
                MatDoGiaoThong=mat_do,
                TocDoTrungBinh=toc_do
            )
            db.add(traffic)
        db.commit()
        print(f"Đã thêm dữ liệu tình trạng giao thông cho {len(camera_ids)} camera lúc {datetime.now()}.")
    except Exception as e:
        db.rollback()
        print(f"Lỗi khi thêm dữ liệu: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    while True:
        add_random_traffic_status()
        time.sleep(300)