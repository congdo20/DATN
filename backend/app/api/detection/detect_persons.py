from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import SessionLocal
from app.models import models
from app.schemas import schemas
from datetime import datetime
from sqlalchemy import or_, func, cast, String, and_
from rapidfuzz import fuzz
import re


router = APIRouter(
    prefix="/detect_persons",
    tags=["DetectPersons"]
)

# Dependency để lấy session database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/get", response_model=List[schemas.NhanDangNguoi], response_model_exclude_none=True)
def get_all_persons(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(models.NhanDangNguoi).offset(skip).limit(limit).all()

@router.get("/get/id/{detect_person_id}", response_model=schemas.NhanDangNguoi)
def get_person(detect_person_id: int, db: Session = Depends(get_db)):
    person = db.query(models.NhanDangNguoi).filter(models.NhanDangNguoi.IdNhanDangNguoi == detect_person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Không tìm thấy người")
    return person

# @router.get("/get/search/{term}", response_model=List[schemas.NhanDangNguoi])
# def search_detected_persons(term: str, db: Session = Depends(get_db)):
#     term_lower = term.lower()

#     persons = db.query(models.NhanDangNguoi).all()
#     filtered = []
#     for p in persons:
#         dac_trung = p.DacTrung or {}  # Nếu DacTrung là JSON/dict
#         if (
#             term_lower in (dac_trung.get('TrangPhuc', '') or '').lower()
#             or term_lower in (dac_trung.get('PhuKien', '') or '').lower()
#             or term_lower in (dac_trung.get('Toc', '') or '').lower()
#             or term_lower in (dac_trung.get('HinhDang', '') or '').lower()
#             or term_lower in (p.GioiTinh or '').lower()
#             or term_lower in str(p.Tuoi)
#         ):
#             filtered.append(p)

#     return filtered



# @router.get("/get/person/search", response_model=List[schemas.NhanDangNguoi])
# def search_persons(
#     min_age: Optional[int] = Query(None, description="Tuổi tối thiểu (inclusive)"),
#     max_age: Optional[int] = Query(None, description="Tuổi tối đa (inclusive)"),
#     gender: Optional[schemas.GioiTinhEnum] = Query(None, description="Giới tính (Nam, Nu, Khac)"),
#     keyword: Optional[str] = Query(None, description="Từ khóa tìm kiếm trong các đặc trưng (TrangPhuc, PhuKien, Toc, HinhDang)"),
#     db: Session = Depends(get_db)
# ):
#     query = db.query(models.NhanDangNguoi)
#     conditions = []

#     # Điều kiện tìm kiếm theo độ tuổi
#     if min_age is not None:
#         conditions.append(models.NhanDangNguoi.Tuoi >= min_age)
#     if max_age is not None:
#         conditions.append(models.NhanDangNguoi.Tuoi <= max_age)

#     # Điều kiện tìm kiếm theo giới tính
#     if gender is not None:
#         # FastAPI sẽ tự động chuyển đổi chuỗi từ query parameter sang enum (nếu schema.GioiTinhEnum được định nghĩa đúng)
#         conditions.append(func.lower(models.NhanDangNguoi.GioiTinh) == gender.value.lower())

#     # Điều kiện tìm kiếm theo từ khóa trong các đặc trưng
#     if keyword:
#         lower_keyword = keyword.lower()
#         feature_conditions = or_(
#             func.lower(func.json_extract(models.NhanDangNguoi.DacTrung, "$.TrangPhuc")).like(f"%{lower_keyword}%"),
#             func.lower(func.json_extract(models.NhanDangNguoi.DacTrung, "$.PhuKien")).like(f"%{lower_keyword}%"),
#             func.lower(func.json_extract(models.NhanDangNguoi.DacTrung, "$.Toc")).like(f"%{lower_keyword}%"),
#             func.lower(func.json_extract(models.NhanDangNguoi.DacTrung, "$.HinhDang")).like(f"%{lower_keyword}%")
#         )
#         conditions.append(feature_conditions)

#     # Áp dụng tất cả các điều kiện nếu có
#     if conditions:
#         query = query.filter(and_(*conditions))

#     persons = query.all()

#     # Trả về danh sách, có thể là rỗng
#     return persons


@router.get("/get/old/{detect_person_old}", response_model=List[schemas.NhanDangNguoi])
def get_person_by_old(detect_person_old: int, db: Session = Depends(get_db)):
    persons = db.query(models.NhanDangNguoi).filter(models.NhanDangNguoi.Tuoi == detect_person_old).all()
    if not persons:
        raise HTTPException(status_code=404, detail="Không tìm thấy người với độ tuổi này")
    return persons

@router.get("/get/sex/{detect_person_sex}", response_model=List[schemas.NhanDangNguoi])
def get_person_by_sex(detect_person_sex: str, db: Session = Depends(get_db)):
    persons = db.query(models.NhanDangNguoi).filter(models.NhanDangNguoi.GioiTinh == detect_person_sex).all()
    if not persons:
        raise HTTPException(status_code=404, detail="Không tìm thấy người với giới tính này")
    return persons

@router.get("/get/location/{detect_person_location}", response_model=List[schemas.NhanDangNguoi])
def get_person_by_location(detect_person_location: str, db: Session = Depends(get_db)):
    persons = db.query(models.NhanDangNguoi).filter(models.NhanDangNguoi.ViTri.like(f"%{detect_person_location}%")).all()
    if not persons:
        raise HTTPException(status_code=404, detail="Không tìm thấy người ở vị trí này")
    return persons

def extract_age_range(text: str):
    """Trích xuất khoảng tuổi từ chuỗi, ví dụ: 'từ 25 đến 35' hoặc '30-40'."""
    matches = re.findall(r"(\d{1,3})\D+(\d{1,3})", text)
    if matches:
        return int(matches[0][0]), int(matches[0][1])
    return None

@router.get("/get/feature/{detect_person_feature}", response_model=List[schemas.NhanDangNguoi])
def get_person_by_feature(detect_person_feature: str, db: Session = Depends(get_db)):
    all_persons = db.query(models.NhanDangNguoi).all()
    query = detect_person_feature.lower().strip()

    age_range = extract_age_range(query)
    filtered = []

    for p in all_persons:
        dac_trung = p.DacTrung or {}
        match_score = 0

        description = " ".join([
            dac_trung.get("TrangPhuc", ""),
            dac_trung.get("PhuKien", ""),
            dac_trung.get("Toc", ""),
            dac_trung.get("HinhDang", ""),
            p.GioiTinh or ""
        ]).lower()

        score = fuzz.partial_ratio(query, description)

        if score >= 60:
            match_score += score

        if age_range:
            min_age, max_age = age_range
            if p.Tuoi and min_age <= p.Tuoi <= max_age:
                match_score += 100

        elif str(p.Tuoi) in query:
            match_score += 50

        if match_score > 60:
            filtered.append(p)

    return filtered


@router.post("/post", response_model=schemas.NhanDangNguoi, status_code=status.HTTP_201_CREATED)
def create_person(person: schemas.NhanDangNguoiCreate, db: Session = Depends(get_db)):
    new_person = models.NhanDangNguoi(
        **person.dict()
    )
    db.add(new_person)
    db.commit()
    db.refresh(new_person)
    return new_person

# @router.put("/put/{person_id}", response_model=schemas.NhanDangNguoi)
# def update_person(person_id: int, update_data: schemas.NhanDangNguoiUpdate, db: Session = Depends(get_db)):
#     person = db.query(models.NhanDangNguoi).filter(models.NhanDangNguoi.IdNhanDangNguoi == person_id).first()
#     if not person:
#         raise HTTPException(status_code=404, detail="Không tìm thấy người")
    
#     for key, value in update_data.dict(exclude_unset=True).items():
#         setattr(person, key, value)

#     person.updated_at = datetime.now()
#     db.commit()
#     db.refresh(person)
#     return person

@router.put("/put/id/{id}")
def update_do_tin_cay(
    id: int = Path(...),
    body: schemas.UpdateDoTinCayRequest = None,
    db: Session = Depends(get_db)
):
    person = db.query(models.NhanDangNguoi).filter(models.NhanDangNguoi.IdNhanDangNguoi == id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Không tìm thấy người")

    person.DoTinCay = body.DoTinCay
    person.updated_at = datetime.now()
    db.commit()
    db.refresh(person)

    return {"message": "Cập nhật độ tin cậy thành công", "DoTinCay": person.DoTinCay}
@router.put("/put/image/{image_id}", response_model=schemas.NhanDangNguoi)
def update_person_by_image(image_id: int, update_data: schemas.NhanDangNguoiUpdate, db: Session = Depends(get_db)):
    persons = db.query(models.NhanDangNguoi).filter(models.NhanDangNguoi.IdAnh == image_id).all()
    if not persons:
        raise HTTPException(status_code=404, detail="Không tìm thấy người với ảnh này")
    
    for person in persons:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(person, key, value)
        person.updated_at = datetime.now()

    db.commit()
    return persons

@router.put("/put/location/{location}", response_model=List[schemas.NhanDangNguoi])
def update_person_by_location(location: str, update_data: schemas.NhanDangNguoiUpdate, db: Session = Depends(get_db)):
    persons = db.query(models.NhanDangNguoi).filter(models.NhanDangNguoi.ViTri.like(f"%{location}%")).all()
    if not persons:
        raise HTTPException(status_code=404, detail="Không tìm thấy người ở vị trí này")
    
    for person in persons:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(person, key, value)
        person.updated_at = datetime.now()

    db.commit()
    return persons

@router.put("/put/camera/{camera_id}", response_model=List[schemas.NhanDangNguoi])
def update_person_by_camera(camera_id: int, update_data: schemas.NhanDangNguoiUpdate, db: Session = Depends(get_db)):
    persons = db.query(models.NhanDangNguoi).filter(models.NhanDangNguoi.IdCamera == camera_id).all()
    if not persons:
        raise HTTPException(status_code=404, detail="Không tìm thấy người với camera này")
    
    for person in persons:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(person, key, value)
        person.updated_at = datetime.now()

    db.commit()
    return persons



@router.delete("/delete/id/{person_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_person(person_id: int, db: Session = Depends(get_db)):
    person = db.query(models.NhanDangNguoi).filter(models.NhanDangNguoi.IdNhanDangNguoi == person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Không tìm thấy người")
    
    db.delete(person)
    db.commit()
    return None
