from app.api.detection import detect_persons
from app.api.detection import detect_vehicles
import os
from fastapi import FastAPI
# from app.api import cameras, users, violations
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="SMARTCITY Traffic API")



origins = [
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",
    "http://0.0.0.0:3000",
    # Thêm nếu cần
]


app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,   # hoặc ["*"] cho phép tất cả domain (chỉ dev)
    allow_origins=["*"],  # Cho phép tất cả domain (chỉ dùng trong môi trường phát triển)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from fastapi.staticfiles import StaticFiles
images_dir = os.path.join(os.path.dirname(__file__), "images")
videos_dir = os.path.join(os.path.dirname(__file__), "videos")

app.mount("/images", StaticFiles(directory=images_dir), name="images")
app.mount("/videos", StaticFiles(directory=videos_dir), name="videos")


from app.api import (
    analytics, areas, cameras,
    reports, traffic,
    users, vehicles, violations
)
# Đăng ký các router
app.include_router(cameras.router)
app.include_router(users.router)
app.include_router(violations.router)
app.include_router(detect_vehicles.router)
# app.include_router(accounts.router)
# app.include_router(analytics.router)
app.include_router(areas.router)
# app.include_router(auth.router)
# app.include_router(detections.router)
# app.include_router(images.router)
# app.include_router(people.router)
app.include_router(detect_persons.router)
app.include_router(vehicles.router)
# app.include_router(recognitions.router)
# app.include_router(reports.router)
# app.include_router(system.router)
app.include_router(traffic.router)


