import React, { useEffect, useState } from "react";
import "../../../assets/styles/ViolationsPage.css"; // Import your CSS file for styling
import { height, textAlign } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { generateReport, exportViolationsAsCSV } from "../../../services/reportService";
import { getStatusDisplay, getStatusClass, getImageUrl, isValidImageUrl } from "../../../utils/violationReportGenerator";


const ViolationsPageUser = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [cameraId, setCameraId] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [violationList, setViolationList] = useState([]); // Original data
  const [filteredViolations, setFilteredViolations] = useState([]); // Filtered data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  // const API_HOST = process.env.REACT_APP_API_HOST;
  // const API_PORT = process.env.REACT_APP_API_PORT;
  const apiHost = process.env.REACT_APP_API_HOST;
  const apiPort = process.env.REACT_APP_API_PORT;

  useEffect(() => {
    fetchViolationData();
  }, []);

  // Fetch violation data from API
  const fetchViolationData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        // `http://${API_HOST}:${API_PORT}/violations/get`
        `http://${apiHost}:${apiPort}/violations/get`
        // `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/violations/get`
        // "http://127.0.0.1:8000/violations/get"
      );
      setViolationList(response.data);
      setFilteredViolations(response.data); // Initially show all data
    } catch (error) {
      console.error("Error fetching violation data:", error);
      setError("Không thể tải dữ liệu vi phạm. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter violations based on search criteria
  const filterViolations = () => {
    let filtered = [...violationList];

    // Filter by date range
    if (fromDate) {
      filtered = filtered.filter(violation => {
        const violationDate = new Date(violation.ThoiGian);
        const fromDateObj = new Date(fromDate);
        return violationDate >= fromDateObj;
      });
    }

    if (toDate) {
      filtered = filtered.filter(violation => {
        const violationDate = new Date(violation.ThoiGian);
        const toDateObj = new Date(toDate);
        toDateObj.setHours(23, 59, 59, 999); // End of day
        return violationDate <= toDateObj;
      });
    }

    // Filter by license plate
    if (licensePlate.trim()) {
      filtered = filtered.filter(violation =>
        violation.phuongtien?.BienSo?.toLowerCase().includes(licensePlate.toLowerCase())
      );
    }

    // Filter by camera ID
    if (cameraId.trim()) {
      filtered = filtered.filter(violation =>
        violation.anh?.camera?.IdCamera?.toString().includes(cameraId) ||
        violation.anh?.camera?.IpCamera?.toLowerCase().includes(cameraId.toLowerCase())
      );
    }

    // Filter by vehicle type
    if (vehicleType) {
      filtered = filtered.filter(violation =>
        violation.phuongtien?.KieuXe?.toLowerCase().includes(vehicleType.toLowerCase())
      );
    }

    setFilteredViolations(filtered);
    
    // Reset selected violation if it's not in filtered results
    if (selectedViolation && !filtered.find(v => v.IdPhatHien === selectedViolation.IdPhatHien)) {
      setSelectedViolation(filtered.length > 0 ? filtered[0] : null);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    filterViolations();
  };

  // Handle reset filters
  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setLicensePlate("");
    setCameraId("");
    setVehicleType("");
    setFilteredViolations(violationList);
    setSelectedViolation(violationList.length > 0 ? violationList[0] : null);
  };

  // Handle create record
  const handleCreateRecord = (format = 'print') => {
    const result = generateReport(selectedViolation, format, apiHost, apiPort);
    
    if (result.success) {
      setSuccessMessage(result.message);
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } else {
      setError(result.message);
    }
  };

  // Handle export report
  const handleExportReport = () => {
    const result = exportViolationsAsCSV(filteredViolations);
    
    if (result.success) {
      setSuccessMessage(result.message);
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } else {
      setError(result.message);
    }
  };

  // Handle violation selection
  const handleViolationSelect = (violation) => {
    setSelectedViolation(violation);
    setImageError(false); // Reset image error when selecting new violation
  };

  const displayedViolation = selectedViolation || (filteredViolations.length > 0 ? filteredViolations[0] : null);

  return (
    <div>
      <div className="violation-lookup-container">
        <h1>TRA CỨU VI PHẠM</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="from-date">Từ ngày:</label>
            <input
              type="date"
              id="from-date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="to-date">Đến ngày:</label>
            <input
              type="date"
              id="to-date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="license-plate">Biển số xe:</label>
            <input
              type="text"
              id="license-plate"
              placeholder="Nhập biển số"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="camera-id">Camera:</label>
            <input
              type="text"
              id="camera-id"
              placeholder="Nhập ID hoặc IP camera"
              value={cameraId}
              onChange={(e) => setCameraId(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="vehicle-type">Loại xe:</label>
            <select
              id="vehicle-type"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="ô tô">Ô tô</option>
              <option value="xe máy">Xe máy</option>
              <option value="xe tải">Xe tải</option>
              <option value="xe khách">Xe khách</option>
            </select>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="primary" onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
        <button className="secondary" onClick={handleReset}>
          Đặt lại
        </button>
        {/* <button 
          className="secondary" 
          onClick={handleExportReport}
          disabled={filteredViolations.length === 0}
        >
          Xuất báo cáo ({filteredViolations.length})
        </button>
        <div style={{ flexGrow: 1 }}></div>
        <div className="report-buttons">
          <button 
            className="primary" 
            onClick={() => handleCreateRecord()}
            disabled={!selectedViolation}
          >
            In biên bản
          </button>
          <button 
            className="secondary" 
            onClick={() => handleCreateRecord('pdf')}
            disabled={!selectedViolation}
          >
            Xuất PDF
          </button>
          <button 
            className="secondary" 
            onClick={() => handleCreateRecord('html')}
            disabled={!selectedViolation}
          >
            Lưu HTML
          </button>
        </div> */}
      </div>

      <div className="container">
        <div className="violation-details">
          <h2>Thông tin chi tiết về vi phạm</h2>
          {displayedViolation ? (
            <>
              <p>
                <strong>Thời gian vi phạm:</strong>{" "}
                {new Date(displayedViolation.ThoiGian).toLocaleString('vi-VN')}
              </p>
              <p>
                <strong>Vị trí:</strong> {displayedViolation.ViTri}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span className={getStatusClass(displayedViolation.TrangThai)}>
                  {getStatusDisplay(displayedViolation.TrangThai)}
                </span>
              </p>
              <p>
                <strong>Loại vi phạm:</strong>{" "}
                {displayedViolation.danhmuc?.LoaiViPham}
              </p>
              <p>
                <strong>Mức phạt:</strong>{" "}
                {displayedViolation.danhmuc?.MucPhat?.toLocaleString("vi-VN")}{" "}
                VNĐ
              </p>
              <p>
                <strong>Chủ xe:</strong>{" "}
                {displayedViolation.phuongtien?.ChuSoHuu}
              </p>
              <p>
                <strong>Biển số:</strong>{" "}
                {displayedViolation.phuongtien?.BienSo}
              </p>
              <p>
                <strong>Loại xe:</strong>{" "}
                {displayedViolation.phuongtien?.KieuXe}
              </p>
              <p>
                <strong>Màu sắc:</strong>{" "}
                {displayedViolation.phuongtien?.MauSac}
              </p>
              <p>
                <strong>Camera:</strong>{" "}
                {displayedViolation.anh?.camera?.IpCamera}
              </p>
              <p>
                <strong>Khu vực:</strong>{" "}
                {displayedViolation.anh?.camera?.khuvuc?.TenKhuVuc}
              </p>
            </>
          ) : (
            <p>Không có dữ liệu vi phạm nào.</p>
          )}
        </div>

        <div className="violation-image">
          <h2>Hình ảnh vi phạm</h2>
          {displayedViolation?.anh?.DuongDan && isValidImageUrl(displayedViolation.anh.DuongDan, apiHost, apiPort) ? (
            <div className="image-container">
              {!imageError ? (
                <img
                  style={{ width: 400, height: 300, objectFit: "cover" }}
                  src={getImageUrl(displayedViolation.anh.DuongDan, apiHost, apiPort)}
                  alt="Hình ảnh vi phạm"
                  onError={(e) => {
                    setImageError(true);
                    console.error("Image load error:", e.target.src);
                  }}
                  onLoad={() => {
                    setImageError(false);
                  }}
                />
              ) : (
                <div className="image-error">
                  <p>Không thể tải hình ảnh vi phạm</p>
                  <p className="error-details">Đường dẫn: {displayedViolation.anh.DuongDan}</p>
                  <button 
                    className="retry-button"
                    onClick={() => {
                      setImageError(false);
                      // Force re-render by updating the src
                      const img = document.querySelector('.violation-image img');
                      if (img) {
                        img.src = img.src + '?t=' + new Date().getTime();
                      }
                    }}
                  >
                    Thử lại
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="image-error">
              <p>Không có hình ảnh vi phạm</p>
              {displayedViolation?.anh?.DuongDan && (
                <p className="error-details">Đường dẫn không hợp lệ: {displayedViolation.anh.DuongDan}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="violation-list-container">
        <div className="list-header">
          <h3>Danh sách vi phạm ({filteredViolations.length} kết quả)</h3>
        </div>
        
        {filteredViolations.length === 0 ? (
          <div className="no-results">
            <p>Không tìm thấy vi phạm nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          <table className="violation-list">
            <thead>
              <tr>
                <th>ID Vi phạm</th>
                <th>Vị trí</th>
                <th>ID Camera</th>
                <th>IP Camera</th>
                <th>Thời gian</th>
                <th>Loại vi phạm</th>
                <th>Mức phạt</th>
                <th>Biển số</th>
                <th>Chủ sở hữu</th>
                <th>Loại xe</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map((violation) => (
                <tr
                  key={violation.IdPhatHien}
                  className={
                    selectedViolation?.IdPhatHien === violation.IdPhatHien
                      ? "highlighted-row"
                      : ""
                  }
                  onClick={() => handleViolationSelect(violation)}
                >
                  <td>{violation.IdPhatHien}</td>
                  <td>{violation.ViTri}</td>
                  <td>{violation.anh?.camera?.IdCamera}</td>
                  <td>{violation.anh?.camera?.IpCamera}</td>
                  <td>{new Date(violation.ThoiGian).toLocaleString('vi-VN')}</td>
                  <td>{violation.danhmuc?.LoaiViPham}</td>
                  <td>{violation.danhmuc?.MucPhat?.toLocaleString("vi-VN")} VNĐ</td>
                  <td>{violation.phuongtien?.BienSo}</td>
                  <td>{violation.phuongtien?.ChuSoHuu}</td>
                  <td>{violation.phuongtien?.KieuXe}</td>
                  <td>
                    <span className={getStatusClass(violation.TrangThai)}>
                      {getStatusDisplay(violation.TrangThai)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViolationsPageUser;
