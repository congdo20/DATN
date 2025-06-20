from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import SessionLocal
from app.models import models
from app.schemas import schemas
from datetime import datetime
from sqlalchemy import or_, func

router = APIRouter(
    prefix="/detect_vehicles",
    tags=["DetectVehicles"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/get", response_model=List[schemas.NhanDangPhuongTien], response_model_exclude_none=True)
def get_all_vehicles(
    skip: int = 0,
    limit: int = 20,
    plate: Optional[str] = Query(None, description="Lọc theo biển số"),
    from_time: Optional[datetime] = Query(None, description="Từ thời gian"),
    to_time: Optional[datetime] = Query(None, description="Đến thời gian"),
    db: Session = Depends(get_db)
):
    query = db.query(models.NhanDangPhuongTien).options(
        joinedload(models.NhanDangPhuongTien.phuongtien),
        joinedload(models.NhanDangPhuongTien.camera),
        joinedload(models.NhanDangPhuongTien.anh)
    )
    if plate:
        query = query.join(models.PhuongTien).filter(models.PhuongTien.BienSo == plate)
    if from_time:
        query = query.filter(models.NhanDangPhuongTien.ThoiGian >= from_time)
    if to_time:
        query = query.filter(models.NhanDangPhuongTien.ThoiGian <= to_time)
    return query.offset(skip).limit(limit).all()

@router.get("/get/id/{detect_vehicle_id}", response_model=schemas.NhanDangPhuongTien)
def get_vehicle(detect_vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(models.NhanDangPhuongTien).filter(models.NhanDangPhuongTien.IdNhanDangPhuongTien == detect_vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện")
    return vehicle

@router.get("/get/plate/{vehicle_plate}", response_model=List[schemas.NhanDangPhuongTien])
def get_vehicle_by_plate(vehicle_plate: str, db: Session = Depends(get_db)):
    # Tìm phương tiện theo biển số
    phuongtien = db.query(models.PhuongTien).filter(models.PhuongTien.BienSo == vehicle_plate).first()
    if not phuongtien:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện với biển số này")
    # Lấy tất cả nhận dạng phương tiện theo IdPhuongTien
    vehicles = db.query(models.NhanDangPhuongTien).filter(models.NhanDangPhuongTien.IdPhuongTien == phuongtien.IdPhuongTien).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhận dạng phương tiện với biển số này")
    return vehicles

@router.get("/get/vehicle/{vehicle_id}", response_model=List[schemas.NhanDangPhuongTien])
def get_vehicle_by_vehicle_id(vehicle_id: int, db: Session = Depends(get_db)):
    vehicles = db.query(models.NhanDangPhuongTien).filter(models.NhanDangPhuongTien.IdPhuongTien == vehicle_id).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện với Id này")
    return vehicles

@router.get("/get/camera/{camera_id}", response_model=List[schemas.NhanDangPhuongTien])
def get_vehicle_by_camera(camera_id: int, db: Session = Depends(get_db)):
    vehicles = db.query(models.NhanDangPhuongTien).filter(models.NhanDangPhuongTien.IdCamera == camera_id).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện với camera này")
    return vehicles

@router.get("/get/image/{image_id}", response_model=List[schemas.NhanDangPhuongTien])
def get_vehicle_by_image(image_id: int, db: Session = Depends(get_db)):
    vehicles = db.query(models.NhanDangPhuongTien).filter(models.NhanDangPhuongTien.IdAnh == image_id).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện với ảnh này")
    return vehicles

@router.get("/get/location/{location}", response_model=List[schemas.NhanDangPhuongTien])
def get_vehicle_by_location(location: str, db: Session = Depends(get_db)):
    vehicles = db.query(models.NhanDangPhuongTien).filter(models.NhanDangPhuongTien.ViTri.like(f"%{location}%")).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện ở vị trí này")
    return vehicles

@router.post("/post", response_model=schemas.NhanDangPhuongTien, status_code=status.HTTP_201_CREATED)
def create_vehicle(vehicle: schemas.NhanDangPhuongTienCreate, db: Session = Depends(get_db)):
    new_vehicle = models.NhanDangPhuongTien(
        **vehicle.dict()
    )
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return new_vehicle

# @router.put("/put/{vehicle_id}", response_model=schemas.NhanDangPhuongTien)
# def update_vehicle(vehicle_id: int, update_data: schemas.NhanDangPhuongTienUpdate, db: Session = Depends(get_db)):
#     vehicle = db.query(models.NhanDangPhuongTien).filter(models.NhanDangPhuongTien.IdNhanDangPhuongTien == vehicle_id).first()
#     if not vehicle:
#         raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện")
#     for key, value in update_data.dict(exclude_unset=True).items():
#         setattr(vehicle, key, value)
#     db.commit()
#     db.refresh(vehicle)
#     return vehicle


@router.put("/put/{vehicle_id}", response_model=schemas.NhanDangPhuongTien)
def update_do_tin_cay(vehicle_id: int, update_data: schemas.DoTinCayUpdate, db: Session = Depends(get_db)):
    vehicle = db.query(models.NhanDangPhuongTien).filter(
        models.NhanDangPhuongTien.IdNhanDangPhuongTien == vehicle_id
    ).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện")
    vehicle.DoTinCay = update_data.DoTinCay
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.put("/put/image/{image_id}", response_model=List[schemas.NhanDangPhuongTien])
def update_vehicle_by_image(image_id: int, update_data: schemas.NhanDangPhuongTienUpdate, db: Session = Depends(get_db)):
    vehicles = db.query(models.NhanDangPhuongTien).filter(models.NhanDangPhuongTien.IdAnh == image_id).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện với ảnh này")
    for vehicle in vehicles:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(vehicle, key, value)
    db.commit()
    return vehicles

@router.put("/put/location/{location}", response_model=List[schemas.NhanDangPhuongTien])
def update_vehicle_by_location(location: str, update_data: schemas.NhanDangPhuongTienUpdate, db: Session = Depends(get_db)):
    vehicles = db.query(models.NhanDangPhuongTien).filter(models.NhanDangPhuongTien.ViTri.like(f"%{location}%")).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện ở vị trí này")
    for vehicle in vehicles:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(vehicle, key, value)
    db.commit()
    return vehicles

@router.put("/put/camera/{camera_id}", response_model=List[schemas.NhanDangPhuongTien])
def update_vehicle_by_camera(camera_id: int, update_data: schemas.NhanDangPhuongTienUpdate, db: Session = Depends(get_db)):
    vehicles = db.query(models.NhanDangPhuongTien).filter(models.NhanDangPhuongTien.IdCamera == camera_id).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện với camera này")
    for vehicle in vehicles:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(vehicle, key, value)
    db.commit()
    return vehicles

@router.delete("/delete/id/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(models.NhanDangPhuongTien).filter(models.NhanDangPhuongTien.IdNhanDangPhuongTien == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện")
    db.delete(vehicle)
    db.commit()
    return None