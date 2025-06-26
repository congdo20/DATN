# Di chuyển vào thư mục backend
cd DATN/backend

# Tạo môi trường ảo Python (nếu chưa có)
python -m venv .venv

# Kích hoạt môi trường ảo
# Trên Windows:
.venv\Scripts\activate
# Trên macOS/Linux:
source .venv/bin/activate

# Cài đặt các dependencies
pip install -r requirements.txt

# Trong cửa sổ terminal thứ nhất (vẫn trong môi trường ảo backend)
uvicorn camera_server:app --reload --port 8001

# Trong cửa sổ terminal thứ hai (vẫn trong môi trường ảo backend)
uvicorn app.main:app --reload

# Di chuyển sang thư mục frontend
cd ../frontend

# Cài đặt các package Node.js
npm install

# Trong cửa sổ terminal thứ ba
npm start


# Truy cập ứng dụng
Mở trình duyệt và truy cập:
Frontend: http://localhost:3000

Backend API: http://localhost:8000

Camera Stream Server: http://localhost:8001
