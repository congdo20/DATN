from fastapi import APIRouter, Query, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..models import models
from ..schemas import schemas
from ..database import get_db
from sqlalchemy import func
from unidecode import unidecode


router = APIRouter(prefix="/areas", tags=["Areas"])

@router.get("/get", response_model=list[schemas.KhuVuc])
def get_all_khuvuc(db: Session = Depends(get_db)):
    return db.query(models.KhuVuc).all()

# @router.get("/get/{khuvuc_id}", response_model=schemas.KhuVuc)
# def get_khuvuc(khuvuc_id: int, db: Session = Depends(get_db)):
#     khu_vuc = db.query(models.KhuVuc).filter(models.KhuVuc.IdKhuVuc == khuvuc_id).first()
#     # if not khu_vuc:
#     #     raise HTTPException(status_code=404, detail="Khu vực không tồn tại")
#     if not khu_vuc:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Khu vực không tồn tại"
#         )
#     return khu_vuc

@router.get("/get/id/{khuvuc_id}", response_model=schemas.KhuVuc)
def get_khuvuc_by_id(khuvuc_id: int, db: Session = Depends(get_db)):
    khu_vuc = db.query(models.KhuVuc).filter(models.KhuVuc.IdKhuVuc == khuvuc_id).first()
    if not khu_vuc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy khu vực với ID đã cho"
        )
    return khu_vuc

@router.get("/get/name/{ten_khu_vuc}", response_model=schemas.KhuVuc)
def get_khuvuc_by_name(
    ten_khu_vuc: str,
    db: Session = Depends(get_db)
):
    # Chuyển đổi tên khu vực sang dạng không dấu
    khu_vuc = db.query(models.KhuVuc).filter(models.KhuVuc.TenKhuVuc == ten_khu_vuc).first()
    if not khu_vuc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy khu vực với tên đã cho"
        )
    return khu_vuc

# @router.get("/get", response_model=schemas.KhuVuc)
# def get_khuvuc_by_name(
#     ten_khu_vuc: str = Query(..., alias="ten"),
#     db: Session = Depends(get_db)
# ):
#     khu_vuc = db.query(models.KhuVuc).filter(models.KhuVuc.TenKhuVuc == ten_khu_vuc).first()
#     if not khu_vuc:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Không tìm thấy khu vực với tên đã cho"
#         )
#     return khu_vuc

@router.post("/post", response_model=schemas.KhuVuc, status_code=status.HTTP_201_CREATED)
def create_khuvuc(khuvuc: schemas.KhuVucCreate, db: Session = Depends(get_db)):
    # db_khuvuc = models.KhuVuc(**khuvuc.dict())
    # db.add(db_khuvuc)
    # db.commit()
    # db.refresh(db_khuvuc)
    # return db_khuvuc
    existing = db.query(models.KhuVuc).filter(models.KhuVuc.TenKhuVuc == khuvuc.TenKhuVuc).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên khu vực đã tồn tại"
        )
    db_khuvuc = models.KhuVuc(**khuvuc.dict())
    db.add(db_khuvuc)
    db.commit()
    db.refresh(db_khuvuc)
    return db_khuvuc
