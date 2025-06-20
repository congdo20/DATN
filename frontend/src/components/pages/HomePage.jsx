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
// import AreaSelector from "../../components/module/AreaSlector";
// import CameraCard from "../../components/module/CameraCard";

// const HomePage = () => {
//   const [cameras, setCameras] = useState([]);
//   const [filteredCameras, setFilteredCameras] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedArea, setSelectedArea] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const apiHost = process.env.REACT_APP_API_HOST;
//   const apiPort = process.env.REACT_APP_API_PORT;
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

// export default HomePage;
