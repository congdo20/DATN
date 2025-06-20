# #!/usr/bin/env python3
# """
# Script để cập nhật database với enum GioiTinh mới
# """

# import os
# import sys
# from sqlalchemy import create_engine, text
# from sqlalchemy.orm import sessionmaker

# # Thêm đường dẫn app vào sys.path
# sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# from app.database import SQLALCHEMY_DATABASE_URL

# def update_database():
#     """Cập nhật database với enum GioiTinh mới"""
    
#     # Tạo engine
#     engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
#     try:
#         with engine.connect() as connection:
#             # Cập nhật enum trong bảng TaiKhoan
#             print("Đang cập nhật enum GioiTinh trong bảng TaiKhoan...")
            
#             # Cập nhật các giá trị cũ
#             connection.execute(text("""
#                 UPDATE TaiKhoan 
#                 SET GioiTinh = 'Nữ' 
#                 WHERE GioiTinh = 'Nu'
#             """))
            
#             connection.execute(text("""
#                 UPDATE TaiKhoan 
#                 SET GioiTinh = 'Khác' 
#                 WHERE GioiTinh = 'Khac'
#             """))
            
#             # Cập nhật enum trong bảng NhanDangNguoi
#             print("Đang cập nhật enum GioiTinh trong bảng NhanDangNguoi...")
            
#             connection.execute(text("""
#                 UPDATE NhanDangNguoi 
#                 SET GioiTinh = 'Nữ' 
#                 WHERE GioiTinh = 'Nu'
#             """))
            
#             connection.execute(text("""
#                 UPDATE NhanDangNguoi 
#                 SET GioiTinh = 'Khác' 
#                 WHERE GioiTinh = 'Khac'
#             """))
            
#             # Commit thay đổi
#             connection.commit()
            
#             print("✅ Cập nhật database thành công!")
            
#     except Exception as e:
#         print(f"❌ Lỗi khi cập nhật database: {e}")
#         return False
    
#     return True

# if __name__ == "__main__":
#     print("🔄 Bắt đầu cập nhật database...")
#     success = update_database()
    
#     if success:
#         print("🎉 Hoàn thành cập nhật database!")
#     else:
#         print("💥 Có lỗi xảy ra khi cập nhật database!")
#         sys.exit(1) 