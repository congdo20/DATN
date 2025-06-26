from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import SessionLocal
from app.models import models
from app.schemas import schemas
from datetime import datetime

router = APIRouter(
    prefix="/violations",
    tags=["Violations"]
)

# Dependency để lấy session database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/get", response_model=List[schemas.PhatHienViPham], response_model_exclude_none=True)
def get_all_violations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.PhatHienViPham).offset(skip).limit(limit).all()

@router.get("/get/id/{violation_id}", response_model=schemas.PhatHienViPham)
def get_violation_by_id(violation_id: int, db: Session = Depends(get_db)):
    violation = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.IdPhatHien == violation_id).first()
    if not violation:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm")
    return violation

@router.get("/get/camera/{camera_id}", response_model=List[schemas.PhatHienViPham], response_model_exclude_none=True)
def get_violations_by_camera(camera_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    violations = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.IdCamera == camera_id).offset(skip).limit(limit).all()
    if not violations:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm cho camera này")
    return violations

@router.get("/get/vehicle/{vehicle_id}", response_model=List[schemas.PhatHienViPham], response_model_exclude_none=True)
def get_violations_by_vehicle(vehicle_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    violations = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.IdPhuongTien == vehicle_id).offset(skip).limit(limit).all()
    if not violations:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm cho phương tiện này")
    return violations

@router.get("/get/type/{violation_type}", response_model=List[schemas.PhatHienViPham], response_model_exclude_none=True)
def get_violations_by_type(
    violation_type: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    violations = (
        db.query(models.PhatHienViPham)
        .join(models.DanhMucViPham, models.PhatHienViPham.IdDanhMuc == models.DanhMucViPham.IdDanhMuc)
        .filter(models.DanhMucViPham.LoaiViPham == violation_type)
        .offset(skip)
        .limit(limit)
        .all()
    )

    if not violations:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm với loại đã chọn")

    return violations

#get violation in time range
@router.get("/get/time-range", response_model=List[schemas.PhatHienViPham], response_model_exclude_none=True)
def get_violations_by_time_range(
    fromDate: Optional[datetime] = Query(None),
    toDate: Optional[datetime] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(models.PhatHienViPham)
    
    if fromDate:
        query = query.filter(models.PhatHienViPham.ThoiGian >= fromDate)
    if toDate:
        query = query.filter(models.PhatHienViPham.ThoiGian <= toDate)

    return query.offset(skip).limit(limit).all()



# @router.get("/get/time/{fromDate}/{toDate}", response_model=List[schemas.PhatHienViPham], response_model_exclude_none=True)
# def get_violations_by_time_range(
#     fromDate: datetime = Path(..., description="Ngày bắt đầu (ISO 8601)"),
#     toDate: datetime = Path(..., description="Ngày kết thúc (ISO 8601)"),
#     skip: int = 0,
#     limit: int = 10,
#     db: Session = Depends(get_db)
# ):
#     if fromDate > toDate:
#         raise HTTPException(status_code=400, detail="fromDate phải nhỏ hơn hoặc bằng toDate")

#     query = (
#         db.query(models.PhatHienViPham)
#         .filter(models.PhatHienViPham.ThoiGian >= fromDate)
#         .filter(models.PhatHienViPham.ThoiGian <= toDate)
#         .offset(skip)
#         .limit(limit)
#     )

#     return query.all()
#http://localhost:8000/get/time/2024-06-01T00:00:00/2024-06-09T23:59:59?skip=0&limit=10

@router.get("/get/location/{location}", response_model=List[schemas.PhatHienViPham], response_model_exclude_none=True)
def get_violations_by_location(
    location: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    violations = (
        db.query(models.PhatHienViPham)
        .join(models.Camera, models.PhatHienViPham.IdCamera == models.Camera.IdCamera)
        .filter(models.Camera.ViTriLapDat.ilike(f"%{location}%"))
        .offset(skip)
        .limit(limit)
        .all()
    )

    if not violations:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm tại vị trí đã chọn")

    return violations

@router.get("/get/status/{status}", response_model=List[schemas.PhatHienViPham], response_model_exclude_none=True)
def get_violations_by_status(
    status: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    violations = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.TrangThai == status).offset(skip).limit(limit).all()
    
    if not violations:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm với trạng thái đã chọn")
    
    return violations



@router.get("/get/filter", response_model=List[schemas.PhatHienViPham])
# @router.get("/filter", response_model=List[schemas.PhatHienViPham])
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
            .join(models.PhuongTien, models.PhatHienViPham.IdPhuongTien == models.PhuongTien.IdPhuongTien)
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


@router.post("/post", response_model=schemas.PhatHienViPham, status_code=status.HTTP_201_CREATED)
def create_violation(violation: schemas.PhatHienViPhamCreate, db: Session = Depends(get_db)):
    new_violation = models.PhatHienViPham(
        **violation.dict()
    )
    db.add(new_violation)
    db.commit()
    db.refresh(new_violation)
    return new_violation

@router.put("/put/id/{violation_id}", response_model=schemas.PhatHienViPham)
def update_violation_by_id(violation_id: int, update_data: schemas.PhatHienViPhamUpdate, db: Session = Depends(get_db)):
    violation = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.IdPhatHienViPham == violation_id).first()
    if not violation:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm")
    
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(violation, key, value)

    violation.updated_at = datetime.now()
    db.commit()
    db.refresh(violation)
    return violation

@router.put("/put/camera/{camera_id}", response_model=List[schemas.PhatHienViPham])
def update_violations_camera(camera_id: int, update_data: schemas.PhatHienViPhamUpdate, db: Session = Depends(get_db)):
    violations = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.IdCamera == camera_id).all()
    if not violations:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm cho camera này")
    
    for violation in violations:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(violation, key, value)
        violation.updated_at = datetime.now()

    db.commit()
    return violations

@router.put("/put/vehicle/{vehicle_id}", response_model=List[schemas.PhatHienViPham])
def update_violations_vehicle(vehicle_id: int, update_data: schemas.PhatHienViPhamUpdate, db: Session = Depends(get_db)):
    violations = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.IdPhuongTien == vehicle_id).all()
    if not violations:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm cho phương tiện này")
    
    for violation in violations:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(violation, key, value)
        violation.updated_at = datetime.now()

    db.commit()
    return violations

