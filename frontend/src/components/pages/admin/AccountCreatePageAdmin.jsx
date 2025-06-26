import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Button, TextField, MenuItem, Typography, Stack, Alert, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AccountCreatePageAdmin = () => {
  const [form, setForm] = useState({
    TenNguoiDung: "",
    Email: "",
    SoDienThoai: "",
    MatKhau: "",
    NgaySinh: "",
    GioiTinh: "Nam",
    VaiTro: "Nhan Vien",
    IdKhuVuc: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    axios.get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/areas/get`)
      .then(res => setAreas(res.data))
      .catch(() => setAreas([]));
  }, []);


  const checkEmail = async (email) => {
    if (!email) return;
    try {
      const res = await axios.get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/get/check/email`, { params: { email } });
      setEmailExists(res.data.exists);
    } catch {
      setEmailExists(false);
    }
  };


  const checkPhone = async (phone) => {
    if (!phone) return;
    try {
      const res = await axios.get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/get/check/phone`, { params: { phone } });
      setPhoneExists(res.data.exists);
    } catch {
      setPhoneExists(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "Email") {
      checkEmail(value);
    }
    if (name === "SoDienThoai") {
      checkPhone(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.MatKhau !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (emailExists) {
      setError("Email đã tồn tại trên hệ thống.");
      return;
    }
    if (phoneExists) {
      setError("Số điện thoại đã tồn tại trên hệ thống.");
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...formData } = form;
      await axios.post(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/post`, formData);
      setSuccess("Tạo tài khoản thành công!");
      setTimeout(() => navigate("/admin/accountmanage"), 1200);
    } catch (err) {
      let message = "Tạo tài khoản thất bại.";

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        message = detail.map((e) => e.msg || JSON.stringify(e)).join(', ');
      } else if (typeof detail === "string") {
        message = detail;
      } else if (typeof detail === "object") {
        message = detail.msg || JSON.stringify(detail);
      }

      setError(message);
      
      //    // Xử lý các loại lỗi khác nhau
      // let errorMessage = "Tạo tài khoản thất bại.";
      
      // if (err.response?.data) {
      //   if (typeof err.response.data === 'string') {
      //     errorMessage = err.response.data;
      //   } else if (err.response.data.detail) {
      //     errorMessage = err.response.data.detail;
      //   } else if (err.response.data.message) {
      //     errorMessage = err.response.data.message;
      //   } else if (Array.isArray(err.response.data)) {
      //     // Nếu là array của validation errors
      //     errorMessage = err.response.data.map(error => 
      //       typeof error === 'string' ? error : error.msg || 'Lỗi validation'
      //     ).join(', ');
      //   } else if (typeof err.response.data === 'object') {
      //     // Nếu là object, lấy message đầu tiên
      //     const messages = Object.values(err.response.data).filter(msg => typeof msg === 'string');
      //     errorMessage = messages.length > 0 ? messages[0] : 'Lỗi dữ liệu không hợp lệ';
      //   }
      // } else if (err.message) {
      //   errorMessage = err.message;
      // }
      
      // setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Tạo tài khoản mới</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Họ tên" name="TenNguoiDung" value={form.TenNguoiDung} onChange={handleChange} required fullWidth />
          <TextField label="Email" name="Email" value={form.Email} onChange={handleChange} required fullWidth type="email"
            error={emailExists}
            helperText={emailExists ? "Email đã tồn tại." : ""}
          />
          <TextField label="Số điện thoại" name="SoDienThoai" value={form.SoDienThoai} onChange={handleChange} required fullWidth
            error={phoneExists}
            helperText={phoneExists ? "Số điện thoại đã tồn tại." : ""}
          />
          <TextField label="Mật khẩu" name="MatKhau" value={form.MatKhau} onChange={handleChange} required fullWidth type="password" />
          <TextField label="Xác nhận mật khẩu" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required fullWidth type="password"
            error={!!confirmPassword && form.MatKhau !== confirmPassword}
            helperText={!!confirmPassword && form.MatKhau !== confirmPassword ? "Mật khẩu xác nhận không khớp." : ""}
          />
          <TextField label="Ngày sinh" name="NgaySinh" value={form.NgaySinh} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} fullWidth />
          <TextField select label="Giới tính" name="GioiTinh" value={form.GioiTinh} onChange={handleChange} fullWidth>
            <MenuItem value="Nam">Nam</MenuItem>
            <MenuItem value="Nu">Nữ</MenuItem>
            <MenuItem value="Khac">Khác</MenuItem>
          </TextField>
          <TextField select label="Vai trò" name="VaiTro" value={form.VaiTro} onChange={handleChange} fullWidth>
            <MenuItem value="Nhan Vien">Nhân viên</MenuItem>
            <MenuItem value="Quan Tri">Quản trị viên</MenuItem>
            <MenuItem value="Giam Sat">Giám sát</MenuItem>
            <MenuItem value="Nguoi Dan">Người dân</MenuItem>
            <MenuItem value="Nguoi Dung">Người dùng</MenuItem>
          </TextField>
          <TextField select label="Khu vực" name="IdKhuVuc" value={form.IdKhuVuc} onChange={handleChange} required fullWidth>
            {areas.map(area => (
              <MenuItem key={area.IdKhuVuc} value={area.IdKhuVuc}>{area.TenKhuVuc}</MenuItem>
            ))}
          </TextField>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Đăng ký"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default AccountCreatePageAdmin; 