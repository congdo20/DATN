import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <ErrorOutlineIcon
          sx={{ fontSize: 80, color: theme.palette.error.main, mb: 2 }}
        />
        <Typography variant="h3" gutterBottom>
          404 - Không tìm thấy trang
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không
          có sẵn.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Quay về trang chủ
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;