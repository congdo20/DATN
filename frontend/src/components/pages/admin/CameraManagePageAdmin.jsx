import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Typography, IconButton, Tooltip, Stack, Chip, Button, TextField, InputAdornment
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const CameraManagePageAdmin = () => {
  const [cameras, setCameras] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiHost = process.env.REACT_APP_API_HOST;
  const apiPort = process.env.REACT_APP_API_PORT;
  const navigate = useNavigate();

  const fetchCameraList = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://${apiHost}:${apiPort}/cameras/get`);
      setCameras(res.data);
      setFilteredCameras(res.data);
    } catch (err) {
      setError("Không thể tải danh sách camera.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameraList();
  }, []);

  // Lọc camera theo IP
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCameras(cameras);
    } else {
      const filtered = cameras.filter(cam =>
        cam.IpCamera.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCameras(filtered);
    }
  }, [searchTerm, cameras]);

  const handleEdit = (id) => {
    navigate(`/admin/camerasetting/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa camera này không?")) return;
    try {
      await axios.delete(`http://${apiHost}:${apiPort}/cameras/delete/id/${id}`);
      fetchCameraList();
    } catch (error) {
      alert("Không thể xóa camera. Vui lòng thử lại.");
    }
  };

  const renderStatusChip = (status) => {
    const map = {
      "Hoat Dong": { label: "Hoạt động", color: "success" },
      "Hu Hong": { label: "Hư hỏng", color: "error" },
      "Khong Hoat Dong": { label: "Không hoạt động", color: "default" },
      "Bao Tri": { label: "Bảo trì", color: "warning" },
    };
    return <Chip label={map[status]?.label || status} color={map[status]?.color || "default"} size="small" />;
  };

  const totalCameras = filteredCameras.length;
  const activeCameras = filteredCameras.filter(cam => cam.TrangThaiCamera === "Hoat Dong").length;
  const brokenCameras = filteredCameras.filter(cam => cam.TrangThaiCamera === "Hu Hong").length;
  const inactiveCameras = filteredCameras.filter(cam => cam.TrangThaiCamera === "Khong Hoat Dong").length;
  const maintenanceCameras = filteredCameras.filter(cam => cam.TrangThaiCamera === "Bao Tri").length;

  return (
    <div style={{ padding: 24 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Quản lý camera</Typography>
      </Stack>
      
      {/* Thanh tìm kiếm */}
      <Stack direction="row" spacing={2} mb={3} alignItems="center">
        <TextField
          placeholder="Tìm kiếm theo IP camera..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/cameracreate")}
        >
          Thêm camera
        </Button>
        <Tooltip title="Tải lại danh sách">
          <IconButton onClick={fetchCameraList}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Thống kê */}
      <Stack direction="row" spacing={2} mb={3} alignItems="center">
        <Chip label={`Tổng: ${totalCameras}`} color="primary" />
        <Chip label={`Hoạt động: ${activeCameras}`} color="success" />
        <Chip label={`Không hoạt động: ${inactiveCameras}`} color="default" />
        <Chip label={`Hư hỏng: ${brokenCameras}`} color="error" />
        <Chip label={`Bảo trì: ${maintenanceCameras}`} color="warning" />
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>IP Camera</strong></TableCell>
                <TableCell><strong>Vị trí lắp đặt</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Ngày lắp đặt</strong></TableCell>
                <TableCell><strong>Khu vực</strong></TableCell>
                <TableCell><strong>Bảo trì</strong></TableCell>
                <TableCell align="center"><strong>Hành động</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCameras.map((cam) => (
                <TableRow key={cam.IdCamera} hover>
                  <TableCell>{cam.IdCamera}</TableCell>
                  <TableCell>{cam.IpCamera}</TableCell>
                  <TableCell>{cam.ViTriLapDat}</TableCell>
                  <TableCell>{renderStatusChip(cam.TrangThaiCamera)}</TableCell>
                  <TableCell>{cam.NgayLapDat ? new Date(cam.NgayLapDat).toLocaleDateString() : ""}</TableCell>
                  <TableCell>{cam.khuvuc?.TenKhuVuc || "Chưa gán"}</TableCell>
                  <TableCell>{cam.BaoTri ? new Date(cam.BaoTri).toLocaleDateString() : ""}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Sửa">
                        <IconButton size="small" onClick={() => handleEdit(cam.IdCamera)} color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton size="small" onClick={() => handleDelete(cam.IdCamera)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CameraManagePageAdmin;
