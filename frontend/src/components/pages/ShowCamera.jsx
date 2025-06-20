import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { 
  ArrowBack, 
  LocationOn, 
  CalendarToday, 
  Build, 
  SignalCellular4Bar,
  SignalCellular0Bar,
  Warning
} from "@mui/icons-material";
import "../../assets/styles/ShowCamera.css";

const isVideoUrl = (url) => {
  const videoExtensions = [".mp4", ".webm", ".m3u8"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

const isImageUrl = (url) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

const isStreamUrl = (url) => {
  const streamPatterns = [
    "/video_feed",
    "/stream",
    "/live",
    "/mjpeg",
    "/h264",
    "rtsp://",
    "rtmp://",
    "http://",
    "https://"
  ];
  return streamPatterns.some(pattern => url.toLowerCase().includes(pattern));
};

const getMediaType = (url) => {
  if (!url) return 'none';
  if (isVideoUrl(url)) return 'video';
  if (isImageUrl(url)) return 'image';
  if (isStreamUrl(url)) return 'stream';
  return 'unknown';
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Hoat Dong":
      return <SignalCellular4Bar />;
    case "Khong Hoat Dong":
      return <SignalCellular0Bar />;
    case "Bao Tri":
      return <Build />;
    default:
      return <Warning />;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Hoat Dong":
      return "active";
    case "Khong Hoat Dong":
      return "inactive";
    case "Bao Tri":
      return "maintenance";
    default:
      return "inactive";
  }
};

const ShowCamera = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiHost = process.env.REACT_APP_API_HOST || "127.0.0.1";
  const apiPort = process.env.REACT_APP_API_PORT || "8000";

  useEffect(() => {
    const fetchCamera = async () => {
      try {
        const res = await fetch(
          `http://${apiHost}:${apiPort}/cameras/get/id/${id}`
        );
        if (!res.ok) throw new Error("Không thể tải thông tin camera");
        const data = await res.json();
        setCamera(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCamera();
  }, [id, apiHost, apiPort]);

  if (loading) {
    return (
      <div className="show-camera-container">
        <div className="loading-container">
          <CircularProgress size={60} style={{ color: '#667eea' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="show-camera-container">
        <div className="error-container">
          <Typography variant="h6" color="error">
            Lỗi: {error}
          </Typography>
        </div>
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="show-camera-container">
        <div className="not-found-container">
          <Typography variant="h6">
            Không tìm thấy camera
          </Typography>
        </div>
      </div>
    );
  }

  const src = `http://${camera.IpCamera}`;
  const mediaType = getMediaType(camera.IpCamera);

  return (
    <div className="show-camera-container">
      <div className="show-camera-header">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
          className="back-button"
        >
          Quay lại
        </Button>

        <Typography variant="h4" className="camera-title">
          Camera #{camera.IdCamera}
        </Typography>
      </div>

      <Card className="camera-video-card">
        <div className="camera-video-container">
          {camera.IpCamera ? (
            (() => {
              switch (mediaType) {
                case 'video':
                  return (
                    <video
                      src={src}
                      controls
                      autoPlay
                      muted
                      onError={(e) => {
                        console.error(`Error loading video from ${src}`, e);
                        e.target.src = `${src}?t=${Date.now()}`;
                      }}
                    />
                  );
                
                case 'image':
                case 'stream':
                  return (
                    <img
                      src={src}
                      alt={`Camera ${camera.ViTriLapDat}`}
                      onError={(e) => {
                        console.error(`Error loading image from ${src}`, e);
                        e.target.src = `${src}?t=${Date.now()}`;
                      }}
                    />
                  );
                
                default:
                  return (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '1.1rem'
                    }}>
                      Không hỗ trợ định dạng này
                    </div>
                  );
              }
            })()
          ) : (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '1.1rem'
            }}>
              Không có stream
            </div>
          )}
        </div>
        
        <div className="camera-info-section">
          <div className="camera-info-grid">
            <div className="camera-info-item">
              <div className="camera-info-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
                <LocationOn />
              </div>
              <div className="camera-info-content">
                <div className="camera-info-label">Vị trí</div>
                <div className="camera-info-value">{camera.ViTriLapDat}</div>
              </div>
            </div>

            <div className="camera-info-item">
              <div className="camera-info-icon" style={{ background: '#f3e5f5', color: '#7b1fa2' }}>
                <LocationOn />
              </div>
              <div className="camera-info-content">
                <div className="camera-info-label">Khu vực</div>
                <div className="camera-info-value">{camera.khuvuc?.TenKhuVuc || "Không rõ"}</div>
              </div>
            </div>

            <div className="camera-info-item">
              <div className="camera-info-icon" style={{ background: '#e8f5e8', color: '#388e3c' }}>
                <CalendarToday />
              </div>
              <div className="camera-info-content">
                <div className="camera-info-label">Ngày lắp đặt</div>
                <div className="camera-info-value">{camera.NgayLapDat}</div>
              </div>
            </div>

            <div className="camera-info-item">
              <div className="camera-info-icon" style={{ background: '#fff3e0', color: '#f57c00' }}>
                <Build />
              </div>
              <div className="camera-info-content">
                <div className="camera-info-label">Bảo trì</div>
                <div className="camera-info-value">{camera.BaoTri || "Chưa có thông tin"}</div>
              </div>
            </div>

            <div className="camera-info-item">
              <div className="camera-info-icon" style={{ background: '#fce4ec', color: '#c2185b' }}>
                {getStatusIcon(camera.TrangThaiCamera)}
              </div>
              <div className="camera-info-content">
                <div className="camera-info-label">Trạng thái</div>
                <div className={`camera-status-badge ${getStatusClass(camera.TrangThaiCamera)}`}>
                  {getStatusIcon(camera.TrangThaiCamera)}
                  {camera.TrangThaiCamera === "Hoat Dong" ? "Hoạt động" : "Ngưng hoạt động"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShowCamera;
