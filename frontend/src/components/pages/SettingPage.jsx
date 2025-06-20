import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/SettingPage.css";

const SettingPage = () => {
  const [formData, setFormData] = useState({
    TenNguoiDung: "",
    SoDienThoai: "",
    MatKhau: "",
    Email: "",
    XacNhanMatKhau: "",
    NgaySinh: "",
    GioiTinh: "",
    VaiTro: "",
    TrangThai: "",
    IdKhuVuc: 0,
    TenKhuVuc: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [khuVucList, setKhuVucList] = useState([]);
  
  const { user } = useAuth();
  const userId = user?.IdTaiKhoan;
  const vaiTroOptions = [
    { value: "Quan Tri", label: "Quản trị viên" },
    { value: "Giam Sat", label: "Giám sát" },
    { value: "Nhan Vien", label: "Nhân viên" },
    { value: "Nguoi Dan", label: "Người dân" },
    { value: "Nguoi Dung", label: "Người dùng" },
  ];

  const isAdmin = user?.VaiTro === "Quan Tri" || user?.VaiTro === "Giam Sat";

  //   const userId = 1; // Hoặc lấy từ AuthContext/localStorage

  useEffect(() => {
    const fetchKhuVuc = async () => {
      try {
        const res = await axios.get(
          `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/areas/get`
        );
        setKhuVucList(res.data); // Giả sử trả về list [{IdKhuVuc, TenKhuVuc}]
      } catch (err) {
        console.error("Lỗi khi lấy khu vực", err);
      }
    };

    fetchKhuVuc();
  }, []);

  // Load dữ liệu người dùng từ API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/get/id/${userId}`
        );

        setFormData({
          TenNguoiDung: res.data.TenNguoiDung || "",
          Email: res.data.Email || "",
          SoDienThoai: res.data.SoDienThoai || "",
          MatKhau: "",
          NgaySinh: res.data.NgaySinh || "",
          GioiTinh: res.data.GioiTinh || "Nam",
          VaiTro: res.data.VaiTro || "",
          TrangThai: res.data.TrangThai || "Hoat Dong",
          IdKhuVuc: res.data.khuvuc?.IdKhuVuc || 0, // <-- đây là điểm cập nhật
        });
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "IdKhuVuc" ? parseInt(value, 10) : value,
    }));
  };

  const validateForm = (data) => {
    if (!data.TenNguoiDung || data.TenNguoiDung.trim().length < 3) {
      return "Tên người dùng phải có ít nhất 3 ký tự.";
    }
    if (data.TenNguoiDung.length > 50) {
      return "Tên người dùng không được quá 50 ký tự.";
    }
    if (!data.SoDienThoai) {
      return "Vui lòng nhập số điện thoại.";
    }
    if (!/^0[0-9]{9}$/.test(data.SoDienThoai)) {
      return "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0.";
    }
    if (data.MatKhau) {
      if (data.MatKhau.length < 8) {
        return "Mật khẩu phải có ít nhất 8 ký tự.";
      }
      if (!/[A-Z]/.test(data.MatKhau)) {
        return "Mật khẩu phải chứa ít nhất 1 chữ hoa.";
      }
      if (!/[a-z]/.test(data.MatKhau)) {
        return "Mật khẩu phải chứa ít nhất 1 chữ thường.";
      }
      if (!/\d/.test(data.MatKhau)) {
        return "Mật khẩu phải chứa ít nhất 1 số.";
      }
      if (!/[@$!%*?&]/.test(data.MatKhau)) {
        return "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.";
      }
      if (data.MatKhau !== data.XacNhanMatKhau) {
        return "Mật khẩu và xác nhận mật khẩu không khớp.";
      }
    }
    if (!data.NgaySinh) {
      return "Vui lòng chọn ngày sinh.";
    }
    const today = new Date();
    const birth = new Date(data.NgaySinh);
    if (birth > today) {
      return "Ngày sinh không hợp lệ.";
    }
    if (!data.GioiTinh) {
      return "Vui lòng chọn giới tính.";
    }
    if (!data.IdKhuVuc || data.IdKhuVuc === 0) {
      return "Vui lòng chọn khu vực.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (formData.SoDienThoai) {
      const checkPhoneRes = await axios.get(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/get/check/phone`,
        {
          params: { number: formData.SoDienThoai }
        }
      );

      if (
        checkPhoneRes.data.exists &&
        checkPhoneRes.data.userId !== userId
      ) {
        setError("Số điện thoại này đã được sử dụng.");
        setLoading(false);
        return;
      }
    }

    setLoading(true);

    try {
      const filteredData = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          if (
            value !== "" &&
            value !== null &&
            key !== "XacNhanMatKhau" &&
            key !== "TenKhuVuc" &&
            key !== "Email"
          ) {
            if (key === "MatKhau" && value === "") {
            } else {
                acc[key] = value;
            }
          }
          return acc;
        },
        {}
      );

      await axios.put(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/put/id/${userId}`,
        filteredData
      );
      setSuccess("Cập nhật thành công!");
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      setError("Có lỗi xảy ra khi cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setting-page-container">
      <Typography variant="h4" className="setting-page-title" gutterBottom>
        Cài Đặt Tài Khoản
      </Typography>

      <form onSubmit={handleSubmit} className="setting-form">
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tên người dùng"
              name="TenNguoiDung"
              value={formData.TenNguoiDung}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              name="SoDienThoai"
              value={formData.SoDienThoai}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mật khẩu mới"
              name="MatKhau"
              type="password"
              value={formData.MatKhau}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              name="XacNhanMatKhau"
              type="password"
              value={formData.XacNhanMatKhau}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ngày sinh"
              name="NgaySinh"
              type="date"
              value={formData.NgaySinh}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Giới tính</InputLabel>
              <Select
                name="GioiTinh"
                value={formData.GioiTinh}
                onChange={handleChange}
                label="Giới tính"
              >
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nu">Nữ</MenuItem>
                <MenuItem value="Khac">Khác</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Vai trò</InputLabel>
              <Select
                name="VaiTro"
                value={formData.VaiTro || ""}
                onChange={handleChange}
                label="Vai trò"
                disabled={!isAdmin}
              >
                <MenuItem value="">
                  <em>Chọn vai trò</em>
                </MenuItem>
                {vaiTroOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="TrangThai"
                value={formData.TrangThai}
                onChange={handleChange}
                label="Trạng thái"
                disabled={!isAdmin}
              >
                <MenuItem value="Hoat Dong">Hoạt động</MenuItem>
                <MenuItem value="Khoa">Bị khóa</MenuItem>
                <MenuItem value="Tam Ngung">Tạm Ngưng</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Khu vực</InputLabel>
              <Select
                name="IdKhuVuc"
                value={formData.IdKhuVuc}
                onChange={handleChange}
                label="Khu vực"
              >
                {khuVucList.map((kv) => (
                  <MenuItem key={kv.IdKhuVuc} value={kv.IdKhuVuc}>
                    {kv.TenKhuVuc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Button
              type="submit"
              variant="contained"
              className="save-btn-custom"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Lưu thay đổi"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default SettingPage;
