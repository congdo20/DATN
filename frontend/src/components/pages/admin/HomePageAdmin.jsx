import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import { 
  Search, 
  Videocam, 
  VideocamOff, 
  Build,
  SignalCellular4Bar,
  SignalCellular0Bar,
  Warning,
  Visibility,
  LocationOn,
  Link,
  ReportProblem
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AreaSelector from "../../../components/module/AreaSlector";
import "../../../assets/styles/HomePage.css";

const HomePageAdmin = () => {
  const [cameras, setCameras] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiHost = process.env.REACT_APP_API_HOST;
  const apiPort = process.env.REACT_APP_API_PORT;

  // Fetch camera list from API when component mounts
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoading(true);
        // Call the FastAPI backend API
        // const res = await fetch("http://127.0.0.1:8000/cameras/get");
        const res = await fetch(
          // `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/cameras/get`
          `http://${apiHost}:${apiPort}/cameras/get`
        );
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        const data = await res.json();
        setCameras(data);
        setFilteredCameras(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCameras();
  }, []);

  useEffect(() => {
    const results = cameras.filter((cam) => {
      const matchSearch = cam.ViTriLapDat.toLowerCase().includes(
        searchQuery.toLowerCase()
      );
      const matchArea =
        selectedArea === "all" || cam.khuvuc?.TenKhuVuc === selectedArea;
      return matchSearch && matchArea;
    });
    setFilteredCameras(results);
  }, [searchQuery, selectedArea, cameras]);

  // Calculate quick statistics
  const totalCameras = cameras.length;
  const activeCameras = cameras.filter(cam => cam.TrangThaiCamera === "Hoat Dong").length;
  const availableAreas = [...new Set(cameras.map(cam => cam.khuvuc?.TenKhuVuc).filter(Boolean))].length;


  const statusLabelMap = {
  "Hoat Dong": "Hoạt Động",
  "Khong Hoat Dong": "Không Hoạt Động",
  "Hu Hong": "Hư Hỏng",
  "Bao Tri": "Bảo Trì"
  };

  const label = statusLabelMap[cameras.TrangThaiCamera] || "Không xác định";

  // Get status icon and class
  const getStatusIcon = (status) => {
    switch (status) {
      case "Hoat Dong":
        return <SignalCellular4Bar color="success" />;
      case "Khong Hoat Dong":
        return <SignalCellular0Bar color="disabled"/>;
      case "Hu Hong":
        return <ReportProblem color="error"/>;
      case "Bao Tri":
        return <Build color="warning"/>;
      default:
        return <Warning color="action"/>;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Hoat Dong":
        return "active";
      case "Khong Hoat Dong":
        return "inactive";
      case "Hu Hong":
        return "broken"
      case "Bao Tri":
        return "maintenance";
      default:
        return "inactive";
    }
  };


  // Handle camera click
  const handleCameraClick = (cameraId) => {
    navigate(`/showcamera/${cameraId}`);
  };

  const isVideoUrl = (url) => {
    const videoExtensions = [".mp4", ".webm", ".m3u8"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const isImageUrl = (url) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const isStreamUrl = (url) => {
    // Kiểm tra các pattern stream phổ biến
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

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <CircularProgress size={60} style={{ color: 'white' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-container">
          <Typography variant="h6" color="error">
            Lỗi: {error}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Xem Camera Giao Thông</h1>
        {/* <p>Giám sát tình hình giao thông trực tuyến</p> */}
      </div>

      {/* Welcome Section */}
      {/* <div className="welcome-section">
        <div className="welcome-title">
          Chào mừng bạn đến với hệ thống giám sát giao thông
        </div>
        <div className="welcome-text">
          Xem trực tiếp tình hình giao thông từ các camera được lắp đặt tại các điểm nút giao thông quan trọng.
          Sử dụng thanh tìm kiếm và bộ lọc để tìm camera bạn quan tâm.
        </div>
      </div> */}

      {/* Quick Statistics */}
      <div className="quick-stats">
        <div className="quick-stat-card">
          <div className="quick-stat-number">{totalCameras}</div>
          <div className="quick-stat-label">Tổng Camera</div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-number">{activeCameras}</div>
          <div className="quick-stat-label">Đang Hoạt Động</div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-number">{availableAreas}</div>
          <div className="quick-stat-label">Khu Vực</div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-number">{filteredCameras.length}</div>
          <div className="quick-stat-label">Kết Quả Tìm Kiếm</div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="controls-row">
          <div className="search-container">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm camera theo vị trí..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="area-selector-container">
            <AreaSelector
              cameras={cameras}
              onAreaChange={(selectedAreaObj) => {
                if (selectedAreaObj) {
                  setSelectedArea(selectedAreaObj.TenKhuVuc); // lọc theo tên khu vực
                } else {
                  setSelectedArea("all");
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Cameras Grid */}
      {filteredCameras.length === 0 ? (
        <div className="no-cameras">
          <VideocamOff />
          <Typography variant="h6">
            Không tìm thấy camera phù hợp.
          </Typography>
          <Typography variant="body2" style={{ marginTop: 10, opacity: 0.8 }}>
            Thử thay đổi từ khóa tìm kiếm hoặc chọn khu vực khác.
          </Typography>
        </div>
      ) : (
        <div className="cameras-grid">
          {filteredCameras.map((camera) => (
            <div 
              key={camera.IdCamera} 
              className="camera-card"
              onClick={() => handleCameraClick(camera.IdCamera)}
              style={{ cursor: 'pointer' }}
            >
              <div className="camera-video-container">
                {camera.IpCamera ? (
                  (() => {
                    const mediaType = getMediaType(camera.IpCamera);
                    
                    switch (mediaType) {
                      case 'video':
                        return (
                          <video
                            src={`http://${camera.IpCamera}`}
                            className="camera-video"
                            controls
                            autoPlay
                            muted
                            loop
                            onError={(e) => {
                              console.error(
                                `Error loading video stream ${camera.IdCamera}:`,
                                e
                              );
                              setTimeout(() => {
                                e.target.src = `http://${camera.IpCamera}?t=${Date.now()}`;
                              }, 1000);
                            }}
                          />
                        );
                      case 'stream':
                        return (
                          <img
                            src={`http://${camera.IpCamera}`}
                            alt={`Camera Stream ${camera.ViTriLapDat}`}
                            className="camera-video"
                            onError={(e) => {
                              console.error(
                                `Error loading stream ${camera.IdCamera}:`,
                                e
                              );
                              setTimeout(() => {
                                e.target.src = `http://${camera.IpCamera}?t=${Date.now()}`;
                              }, 1000);
                            }}
                          />
                        );
                      
                      case 'image':
                        return (
                          <img
                            src={`http://${camera.IpCamera}`}
                            alt={`Camera ${camera.ViTriLapDat}`}
                            className="camera-video"
                            onError={(e) => {
                              console.error(
                                `Error loading image ${camera.IdCamera}:`,
                                e
                              );
                              setTimeout(() => {
                                e.target.src = `http://${camera.IpCamera}?t=${Date.now()}`;
                              }, 1000);
                            }}
                          />
                        );
                      
                      
                      
                      default:
                        return (
                          <div className="camera-placeholder">
                            <Videocam />
                            <span>Không hỗ trợ định dạng này</span>
                          </div>
                        );
                    }
                  })()
                ) : (
                  <div className="camera-placeholder">
                    <Videocam />
                    <span>Không có stream</span>
                  </div>
                )}
              </div>
              
              <div className="camera-content">
                <div className="camera-title">{camera.ViTriLapDat}</div>
                
                <div className="camera-info">
                  <div className="camera-info-item">
                    <Link style={{ fontSize: '1rem', color: '#667eea' }} />
                    <span className="camera-info-label">IP:</span>
                    <span>{camera.IpCamera || "Không xác định"}</span>
                  </div>
                  <div className="camera-info-item">
                    <LocationOn style={{ fontSize: '1rem', color: '#667eea' }} />
                    <span className="camera-info-label">Khu vực:</span>
                    <span>{camera.khuvuc?.TenKhuVuc || "Không xác định"}</span>
                  </div>
                  <div className="camera-info-item">
                    <Visibility style={{ fontSize: '1rem', color: '#667eea' }} />
                    <span className="camera-info-label">Trạng thái:</span>
                    <div className={`camera-status ${getStatusClass(camera.TrangThaiCamera)}`}>
                      {getStatusIcon(camera.TrangThaiCamera)}
                      {/* {camera.TrangThaiCamera === "Hoat Dong" ? "Hoạt Động" : (camera.TrangThaiCamera === "Ngung Hoat Dong" ? "Ngưng Hoạt Động" : (camera.TrangThaiCamera === "hu Hong" ? "Hư Hỏng" : "Bảo Trì"))} */}
                      {statusLabelMap[camera.TrangThaiCamera] || "Không xác định"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePageAdmin;









