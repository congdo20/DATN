import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CssBaseline,
  Grid,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { 
  LockOutlined, 
  Email, 
  Visibility, 
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/LoginPage.css";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const apiHost = process.env.REACT_APP_API_HOST;
  const apiPort = process.env.REACT_APP_API_PORT;
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await axios.get(
        `http://${apiHost}:${apiPort}/users/get`
      );

      if (response.data && Array.isArray(response.data)) {
        const foundUser = response.data.find(
          (user) =>
            user.Email === form.username && user.MatKhau === form.password
        );

        if (foundUser) {
          if (foundUser.TrangThai === "Hoat Dong") {
            sessionStorage.setItem("authUser", JSON.stringify(foundUser));
            sessionStorage.setItem("role", foundUser.VaiTro);
            login(foundUser);
            setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
            setTimeout(() => {
              if (
                foundUser.VaiTro === "Quan Tri" ||
                foundUser.VaiTro === "Giam Sat"
              ) {
                navigate("/admin/home");
              } else {
                navigate("/user/home");
              }
            }, 500);
          } else if (foundUser.TrangThai === "Khoa") {
            setError("Tài khoản đã bị khoá. Vui lòng liên hệ quản trị viên.");
          } else if (foundUser.TrangThai === "Tam Ngung") {
            setError("Tài khoản đã bị tạm ngưng. Vui lòng liên hệ quản trị viên.");
          } else {
            setError("Tài khoản không hợp lệ.");
          }
        } else {
          setError("Email hoặc mật khẩu không đúng");
        }
      } else {
        setError("Không thể tải dữ liệu người dùng");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <Paper className="login-paper" elevation={3}>
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            {/* Header */}
            <Box className="login-header">
              <Avatar className="login-avatar">
                <LockOutlined fontSize="large" />
              </Avatar>
              <Typography className="login-title" component="h1" variant="h4">
                Đăng nhập hệ thống
              </Typography>
              <Typography className="login-subtitle" variant="body1">
                Chào mừng bạn đến với hệ thống giám sát!
                <br />
                Vui lòng đăng nhập để tiếp tục
              </Typography>
            </Box>

            {/* Alerts */}
            {error && (
              <Alert severity="error" className="error-alert">
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" className="success-alert">
                {success}
              </Alert>
            )}

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              className="form-container"
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email đăng nhập"
                name="username"
                autoComplete="email"
                autoFocus
                className="custom-textfield form-field-animation"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email className="field-icon" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                className="custom-textfield form-field-animation"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined className="field-icon" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff className="field-icon" />
                        ) : (
                          <Visibility className="field-icon" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                className="login-button form-field-animation"
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <LoginIcon sx={{ mr: 1 }} />
                    Đăng nhập
                  </>
                )}
              </Button>
              
              <Grid container justifyContent="center" className="form-field-animation">
                <Grid item>
                  <Link to="/signup" className="signup-link">
                    <Typography variant="body2">
                      Chưa có tài khoản? Đăng ký ngay
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
