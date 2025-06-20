from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..schemas import schemas
from ..models import models
from ..database import get_db
import subprocess
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, FileResponse
import os
import cv2  # Đảm bảo được import

router = APIRouter(
    prefix="/cameras",
    tags=["Cameras"]
)

# ✅ Lấy danh sách tất cả camera
@router.get("/get", response_model=List[schemas.Camera])
def get_all_cameras(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(models.Camera).offset(skip).limit(limit).all()

# ✅ Lấy thông tin một camera theo ID
@router.get("/get/id/{camera_id}", response_model=schemas.Camera)
def get_camera_by_id(
    camera_id: int,
    db: Session = Depends(get_db)
):
    camera = db.query(models.Camera).filter(models.Camera.IdCamera == camera_id).first()
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera với ID {camera_id}"
        )
    return camera

@router.get("/get/khuvuc/{khuvuc_id}", response_model=List[schemas.Camera])
def get_cameras_by_khuvuc(
    khuvuc_id: int,
    db: Session = Depends(get_db)
):
    cameras = db.query(models.Camera).filter(models.Camera.IdKhuVuc == khuvuc_id).all()
    if not cameras:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera trong khu vực với ID {khuvuc_id}"
        )
    return cameras

@router.get("/get/ip/{ip_camera}", response_model=schemas.Camera)
def get_camera_by_ip(
    ip_camera: str,
    db: Session = Depends(get_db)
):
    camera = db.query(models.Camera).filter(models.Camera.IpCamera == ip_camera).first()
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera với địa chỉ IP {ip_camera}"
        )
    return camera

@router.get("/get/status/{status_camera}", response_model=List[schemas.Camera])
def get_cameras_by_status(
    status_camera: str,
    db: Session = Depends(get_db)
):
    # if status_camera not in ['Hoat Dong', 'Khong Hoat Dong', 'Hu Hong', 'Bao Tri']:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Trạng thái camera không hợp lệ"
    #     )
    cameras = db.query(models.Camera).filter(models.Camera.TrangThaiCamera == status_camera).all()
    if not cameras:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera với trạng thái {status_camera}"
        )
    return cameras

# ✅ Tạo mới một camera
@router.post("/post", response_model=schemas.Camera, status_code=status.HTTP_201_CREATED)
def create_camera(
    camera: schemas.CameraCreate,
    db: Session = Depends(get_db)
):
    # Kiểm tra IP đã tồn tại chưa
    existing_camera = db.query(models.Camera).filter(
        models.Camera.IpCamera == camera.IpCamera
    ).first()
    if existing_camera:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Địa chỉ IP đã tồn tại"
        )

    new_camera = models.Camera(**camera.dict())
    db.add(new_camera)
    db.commit()
    db.refresh(new_camera)
    return new_camera

# ✅ Cập nhật thông tin một camera
@router.put("/put/id/{camera_id}", response_model=schemas.Camera)
def update_camera(
    camera_id: int,
    updated_camera: schemas.CameraUpdate,
    db: Session = Depends(get_db)
):
    camera = db.query(models.Camera).filter(models.Camera.IdCamera == camera_id).first()
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera với ID {camera_id}"
        )

    # Cập nhật từng trường
    for field, value in updated_camera.dict().items():
        setattr(camera, field, value)

    db.commit()
    db.refresh(camera)
    return camera

@router.put("/put/ip/{camera_id}", response_model=schemas.Camera)
def update_camera_ip(
    camera_id: int,
    updated_camera: schemas.CameraUpdateIp,
    db: Session = Depends(get_db)
):
    camera = db.query(models.Camera).filter(models.Camera.IdCamera == camera_id).first()
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera với ID {camera_id}"
        )

    # Cập nhật từng trường
    for field, value in updated_camera.dict().items():
        setattr(camera, field, value)

    db.commit()
    db.refresh(camera)
    return camera


@router.put("/put/khuvuc/{camera_id}", response_model=schemas.Camera)
def update_camera_area(
    camera_id: int,
    updated_camera: schemas.CameraUpdateIp,
    db: Session = Depends(get_db)
):
    camera = db.query(models.Camera).filter(models.Camera.IdCamera == camera_id).first()
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera với ID {camera_id}"
        )

    # Cập nhật từng trường
    for field, value in updated_camera.dict().items():
        setattr(camera, field, value)

    db.commit()
    db.refresh(camera)
    return camera


@router.put("/put/vitri/{camera_id}", response_model=schemas.Camera)
def update_camera_location(
    camera_id: int,
    updated_camera: schemas.CameraUpdateIp,
    db: Session = Depends(get_db)
):
    camera = db.query(models.Camera).filter(models.Camera.IdCamera == camera_id).first()
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera với ID {camera_id}"
        )

    # Cập nhật từng trường
    for field, value in updated_camera.dict().items():
        setattr(camera, field, value)

    db.commit()
    db.refresh(camera)
    return camera

@router.put("/put/trangthai/{camera_id}", response_model=schemas.Camera)
def update_camera_status(
    camera_id: int,
    updated_camera: schemas.CameraUpdateIp,
    db: Session = Depends(get_db)
):
    camera = db.query(models.Camera).filter(models.Camera.IdCamera == camera_id).first()
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera với ID {camera_id}"
        )

    # Cập nhật từng trường
    for field, value in updated_camera.dict().items():
        setattr(camera, field, value)

    db.commit()
    db.refresh(camera)
    return camera

@router.put("/put/ngaylapdat/{camera_id}", response_model=schemas.Camera)
def update_camera_date_installation(
    camera_id: int,
    updated_camera: schemas.CameraUpdateIp,
    db: Session = Depends(get_db)
):
    camera = db.query(models.Camera).filter(models.Camera.IdCamera == camera_id).first()
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera với ID {camera_id}"
        )

    # Cập nhật từng trường
    for field, value in updated_camera.dict().items():
        setattr(camera, field, value)

    db.commit()
    db.refresh(camera)
    return camera


@router.put("/put/baotri/{camera_id}", response_model=schemas.Camera)
def update_camera_maintenance(
    camera_id: int,
    updated_camera: schemas.CameraUpdateIp,
    db: Session = Depends(get_db)
):
    camera = db.query(models.Camera).filter(models.Camera.IdCamera == camera_id).first()
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera với ID {camera_id}"
        )

    # Cập nhật từng trường
    for field, value in updated_camera.dict().items():
        setattr(camera, field, value)

    db.commit()
    db.refresh(camera)
    return camera


# ✅ Xoá một camera
@router.delete("/delete/id/{camera_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_camera_by_id(
    camera_id: int,
    db: Session = Depends(get_db)
):
    camera = db.query(models.Camera).filter(models.Camera.IdCamera == camera_id).first()
    if not camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy camera với ID {camera_id}"
        )

    db.delete(camera)
    db.commit()

