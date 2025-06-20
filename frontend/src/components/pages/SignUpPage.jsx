import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  CssBaseline,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
} from "@mui/material";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  AdminPanelSettings,
  Person as PersonIcon,
  LocationOn,
  Cake,
  Transgender,
  CheckCircle,
  Error,
  Warning,
  CheckCircle as Status,
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../../assets/styles/SignUpPage.css";

// Validation schema
const validationSchema = Yup.object({
  TenNguoiDung: Yup.string()
    .required("Vui lòng nhập tên người dùng")
    .min(3, "Tên phải có ít nhất 3 ký tự")
    .max(50, "Tên không được quá 50 ký tự"),
  Email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email")
    .max(100, "Email không được quá 100 ký tự"),
  SoDienThoai: Yup.string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
    .matches(/^0[0-9]{9}$/, "Số điện thoại phải bắt đầu bằng số 0"),
  MatKhau: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
    )
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("MatKhau")], "Mật khẩu không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
  VaiTro: Yup.string().required("Vui lòng chọn vai trò"),
  NgaySinh: Yup.date()
    .required("Vui lòng chọn ngày sinh")
    .max(new Date(), "Ngày sinh không hợp lệ")
    .test("age", "Bạn phải ít nhất 16 tuổi", function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 16;
      }
      return age >= 16;
    }),
  GioiTinh: Yup.string().required("Vui lòng chọn giới tính"),
  IdKhuVuc: Yup.string().required("Vui lòng chọn khu vực"),
  TrangThai: Yup.string(),
});

