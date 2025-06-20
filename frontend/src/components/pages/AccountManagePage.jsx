import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, CircularProgress, Typography, IconButton, Tooltip,
  Stack, Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AccountManagePage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchAccounts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/get`
      );
      setAccounts(res.data);
    } catch (err) {
      setError("Không thể tải danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tài khoản này không?")) {
      try {
        await axios.delete(
          `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/delete/id/${id}`
        );
        alert("Xóa tài khoản thành công!")
        fetchAccounts(); // Refresh danh sách sau khi xóa
      } catch (err) {
        alert("Xóa thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/accountsetting/${id}`);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const isAdminOrSupervisor = (role) =>
    role === "Quan Tri" || role === "Giam Sat";

  const renderRoleChip = (role) => {
    const map = {
      "Quan Tri": { label: "Quản trị viên", color: "error" },
      "Giam Sat": { label: "Giám sát", color: "warning" },
      "Nhan Vien": { label: "Nhân viên", color: "primary" },
      "Nguoi Dan": { label: "Người dân", color: "info" },
      "Nguoi Dung": { label: "Người dùng", color: "default" },
    };
    return <Chip label={map[role]?.label || role} color={map[role]?.color || "default"} size="small" />;
  };

  const renderStatusChip = (status) => {
    const color = status === "Hoat Dong" ? "success" : "default";
    return <Chip label={status === "Hoat Dong" ? "Hoạt động" : "Bị khóa"} color={color} size="small" />;
  };

  return (
    <div style={{ padding: 24 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Quản lý tài khoản</Typography>
        <Tooltip title="Tải lại danh sách">
          <IconButton onClick={fetchAccounts}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
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
                <TableCell><strong>Họ tên</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>SĐT</strong></TableCell>
                <TableCell><strong>Vai trò</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Ngày sinh</strong></TableCell>
                <TableCell><strong>Khu vực</strong></TableCell>
                <TableCell align="center"><strong>Hành động</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((acc) => (
                <TableRow key={acc.IdTaiKhoan} hover>
                  <TableCell>{acc.IdTaiKhoan}</TableCell>
                  <TableCell>{acc.TenNguoiDung}</TableCell>
                  <TableCell>{acc.Email}</TableCell>
                  <TableCell>{acc.SoDienThoai}</TableCell>
                  <TableCell>{renderRoleChip(acc.VaiTro)}</TableCell>
                  <TableCell>{renderStatusChip(acc.TrangThai)}</TableCell>
                  <TableCell>
                    {acc.NgaySinh
                      ? new Date(acc.NgaySinh).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{acc.khuvuc?.TenKhuVuc || "-"}</TableCell>
                  <TableCell align="center">
                    {!isAdminOrSupervisor(acc.VaiTro) && (
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Sửa">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(acc.IdTaiKhoan)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(acc.IdTaiKhoan)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
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

export default AccountManagePage;










// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   CircularProgress,
//   Typography,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import RefreshIcon from "@mui/icons-material/Refresh";

// const AccountManagePage = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchAccounts = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(
//         `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/get`
//       );
//       setAccounts(res.data);
//     } catch (err) {
//       setError("Không thể tải danh sách tài khoản.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAccounts();
//   }, []);

//   return (
//     <div style={{ padding: 24 }}>
//       <Typography variant="h4" gutterBottom>
//         Quản lý tài khoản
//         <Tooltip title="Tải lại danh sách">
//           <IconButton onClick={fetchAccounts} sx={{ ml: 2 }}>
//             <RefreshIcon />
//           </IconButton>
//         </Tooltip>
//       </Typography>
//       {loading ? (
//         <CircularProgress />
//       ) : error ? (
//         <Typography color="error">{error}</Typography>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Tên người dùng</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Số điện thoại</TableCell>
//                 <TableCell>Vai trò</TableCell>
//                 <TableCell>Trạng thái</TableCell>
//                 <TableCell>Ngày sinh</TableCell>
//                 <TableCell>Khu vực</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {accounts.map((acc) => (
//                 <TableRow key={acc.IdTaiKhoan}>
//                   <TableCell>{acc.IdTaiKhoan}</TableCell>
//                   <TableCell>{acc.TenNguoiDung}</TableCell>
//                   <TableCell>{acc.Email}</TableCell>
//                   <TableCell>{acc.SoDienThoai}</TableCell>
//                   <TableCell>{acc.VaiTro}</TableCell>
//                   <TableCell>{acc.TrangThai}</TableCell>
//                   <TableCell>{acc.NgaySinh ? new Date(acc.NgaySinh).toLocaleDateString() : ""}</TableCell>
//                   <TableCell>{acc.khuvuc?.TenKhuVuc || ""}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </div>
//   );
// };

// export default AccountManagePage;
