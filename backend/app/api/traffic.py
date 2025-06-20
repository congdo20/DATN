from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from datetime import datetime, timedelta

from ..models import models
from ..schemas import schemas
from ..database import get_db

router = APIRouter(prefix="/traffic", tags=["Traffic"])

# Get all traffic status with filters and pagination
@router.get("/get", response_model=List[schemas.TinhTrangGiaoThong])
async def get_all_traffic_status(
    skip: int = Query(0, description="Skip records"),
    limit: int = Query(100, description="Limit records per page"),
    IdCamera: Optional[int] = Query(None, description="Filter by camera ID"),
    MatDoGiaoThong: Optional[str] = Query(None, description="Filter by traffic density"),
    ThoiGian_From: Optional[datetime] = Query(None, description="Filter from time"),
    ThoiGian_To: Optional[datetime] = Query(None, description="Filter to time"),
    TocDoTrungBinh_Min: Optional[float] = Query(None, description="Filter by minimum average speed"),
    TocDoTrungBinh_Max: Optional[float] = Query(None, description="Filter by maximum average speed"),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(models.TinhTrangGiaoThong)

        # Apply filters
        if IdCamera:
            query = query.filter(models.TinhTrangGiaoThong.IdCamera == IdCamera)
        if MatDoGiaoThong:
            query = query.filter(models.TinhTrangGiaoThong.MatDoGiaoThong == MatDoGiaoThong)
        if ThoiGian_From:
            query = query.filter(models.TinhTrangGiaoThong.ThoiGian >= ThoiGian_From)
        if ThoiGian_To:
            query = query.filter(models.TinhTrangGiaoThong.ThoiGian <= ThoiGian_To)
        if TocDoTrungBinh_Min is not None:
            query = query.filter(models.TinhTrangGiaoThong.TocDoTrungBinh >= TocDoTrungBinh_Min)
        if TocDoTrungBinh_Max is not None:
            query = query.filter(models.TinhTrangGiaoThong.TocDoTrungBinh <= TocDoTrungBinh_Max)

        # Order by time desc and apply pagination
        query = query.order_by(desc(models.TinhTrangGiaoThong.ThoiGian)).offset(skip).limit(limit)
        
        return query.all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get traffic status by ID
@router.get("/get/id/{id}", response_model=schemas.TinhTrangGiaoThong)
async def get_traffic_status_by_id(id: int, db: Session = Depends(get_db)):
    try:
        status = db.query(models.TinhTrangGiaoThong).filter(models.TinhTrangGiaoThong.IdTinhTrang == id).first()
        if not status:
            raise HTTPException(status_code=404, detail="Không tìm thấy tình trạng giao thông")
        return status
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get traffic statistics by camera
@router.get("/get/statistics/camera/{camera_id}", response_model=schemas.ThongKeGiaoThong)
async def get_traffic_statistics_by_camera(
    camera_id: int,
    from_time: Optional[datetime] = Query(None),
    to_time: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(
            func.avg(models.TinhTrangGiaoThong.TocDoTrungBinh).label("toc_do_trung_binh"),
            func.count(models.TinhTrangGiaoThong.IdTinhTrang).label("so_lan_kiem_tra"),
            func.max(models.TinhTrangGiaoThong.TocDoTrungBinh).label("toc_do_cao_nhat"),
            func.min(models.TinhTrangGiaoThong.TocDoTrungBinh).label("toc_do_thap_nhat")
        ).filter(models.TinhTrangGiaoThong.IdCamera == camera_id)

        if from_time:
            query = query.filter(models.TinhTrangGiaoThong.ThoiGian >= from_time)
        if to_time:
            query = query.filter(models.TinhTrangGiaoThong.ThoiGian <= to_time)

        result = query.first()
        if not result:
            raise HTTPException(status_code=404, detail="Không tìm thấy dữ liệu thống kê cho camera này")

        return {
            "camera_id": camera_id,
            "toc_do_trung_binh": float(result.toc_do_trung_binh or 0),
            "so_lan_kiem_tra": result.so_lan_kiem_tra,
            "toc_do_cao_nhat": float(result.toc_do_cao_nhat or 0),
            "toc_do_thap_nhat": float(result.toc_do_thap_nhat or 0),
            "thoi_gian_bat_dau": from_time,
            "thoi_gian_ket_thuc": to_time
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get traffic density distribution
@router.get("/get/density/distribution", response_model=List[schemas.PhanBoMatDo])
async def get_traffic_density_distribution(
    from_time: Optional[datetime] = Query(None),
    to_time: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(
            models.TinhTrangGiaoThong.MatDoGiaoThong,
            func.count(models.TinhTrangGiaoThong.IdTinhTrang).label("so_luong")
        ).group_by(models.TinhTrangGiaoThong.MatDoGiaoThong)

        if from_time:
            query = query.filter(models.TinhTrangGiaoThong.ThoiGian >= from_time)
        if to_time:
            query = query.filter(models.TinhTrangGiaoThong.ThoiGian <= to_time)

        results = query.all()
        return [{"mat_do": r.MatDoGiaoThong, "so_luong": r.so_luong} for r in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Create new traffic status
@router.post("/post", response_model=schemas.TinhTrangGiaoThong, status_code=status.HTTP_201_CREATED)
async def create_traffic_status(data: schemas.TinhTrangGiaoThongCreate, db: Session = Depends(get_db)):
    try:
        new_status = models.TinhTrangGiaoThong(**data.dict())
        db.add(new_status)
        db.commit()
        db.refresh(new_status)
        return new_status
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Update traffic status
@router.put("/put/id/{id}", response_model=schemas.TinhTrangGiaoThong)
async def update_traffic_status(id: int, data: schemas.TinhTrangGiaoThongUpdate, db: Session = Depends(get_db)):
    try:
        status = db.query(models.TinhTrangGiaoThong).filter(models.TinhTrangGiaoThong.IdTinhTrang == id).first()
        if not status:
            raise HTTPException(status_code=404, detail="Không tìm thấy tình trạng giao thông")

        for key, value in data.dict(exclude_unset=True).items():
            setattr(status, key, value)

        db.commit()
        db.refresh(status)
        return status
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Delete traffic status
@router.delete("/delete/id/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_traffic_status(id: int, db: Session = Depends(get_db)):
    try:
        status = db.query(models.TinhTrangGiaoThong).filter(models.TinhTrangGiaoThong.IdTinhTrang == id).first()
        if not status:
            raise HTTPException(status_code=404, detail="Không tìm thấy tình trạng giao thông")

        db.delete(status)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