// Password strength checker
const checkPasswordStrength = (password) => {
  if (!password) return { strength: "none", message: "", color: "" };
  
  let score = 0;
  let feedback = [];

  if (password.length >= 8) score += 1;
  else feedback.push("Ít nhất 8 ký tự");

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Chữ thường");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Chữ hoa");

  if (/\d/.test(password)) score += 1;
  else feedback.push("Số");

  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push("Ký tự đặc biệt");

  if (password.length >= 12) score += 1;

  if (score <= 2) {
    return { strength: "weak", message: "Yếu", color: "#e74c3c" };
  } else if (score <= 4) {
    return { strength: "medium", message: "Trung bình", color: "#f39c12" };
  } else {
    return { strength: "strong", message: "Mạnh", color: "#27ae60" };
  }
};

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({ strength: "none", message: "", color: "" });

  // Fetch danh sách khu vực
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(
          `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/areas/get`
        );
        setAreas(response.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách khu vực:", err);
        setError("Không thể tải danh sách khu vực. Vui lòng thử lại sau.");
      } finally {
        setLoadingAreas(false);
      }
    };
    fetchAreas();
  }, []);

  const formik = useFormik({
    initialValues: {
      TenNguoiDung: "",
      Email: "",
      SoDienThoai: "",
      MatKhau: "",
      confirmPassword: "",
      VaiTro: "",
      NgaySinh: "",
      GioiTinh: "",
      IdKhuVuc: "",
      TrangThai: "Hoat Dong",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      try {
        // Kiểm tra số điện thoại đã tồn tại
        const phoneRes = await axios.get(
          `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/get/check/phone`,
          { params: { number: values.SoDienThoai } }
        );
        if (phoneRes.data.exists) {
          setError("Số điện thoại đã được sử dụng.");
          setIsSubmitting(false);
          return;
        }
        // Kiểm tra email đã tồn tại
        try {
          await axios.get(
            `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/get/email/${values.Email}`
          );
          setError("Email đã được sử dụng.");
          setIsSubmitting(false);
          return;
        } catch (err) {
          // Nếu 404 thì email chưa tồn tại, tiếp tục đăng ký
          if (err.response?.status !== 404) {
            setError("Lỗi kiểm tra email. Vui lòng thử lại.");
            setIsSubmitting(false);
            return;
          }
        }
        // Validate password strength before submission
        const strength = checkPasswordStrength(values.MatKhau);
        if (strength.strength === "weak") {
          setError("Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.");
          setIsSubmitting(false);
          return;
        }
        // Gửi dữ liệu đăng ký đến API
        const response = await axios.post(
          `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/post`,
          {
            ...values,
            // Loại bỏ confirmPassword trước khi gửi
            confirmPassword: undefined,
          }
        );
        if (response.status === 201) {
          setSuccess("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
          setTimeout(() => {
            navigate("/login", {
              state: {
                registrationSuccess: true,
                registeredEmail: values.Email,
              },
            });
          }, 2000);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error ||
                           "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.";
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle password change for strength checking
  const handlePasswordChange = (e) => {
    formik.handleChange(e);
    const strength = checkPasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  const getPasswordStrengthIcon = () => {
    switch (passwordStrength.strength) {
      case "weak":
        return <Error className="field-icon" />;
      case "medium":
        return <Warning className="field-icon" />;
      case "strong":
        return <CheckCircle className="field-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Paper className="signup-paper" elevation={3}>
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            {/* Header */}
            <Box className="signup-header">
              <Avatar className="signup-avatar">
                <LockOutlined fontSize="large" />
              </Avatar>
              <Typography className="signup-title" component="h1" variant="h4">
                Đăng ký tài khoản
              </Typography>
              <Typography className="signup-subtitle" variant="body1">
                Tạo tài khoản mới để truy cập hệ thống
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
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ width: "100%" }}
            >
              {/* Personal Information Section */}
              <Box className="form-section">
                <Typography className="form-section-title">
                  Thông tin cá nhân
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} className="form-field-animation">
                    <TextField
                      fullWidth
                      id="TenNguoiDung"
                      name="TenNguoiDung"
                      label="Tên người dùng"
                      className="custom-textfield"
                      value={formik.values.TenNguoiDung}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.TenNguoiDung &&
                        Boolean(formik.errors.TenNguoiDung)
                      }
                      helperText={
                        formik.touched.TenNguoiDung && formik.errors.TenNguoiDung
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person className="field-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} className="form-field-animation">
                    <TextField
                      fullWidth
                      id="NgaySinh"
                      name="NgaySinh"
                      label="Ngày sinh"
                      type="date"
                      className="custom-textfield"
                      InputLabelProps={{ shrink: true }}
                      value={formik.values.NgaySinh}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.NgaySinh && Boolean(formik.errors.NgaySinh)
                      }
                      helperText={formik.touched.NgaySinh && formik.errors.NgaySinh}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Cake className="field-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} className="form-field-animation">
                    <FormControl fullWidth className="custom-select">
                      <InputLabel id="gioiTinh-label">Giới tính</InputLabel>
                      <Select
                        labelId="gioiTinh-label"
                        id="GioiTinh"
                        name="GioiTinh"
                        label="Giới tính"
                        value={formik.values.GioiTinh}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.GioiTinh && Boolean(formik.errors.GioiTinh)
                        }
                        startAdornment={
                          <InputAdornment position="start">
                            <Transgender className="field-icon" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="Nam">Nam</MenuItem>
                        <MenuItem value="Nu">Nữ</MenuItem>
                        <MenuItem value="Khac">Khác</MenuItem>
                      </Select>
                      {formik.touched.GioiTinh && formik.errors.GioiTinh && (
                        <Typography variant="caption" color="error">
                          {formik.errors.GioiTinh}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} className="form-field-animation">
                    <FormControl fullWidth className="custom-select">
                      <InputLabel id="IdKhuVuc-label">Khu vực</InputLabel>
                      <Select
                        labelId="IdKhuVuc-label"
                        id="IdKhuVuc"
                        name="IdKhuVuc"
                        label="Khu vực"
                        value={formik.values.IdKhuVuc}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={loadingAreas}
                        error={Boolean(formik.errors.IdKhuVuc)}
                        startAdornment={
                          <InputAdornment position="start">
                            <LocationOn className="field-icon" />
                          </InputAdornment>
                        }
                      >
                        {loadingAreas ? (
                          <MenuItem value="">
                            <CircularProgress size={20} className="loading-spinner" />
                            Đang tải...
                          </MenuItem>
                        ) : (
                          areas.map((area) => (
                            <MenuItem key={area.IdKhuVuc} value={area.IdKhuVuc}>
                              {area.TenKhuVuc}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {formik.touched.IdKhuVuc && formik.errors.IdKhuVuc && (
                        <Typography variant="caption" color="error">
                          {formik.errors.IdKhuVuc}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Contact Information Section */}
              <Box className="form-section">
                <Typography className="form-section-title">
                  Thông tin liên hệ
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} className="form-field-animation">
                    <TextField
                      fullWidth
                      id="Email"
                      name="Email"
                      label="Email"
                      type="email"
                      className="custom-textfield"
                      value={formik.values.Email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.Email && Boolean(formik.errors.Email)}
                      helperText={formik.touched.Email && formik.errors.Email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email className="field-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} className="form-field-animation">
                    <TextField
                      fullWidth
                      id="SoDienThoai"
                      name="SoDienThoai"
                      label="Số điện thoại"
                      type="tel"
                      className="custom-textfield"
                      value={formik.values.SoDienThoai}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.SoDienThoai &&
                        Boolean(formik.errors.SoDienThoai)
                      }
                      helperText={
                        formik.touched.SoDienThoai && formik.errors.SoDienThoai
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone className="field-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Account Information Section */}
              <Box className="form-section">
                <Typography className="form-section-title">
                  Thông tin tài khoản
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} className="form-field-animation">
                    <FormControl fullWidth className="custom-select">
                      <InputLabel id="VaiTro-label">Vai trò</InputLabel>
                      <Select
                        labelId="VaiTro-label"
                        id="VaiTro"
                        name="VaiTro"
                        label="Vai trò"
                        value={formik.values.VaiTro}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.errors.VaiTro)}
                      >
                        <MenuItem value="Nguoi Dan">
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon fontSize="small" className="field-icon" />
                            Người dân
                          </Box>
                        </MenuItem>
                        {/* <MenuItem value="Nhan Vien">
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon fontSize="small" className="field-icon" />
                            Nhân viên
                          </Box>
                        </MenuItem> */}
                        {/* <MenuItem value="Giam Sat">
                          <Box display="flex" alignItems="center" gap={1}>
                            <AdminPanelSettings fontSize="small" className="field-icon" />
                            Giám sát
                          </Box>
                        </MenuItem> */}
                        {/* <MenuItem value="Quan Tri">
                          <Box display="flex" alignItems="center" gap={1}>
                            <AdminPanelSettings fontSize="small" className="field-icon" />
                            Quản trị
                          </Box>
                        </MenuItem> */}
                      </Select>
                      {formik.touched.VaiTro && formik.errors.VaiTro && (
                        <Typography variant="caption" color="error">
                          {formik.errors.VaiTro}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} className="form-field-animation">
                    <TextField
                      fullWidth
                      id="MatKhau"
                      name="MatKhau"
                      label="Mật khẩu"
                      type={showPassword ? "text" : "password"}
                      className="custom-textfield"
                      value={formik.values.MatKhau}
                      onChange={handlePasswordChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.MatKhau && Boolean(formik.errors.MatKhau)
                      }
                      helperText={formik.touched.MatKhau && formik.errors.MatKhau}
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
                    {formik.values.MatKhau && (
                      <Box className={`password-strength ${passwordStrength.strength}`}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getPasswordStrengthIcon()}
                          <Typography variant="caption">
                            Độ mạnh mật khẩu: {passwordStrength.message}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} className="form-field-animation">
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Xác nhận mật khẩu"
                      type={showConfirmPassword ? "text" : "password"}
                      className="custom-textfield"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.confirmPassword &&
                        Boolean(formik.errors.confirmPassword)
                      }
                      helperText={
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff className="field-icon" />
                              ) : (
                                <Visibility className="field-icon" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* <Grid item xs={12} sm={6} className="form-field-animation">
                    <FormControl fullWidth className="custom-select">
                      <InputLabel id="TrangThai-label">Trạng thái</InputLabel>
                      <Select
                        labelId="TrangThai-label"
                        id="TrangThai"
                        name="TrangThai"
                        label="Trạng thái"
                        value={formik.values.TrangThai}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.errors.TrangThai)}
                      >
                        <MenuItem value="Hoat Dong">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Status fontSize="small" className="field-icon" />
                            Hoạt động
                          </Box>
                        </MenuItem>
                        <MenuItem value="Tam Ngung">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Warning fontSize="small" className="field-icon" />
                            Tạm ngưng
                          </Box>
                        </MenuItem>
                        <MenuItem value="Khoa">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Error fontSize="small" className="field-icon" />
                            Khóa
                          </Box>
                        </MenuItem>
                      </Select>
                      {formik.touched.TrangThai && formik.errors.TrangThai && (
                        <Typography variant="caption" color="error">
                          {formik.errors.TrangThai}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid> */}
                </Grid>
              </Box>
              <br />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Đăng ký tài khoản"
                )}
              </Button>

              <Grid container justifyContent="center">
                <Grid item>
                  <Link
                    component={RouterLink}
                    to="/login"
                    className="login-link"
                  >
                    Đã có tài khoản? Đăng nhập ngay
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default SignUpPage;
