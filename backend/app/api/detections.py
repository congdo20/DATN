from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import SessionLocal
from app.models import models
from app.schemas import schemas
from datetime import datetime

router = APIRouter(
    prefix="/detections",
    tags=["Detections"]
)

# Dependency để lấy session database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.PhatHienViPham], response_model_exclude_none=True)
def get_all_detect_violations(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(models.PhatHienViPham).offset(skip).limit(limit).all()


@router.get("/filter", response_model=List[schemas.PhatHienViPham])
def filter_detect_violations(
    fromDate: Optional[datetime] = Query(None),
    toDate: Optional[datetime] = Query(None),
    licensePlate: Optional[str] = Query(None),
    cameraName: Optional[str] = Query(None),
    vehicleType: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    # Khởi tạo query
    query = db.query(models.PhatHienViPham)

    # Join đến ViPham và PhuongTien nếu cần filter theo biển số hoặc loại phương tiện
    if licensePlate or vehicleType:
        query = query \
            .join(models.ViPham, models.PhatHienViPham.IdViPham == models.ViPham.IdViPham) \
            .join(models.PhuongTien, models.ViPham.IdPhuongTien == models.PhuongTien.IdPhuongTien)
    if cameraName:
        query = query.join(models.Camera, models.PhatHienViPham.IdCamera == models.Camera.IdCamera)
    # Các điều kiện lọc
    if fromDate:
        query = query.filter(models.PhatHienViPham.ThoiGian >= fromDate)
    if toDate:
        query = query.filter(models.PhatHienViPham.ThoiGian <= toDate)
    if licensePlate:
        query = query.filter(models.PhuongTien.BienSo.ilike(f"%{licensePlate}%"))
    if cameraName:
        query = query.filter(models.Camera.ViTriLapDat == cameraName)
    if vehicleType:
        query = query.filter(models.PhuongTien.KieuXe.ilike(f"%{vehicleType}%"))

    return query.all()



@router.get("/{detect_violation_id}", response_model=schemas.PhatHienViPham)
def get_detect_violation(detect_violation_id: int, db: Session = Depends(get_db)):
    detect_violation = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.IdPhatHien == detect_violation_id).first()
    if not detect_violation:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm")
    return detect_violation

@router.post("/", response_model=schemas.PhatHienViPham, status_code=status.HTTP_201_CREATED)
def create_detect_violation(detect_violation: schemas.PhatHienViPhamCreate, db: Session = Depends(get_db)):
    new_detect_violation = models.PhatHienViPham(
        **detect_violation.dict()
    )
    db.add(new_detect_violation)
    db.commit()
    db.refresh(new_detect_violation)
    return new_detect_violation

@router.put("/{detect_violation_id}", response_model=schemas.PhatHienViPham)
def update_violation(detect_violation_id: int, update_data: schemas.PhatHienViPhamUpdate, db: Session = Depends(get_db)):
    detect_violation = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.IdPhatHien == detect_violation_id).first()
    if not detect_violation:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm")
    
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(detect_violation, key, value)

    detect_violation.updated_at = datetime.now()
    db.commit()
    db.refresh(detect_violation)
    return detect_violation

@router.delete("/{detect_violation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_violation(detect_violation_id: int, db: Session = Depends(get_db)):
    detect_violation = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.IdPhatHien == detect_violation_id).first()
    if not detect_violation:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm")
    
    db.delete(detect_violation)
    db.commit()
    return None
