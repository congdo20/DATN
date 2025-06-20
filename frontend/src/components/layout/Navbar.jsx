import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  VideoSettings as SettingsVideoCameraIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext"; // Giả sử bạn có AuthContext để quản lý đăng nhập

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const role = user?.VaiTro;
  const isAdmin = role === "Quan Tri" || role === "Giam Sat";
  const homePath = isAdmin ? "/admin/home" : "/user/home";
  const violationPath = isAdmin ? "/admin/violations" : "/user/violations";

  const menuItems = [
    { label: "Trang Chủ", path: isLoggedIn ? homePath : "/login" },
    { label: "Tra Cứu Vi Phạm", path: isLoggedIn ? violationPath : "/login" },
    {
      label: "Tìm Kiếm Phương Tiện",
      path: isLoggedIn ? "/vehicles" : "/login",
    },
    { label: "Tìm Kiếm Người", path: isLoggedIn ? "/persons" : "/login" },
    {
      label: "Tình Trạng Giao Thông",
      path: isLoggedIn ? "/traffic" : "/login",
    },
    { label: "Thống Kê", path: isLoggedIn ? "/analytics" : "/login" },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); // Gọi từ AuthContext
    navigate("/login");
    handleClose();
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#296aec" }} elevation={1}>
      {/* <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}> */}
      <Toolbar sx={{ position: "relative", justifyContent: "center" }}>
        <Typography
          variant="h3"
          // sx={{
          //   fontWeight: "bold",
          //   cursor: "pointer",
          //   "&:hover": { opacity: 0.9 },
          // }}
          sx={{
            position: "absolute",
            left: 16,
            fontWeight: "bold",
            cursor: "pointer",
            "&:hover": { opacity: 0.9 },
          }}
          onClick={() =>
            navigate(
              isLoggedIn ? (isAdmin ? "/admin/home" : "/user/home") : "/login"
            )
          }
        >
          SmartCity
        </Typography>

        {/* Menu chính */}
        {!isMobile ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  fontWeight:
                    location.pathname === item.path ? "bold" : "normal",
                  borderBottom:
                    location.pathname === item.path
                      ? "2px solid white"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        ) : (
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Avatar người dùng */}
        {isLoggedIn && (
          // <Box>
          //   <Avatar
          //     alt="User"
          //     src="/pictures/download.png"
          //     // src="../../assets/images/download.png"
          //     sx={{
          //       cursor: "pointer",
          //       transition: "0.3s",
          //       "&:hover": { opacity: 0.8 },
          //     }}
          <Box sx={{ position: "absolute", right: 16 }}>
            <Avatar
              alt="User"
              src="/pictures/download.png"
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { opacity: 0.8 },
              }}
              onClick={handleAvatarClick}
            />

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/accountsetting");
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                Cài đặt tài khoản
              </MenuItem>

              {isAdmin && (
                <MenuItem
                  onClick={() => {
                    navigate("/accountmanage");
                    handleClose();
                  }}
                >
                  <ListItemIcon>
                    <SettingsVideoCameraIcon fontSize="small" />
                  </ListItemIcon>
                  Quản trị tài khoản
                </MenuItem>
              )}

              {isAdmin && (
                <MenuItem
                  onClick={() => {
                    navigate("/cameramanage");
                    handleClose();
                  }}
                >
                  <ListItemIcon>
                    <SettingsVideoCameraIcon fontSize="small" />
                  </ListItemIcon>
                  Quản trị camera
                </MenuItem>
              )}

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>

      {/* Drawer cho mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map((item) => (
              // <ListItem
              //   button
              //   key={item.path}
              //   onClick={() => handleMenuClick(item.path)}
              // >
              //   <ListItemText primary={item.label} />
              // </ListItem>
              <ListItem
                button
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => handleMenuClick(item.path)}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
