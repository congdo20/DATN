from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..models import models
from ..schemas import schemas
from ..database import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/get", response_model=list[schemas.TaiKhoan])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.TaiKhoan).all()

@router.get("/get/id/{user_id}", response_model=schemas.TaiKhoan)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.TaiKhoan).filter(models.TaiKhoan.IdTaiKhoan == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    return user

@router.get("/get/email/{email}", response_model=schemas.TaiKhoan)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(models.TaiKhoan).filter(models.TaiKhoan.Email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    return user

@router.get("/get/check/phone", response_model=schemas.PhoneCheckResponse)
def check_phone_exists(
    number: str = Query(..., min_length=6, max_length=15),
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.SoDienThoai == number).first()
    if existing_user:
        return schemas.PhoneCheckResponse(exists=True, userId=existing_user.IdTaiKhoan)
    return schemas.PhoneCheckResponse(exists=False, userId=None)


@router.post("/post", response_model=schemas.TaiKhoan, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.TaiKhoanCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.Email == user.Email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã được đăng ký"
        )
    db_user = models.TaiKhoan(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# @router.post("/post/login", response_model=schemas.TaiKhoan)
# def login_user(user: schemas.TaiKhoan, db: Session = Depends(get_db)):
#     db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.Email == user.Email).first()
#     if not db_user or not db_user.verify_password(user.MatKhau):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Email hoặc mật khẩu không đúng"
#         )
#     return db_user



@router.put("/put/id/{user_id}", response_model=schemas.TaiKhoan)
def update_user_by_id(user_id: int, user: schemas.TaiKhoanUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.IdTaiKhoan == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    for key, value in user.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/put/email/{email}", response_model=schemas.TaiKhoan)
def update_user_by_email(email: str, user: schemas.TaiKhoanUpdateByEmail, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.Email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    
    user_data = user.dict()
    # user_data.pop("IdTaiKhoan", None)
    # user_data.pop("Email", None)# Xoá IdTaiKhoan để không cập nhật
    for key, value in user_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/put/tennguoidung/id/{user_id}", response_model=schemas.TaiKhoan)
def update_user_by_id(user_id: int, user: schemas.TaiKhoanUpdateTenNguoiDung, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.IdTaiKhoan == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/put/tennguoidung/email/{email}", response_model=schemas.TaiKhoan)
def update_user_by_email(email: str, user: schemas.TaiKhoanUpdateTenNguoiDung, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.Email == email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/put/vaitro/id/{user_id}", response_model=schemas.TaiKhoan)
def update_user_role(user_id: int, user: schemas.TaiKhoanUpdateVaiTro, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.IdTaiKhoan == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/put/matkhau/id/{user_id}", response_model=schemas.TaiKhoan)
def update_user_password(user_id: int, user: schemas.TaiKhoanUpdateMatKhau, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.IdTaiKhoan == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/put/sodienthoai/id/{user_id}", response_model=schemas.TaiKhoan)
def update_user_phone(user_id: int, user: schemas.TaiKhoanUpdateSoDienThoai, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.IdTaiKhoan == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/put/khuvuc/id/{user_id}", response_model=schemas.TaiKhoan)
def update_user_area(user_id: int, user: schemas.TaiKhoanUpdateKhuVuc, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.IdTaiKhoan == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/put/ngaysinh/id/{user_id}", response_model=schemas.TaiKhoan)
def update_user_birthdate(user_id: int, user: schemas.TaiKhoanUpdateNgaySinh, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.IdTaiKhoan == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/put/gioitinh/id/{user_id}", response_model=schemas.TaiKhoan)
def update_user_sex(user_id: int, user: schemas.TaiKhoanUpdateGioiTinh, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.IdTaiKhoan == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.put("/put/trangthai/id/{user_id}", response_model=schemas.TaiKhoan)
def update_user_status(user_id: int, user: schemas.TaiKhoanUpdateTrangThai, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.IdTaiKhoan == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/delete/email/{email}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_by_email(email: str, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.Email == email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    db.delete(db_user)
    db.commit()
    return

@router.delete("/delete/id/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_by_id(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.TaiKhoan).filter(models.TaiKhoan.IdTaiKhoan == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    db.delete(db_user)
    db.commit()
    return

