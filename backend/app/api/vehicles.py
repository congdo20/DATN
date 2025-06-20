from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app.models import models
from app.schemas import schemas
from datetime import datetime

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"]
)

# Dependency để lấy session database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/get", response_model=List[schemas.PhuongTien], response_model_exclude_none=True)
def get_all_vehicles(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(models.PhuongTien).offset(skip).limit(limit).all()

@router.get("/get/id/{vehicle_id}", response_model=schemas.PhuongTien)
def get_vehicle_by_id(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(models.PhuongTien).filter(models.PhuongTien.IdPhuongTien == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện")
    return vehicle

@router.get("/get/plate/{vehicle_plate}", response_model=schemas.PhuongTien)
def get_vehicle_by_plate(vehicle_plate: str, db: Session = Depends(get_db)):
    vehicle = db.query(models.PhuongTien).filter(models.PhuongTien.BienSo == vehicle_plate).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện")
    return vehicle
@router.get("/get/owner/{owner_name}", response_model=List[schemas.PhuongTien])
def get_vehicles_by_owner(owner_name: str, db: Session = Depends(get_db)):
    vehicles = db.query(models.PhuongTien).filter(models.PhuongTien.ChuSoHuu == owner_name).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện của chủ sở hữu này")
    return vehicles
@router.get("/get/type/{vehicle_type}", response_model=List[schemas.PhuongTien])
def get_vehicles_by_type(vehicle_type: str, db: Session = Depends(get_db)):
    vehicles = db.query(models.PhuongTien).filter(models.PhuongTien.KieuXe == vehicle_type).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện của loại này")
    return vehicles
@router.get("/get/color/{vehicle_color}", response_model=List[schemas.PhuongTien])
def get_vehicles_by_color(vehicle_color: str, db: Session = Depends(get_db)):
    vehicles = db.query(models.PhuongTien).filter(models.PhuongTien.MauSac == vehicle_color).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện của màu này")
    return vehicles

@router.post("/post", response_model=schemas.PhuongTien, status_code=status.HTTP_201_CREATED)
def create_vehicle(vehicle: schemas.PhuongTienCreate, db: Session = Depends(get_db)):
    new_vehicle = models.PhuongTien(
        **vehicle.dict()
    )
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return new_vehicle

@router.put("/put/id/{vehicle_id}", response_model=schemas.PhuongTien)
def update_vehicle_by_id(vehicle_id: int, update_data: schemas.PhuongTienUpdate, db: Session = Depends(get_db)):
    vehicle = db.query(models.PhuongTien).filter(models.PhuongTien.IdPhuongTien == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện")
    
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(vehicle, key, value)

    vehicle.updated_at = datetime.now()
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.put("_put/owner/{owner_name}", response_model=List[schemas.PhuongTien])
def update_vehicle_owner(owner_name: str, update_data: schemas.PhuongTienUpdateChuSoHuu, db: Session = Depends(get_db)):
    vehicles = db.query(models.PhuongTien).filter(models.PhuongTien.ChuSoHuu == owner_name).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện của chủ sở hữu này")
    
    for vehicle in vehicles:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(vehicle, key, value)
        vehicle.updated_at = datetime.now()

    db.commit()
    return vehicles

@router.put("/put/plate/{vehicle_plate}", response_model=schemas.PhuongTien)
def update_vehicle_plate(vehicle_plate: str, update_data: schemas.PhuongTienUpdateBienSo, db: Session = Depends(get_db)):
    vehicle = db.query(models.PhuongTien).filter(models.PhuongTien.BienSo == vehicle_plate).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện")
    
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(vehicle, key, value)

    vehicle.updated_at = datetime.now()
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.delete("/delete/id/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle_by_id(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(models.PhuongTien).filter(models.PhuongTien.IdPhuongTien == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện")
    
    db.delete(vehicle)
    db.commit()
    return None

@router.delete("/delete/plate/{vehicle_plate}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle_by_plate(vehicle_plate: str, db: Session = Depends(get_db)):
    vehicle = db.query(models.PhuongTien).filter(models.PhuongTien.BienSo == vehicle_plate).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Không tìm thấy phương tiện")
    
    db.delete(vehicle)
    db.commit()
    return None
