import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";


const isVideoUrl = (url) => {
  const videoExtensions = [".mp4", ".webm", ".m3u8"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

// const isVideoUrl = (url) => {
//   return url.endsWith(".mp4") || url.includes("video_feed");
// };

// Styled components (if you keep CameraCard as a separate component or styled below)
const StyledCameraCard = styled(Card)({
  height: "100%", // Ensures all cards in a grid row have the same height
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    cursor: "pointer",
  },
});


const CameraCard = ({ camera }) => {
  const navigate = useNavigate();
  const src = `http://${camera.IpCamera}`;

  return (
    // <Card sx={{ mb: 2 }}>
    <StyledCameraCard
      // sx={{ mb: 2, cursor: "pointer" }}
      onClick={() => navigate(`/showcamera/${camera.IdCamera}`)}
    >
      <Box sx={{ position: "relative", pt: "56.25%" }}>
        {isVideoUrl(src) ? (
          <video
            src={src}
            controls
            autoPlay
            muted
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "#f5f5f5",
            }}
            onError={(e) => {
              console.error(`Error loading video from ${src}`, e);
              e.target.src = `${src}?t=${Date.now()}`;
            }}
          />
        ) : (
          <img
            src={src}
            alt={`Camera ${camera.ViTriLapDat}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "#f5f5f5",
            }}
            onError={(e) => {
              console.error(`Error loading image from ${src}`, e);
              e.target.src = `${src}?t=${Date.now()}`;
            }}
          />
        )}
      </Box>
      <CardContent>
        <Typography variant="h5">{camera.ViTriLapDat}</Typography>
        <Typography variant="h6">
          Khu vực: {camera.khuvuc?.TenKhuVuc || "Không rõ"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stream Source: {camera.IpCamera}
        </Typography>
        <Typography
          variant="body2"
          color={
            camera.TrangThaiCamera === "Hoat Dong"
              ? "success.main"
              : "error.main"
          }
        >
          Trạng thái: {camera.TrangThaiCamera === "Hoat Dong" ? "Hoạt động" : "Ngừng hoạt động"}
        </Typography>
      </CardContent>
    </StyledCameraCard>
  );
};

export default CameraCard;
