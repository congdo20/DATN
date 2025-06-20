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
  Link
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AreaSelector from "../../../components/module/AreaSlector";
import "../../../assets/styles/HomePage.css";

const HomePageUser = () => {
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

  // Get status icon and class
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
                      {camera.TrangThaiCamera === "Hoat Dong" ? "Hoạt Động" : "Ngưng Hoạt Động"}
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

export default HomePageUser;

















// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   CardContent,
//   Typography,
//   TextField,
//   CircularProgress,
//   Alert,
//   InputAdornment,
// } from "@mui/material";
// import { Search } from "@mui/icons-material";
// import AreaSelector from "../../../components/module/AreaSlector";
// import CameraCard from "../../../components/module/CameraCard";

// const HomePageAdmin = () => {
//   const [cameras, setCameras] = useState([]);
//   const [filteredCameras, setFilteredCameras] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedArea, setSelectedArea] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const apiHost = process.env.REACT_APP_API_HOST;
//   const apiPort = process.env.REACT_APP_API_PORT;
//   // Fetch camera list from API when component mounts
//   useEffect(() => {
//     const fetchCameras = async () => {
//       try {
//         setLoading(true);
//         // Call the FastAPI backend API
//         // const res = await fetch("http://127.0.0.1:8000/cameras/get");
//         const res = await fetch(
//           // `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/cameras/get`
//           `http://${apiHost}:${apiPort}/cameras/get`
//         );
//         if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
//         const data = await res.json();
//         setCameras(data);
//         setFilteredCameras(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCameras();
//   }, []);

//   useEffect(() => {
//     const results = cameras.filter((cam) => {
//       const matchSearch = cam.ViTriLapDat.toLowerCase().includes(
//         searchQuery.toLowerCase()
//       );
//       const matchArea =
//         selectedArea === "all" || cam.khuvuc?.TenKhuVuc === selectedArea;
//       return matchSearch && matchArea;
//     });
//     setFilteredCameras(results);
//   }, [searchQuery, selectedArea, cameras]);

//   if (loading)
//     return <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />;
//   if (error) return <Alert severity="error">Error: {error}</Alert>;

//   return (
//     <div>
//       <h1 style={{ textAlign: "center", marginTop: "20px" }}>
//         Danh Sách Camera
//       </h1>
//       <Box sx={{ p: 3 }}>
//         <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
//           {/* Search input */}
//           {/* <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Tìm kiếm camera theo vị trí..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             // InputProps={{
//             //   startAdornment: (
//             //     <IconButton>
//             //       <Search />
//             //     </IconButton>
//             //   ),
//             // }}
//             slotProps={{
//               input: {
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search />
//                   </InputAdornment>
//                 ),
//               },
//             }}
//           /> */}
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Tìm kiếm camera theo vị trí..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           {/* Area filter select */}
//           {/* <FormControl sx={{ minWidth: 200 }}>
//             <InputLabel id="area-select-label">Khu vực</InputLabel>
//             <Select
//               labelId="area-select-label"
//               value={selectedArea}
//               label="Khu vực"
//               onChange={(e) => setSelectedArea(e.target.value)}
//             >
//               <MenuItem value="all">Tất cả khu vực</MenuItem>
//               {[
//                 ...new Set(
//                   cameras
//                     .map((c) => c.KhuVuc?.TenKhuVuc)
//                     .filter((area) => area != null)
//                 ),
//               ].map((area) => (
//                 <MenuItem key={area} value={area}>
//                   {area}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl> */}
//           {/* <AreaSelector
//             cameras={cameras}
//             onAreaChange={(selectedArea) => {
//               console.log("Selected area:", selectedArea);
//               // Xử lý khi khu vực thay đổi
//             }}
//           /> */}
//           <AreaSelector
//             cameras={cameras}
//             onAreaChange={(selectedAreaObj) => {
//               if (selectedAreaObj) {
//                 setSelectedArea(selectedAreaObj.TenKhuVuc); // lọc theo tên khu vực
//               } else {
//                 setSelectedArea("all");
//               }
//             }}
//           />
//         </Box>

//         <Grid container spacing={3} alignItems="stretch">
//           {filteredCameras.length === 0 ? (
//             <Typography variant="body1" sx={{ m: 3 }}>
//               Không tìm thấy camera phù hợp.
//             </Typography>
//           ) : (
//             filteredCameras.map((camera) => (
//               <Grid item xs={12} sm={6} md={4} key={camera.IdCamera}>
//                 <CameraCard camera={camera}>
//                   <Box sx={{ position: "relative", pt: "56.25%" }}>
//                     {/* <CardMedia
//                       component="img"
//                       // CORRECTED: Use camera.IpCamera (which now holds the full stream URL)
//                       src={`http://${camera.IpCamera}`}
//                       alt={`Camera ${camera.ViTriLapDat}`}
//                       sx={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                         bgcolor: "#f5f5f5",
//                       }}
//                       // Auto-retry on error
//                       onError={(e) => {
//                         console.error(
//                           `Error loading camera stream ${camera.IdCamera} from ${camera.IpCamera}:`,
//                           e
//                         );
//                         // Add a random parameter to force browser reload
//                         setTimeout(() => {
//                           e.target.src = `${camera.IpCamera}&t=${Date.now()}`;
//                         }, 1000);
//                       }}
//                     /> */}
//                     {/* <video
//                       src={`http://${camera.IpCamera}`} // Ví dụ: http://192.168.1.10:8080/video
//                       controls
//                       autoPlay
//                       muted
//                       style={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                         backgroundColor: "#f5f5f5",
//                       }}
//                       onError={(e) => {
//                         console.error(
//                           `Error loading camera stream ${camera.IdCamera}:`,
//                           e
//                         );
//                         setTimeout(() => {
//                           e.target.src = `http://${
//                             camera.IpCamera
//                           }?t=${Date.now()}`;
//                         }, 1000);
//                       }}
//                     /> */}
//                   </Box>
//                   <CardContent>
//                     <Typography variant="h6">{camera.ViTriLapDat}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {/* You can display the original IP if needed,
//                           but the stream source is now camera.IpCamera itself */}
//                       Stream Source: {camera.IpCamera}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       color={
//                         camera.TrangThaiCamera === "Hoat Dong"
//                           ? "success.main"
//                           : "error.main"
//                       }
//                     >
//                       Trạng thái: {camera.TrangThaiCamera}
//                     </Typography>
//                   </CardContent>
//                 </CameraCard>
//               </Grid>
//             ))
//           )}
//         </Grid>
//       </Box>
//     </div>
//   );
// };

// export default HomePageAdmin;
