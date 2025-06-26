import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Button, TextField, MenuItem, Typography, Stack, Alert, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const CameraCreatePageAdmin = () => {
  const [form, setForm] = useState({
    IpCamera: "",
    ViTriLapDat: "",
    TrangThaiCamera: "Hoat Dong",
    NgayLapDat: "",
    BaoTri: "",
    IdKhuVuc: "",
    Latitude: "",
    Longitude: ""
  });
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/areas/get`)
      .then(res => setAreas(res.data))
      .catch(() => setAreas([]));
  }, []);

  // Component chọn điểm trên bản đồ
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setForm((prev) => ({
          ...prev,
          Latitude: e.latlng.lat,
          Longitude: e.latlng.lng
        }));
      }
    });
    return form.Latitude && form.Longitude ? (
      <Marker position={[form.Latitude, form.Longitude]} icon={L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41] })} />
    ) : null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation cho ngày bảo trì
    if (form.BaoTri && form.NgayLapDat) {
      const ngayLapDat = new Date(form.NgayLapDat);
      const ngayBaoTri = new Date(form.BaoTri);
      if (ngayBaoTri <= ngayLapDat) {
        setError("Ngày bảo trì phải sau ngày lắp đặt.");
        return;
      }
    }
    
    setLoading(true);
    try {
      // Loại bỏ trường BaoTri nếu không có giá trị
      const submitData = { ...form };
      if (!submitData.BaoTri) {
        delete submitData.BaoTri;
      }
      
      await axios.post(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/cameras/post`, submitData);
      setSuccess("Thêm camera thành công!");
      setTimeout(() => navigate("/admin/cameramanage"), 1200);
    } catch (err) {
      // setError(err.response?.data?.detail || "Thêm camera thất bại.");

      let message = "Thêm camera thất bại.";

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        message = detail.map((e) => e.msg || JSON.stringify(e)).join(', ');
      } else if (typeof detail === "string") {
        message = detail;
      } else if (typeof detail === "object") {
        message = detail.msg || JSON.stringify(detail);
      }

      setError(message);


      // // Xử lý các loại lỗi khác nhau
      // let errorMessage = "Thêm camera thất bại.";
      
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
    <Box maxWidth={600} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Thêm camera mới</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="IP Camera" name="IpCamera" value={form.IpCamera} onChange={handleChange} required fullWidth />
          <TextField label="Vị trí lắp đặt" name="ViTriLapDat" value={form.ViTriLapDat} onChange={handleChange} required fullWidth />
          <TextField select label="Trạng thái" name="TrangThaiCamera" value={form.TrangThaiCamera} onChange={handleChange} fullWidth>
            <MenuItem value="Hoat Dong">Hoạt động</MenuItem>
            <MenuItem value="Khong Hoat Dong">Không hoạt động</MenuItem>
            <MenuItem value="Hu Hong">Hư hỏng</MenuItem>
            <MenuItem value="Bao Tri">Bảo trì</MenuItem>
          </TextField>
          <TextField label="Ngày lắp đặt" name="NgayLapDat" value={form.NgayLapDat} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Ngày bảo trì" name="BaoTri" value={form.BaoTri} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} fullWidth />
          <TextField select label="Khu vực" name="IdKhuVuc" value={form.IdKhuVuc} onChange={handleChange} required fullWidth>
            {areas.map(area => (
              <MenuItem key={area.IdKhuVuc} value={area.IdKhuVuc}>{area.TenKhuVuc}</MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField label="Vĩ độ (Latitude)" name="Latitude" value={form.Latitude} onChange={handleChange} required fullWidth />
            <TextField label="Kinh độ (Longitude)" name="Longitude" value={form.Longitude} onChange={handleChange} required fullWidth />
          </Stack>
          <Box mb={2}>
            <Typography variant="body2" mb={1}>Chọn vị trí trên bản đồ:</Typography>
            <MapContainer center={[21.0285, 105.8542]} zoom={13} style={{ height: 300, width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
          </Box>
          {/* {error && <Alert severity="error">{error}</Alert>} */}
          {error && (
            <Alert severity="error">
              {typeof error === "string"
                ? error
                : Array.isArray(error)
                  ? error.map((e, i) => (
                      <div key={i}>{e.msg || JSON.stringify(e)}</div>
                    ))
                  : error.msg || JSON.stringify(error)}
            </Alert>
          )}
          {success && <Alert severity="success">{success}</Alert>}
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Đăng ký"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CameraCreatePageAdmin; 