@router.put("/put/type/{violation_id}", response_model=List[schemas.PhatHienViPham])
def update_violations_type(violation_id: int, update_data: schemas.PhatHienViPhamUpdate, db: Session = Depends(get_db)):
    violations = (
        db.query(models.PhatHienViPham)
        .join(models.DanhMucViPham, models.PhatHienViPham.IdDanhMuc == models.DanhMucViPham.IdDanhMuc)
        .filter(models.DanhMucViPham.IdDanhMuc == violation_id)
        .all()
    )
    
    if not violations:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm với loại đã chọn")
    
    for violation in violations:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(violation, key, value)
        violation.updated_at = datetime.now()

    db.commit()
    return violations

@router.put("/put/image/{image_id}", response_model=List[schemas.PhatHienViPham])
def update_violations_image(image_id: int, update_data: schemas.PhatHienViPhamUpdate, db: Session = Depends(get_db)):
    violations = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.HinhAnh == image_id).all()
    
    if not violations:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm với hình ảnh đã chọn")
    
    for violation in violations:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(violation, key, value)
        violation.updated_at = datetime.now()

    db.commit()
    return violations

@router.put("/put/time/{time}", response_model=List[schemas.PhatHienViPham])
def update_violations_time(time: datetime, update_data: schemas.PhatHienViPhamUpdate, db: Session = Depends(get_db)):
    violations = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.ThoiGian == time).all()
    
    if not violations:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm với thời gian đã chọn")
    
    for violation in violations:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(violation, key, value)
        violation.updated_at = datetime.now()

    db.commit()
    return violations



@router.put("/put/location/{location}", response_model=List[schemas.PhatHienViPham])
def update_violations_location(location: str, update_data: schemas.PhatHienViPhamUpdate, db: Session = Depends(get_db)):
    violations = (
        db.query(models.PhatHienViPham)
        .join(models.Camera, models.PhatHienViPham.IdCamera == models.Camera.IdCamera)
        .filter(models.Camera.ViTriLapDat.ilike(f"%{location}%"))
        .all()
    )
    
    if not violations:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm tại vị trí đã chọn")
    
    for violation in violations:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(violation, key, value)
        violation.updated_at = datetime.now()

    db.commit()
    return violations


# @router.put("/put/status/{status}", response_model=List[schemas.PhatHienViPham])
# def update_violations_status(status: str, update_data: schemas.PhatHienViPhamUpdate, db: Session = Depends(get_db)):
#     violations = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.TrangThai == status).all()
    
#     if not violations:
#         raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm với trạng thái đã chọn")
    
#     for violation in violations:
#         for key, value in update_data.dict(exclude_unset=True).items():
#             setattr(violation, key, value)
#         violation.updated_at = datetime.now()

#     db.commit()
#     return violations

@router.put("/put/status/{id}", response_model=schemas.PhatHienViPham)
def update_violation_status(id: int, update_data: schemas.PhatHienViPhamUpdateTrangThai, db: Session = Depends(get_db)):
    violation = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.IdPhatHien == id).first()
    if not violation:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm với IdPhatHien đã chọn")
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(violation, key, value)
    violation.updated_at = datetime.now()
    db.commit()
    db.refresh(violation)
    return violation

@router.delete("/delete/id/{violation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_violation(violation_id: int, db: Session = Depends(get_db)):
    violation = db.query(models.PhatHienViPham).filter(models.PhatHienViPham.IdPhatHienViPham == violation_id).first()
    if not violation:
        raise HTTPException(status_code=404, detail="Không tìm thấy vi phạm")
    
    db.delete(violation)
    db.commit()
    return None
