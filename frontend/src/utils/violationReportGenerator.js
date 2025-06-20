// Violation Report Generator Utility
import "../assets/styles/ViolationReport.css";

/**
 * Generate violation report HTML content
 * @param {Object} violation - Violation data object
 * @param {string} apiHost - API host
 * @param {string} apiPort - API port
 * @returns {string} HTML content for the report
 */
export const generateViolationReport = (violation, apiHost, apiPort) => {
  const currentDate = new Date().toLocaleDateString("vi-VN");
  const violationDate = new Date(violation.ThoiGian).toLocaleDateString(
    "vi-VN"
  );
  const violationTime = new Date(violation.ThoiGian).toLocaleTimeString(
    "vi-VN"
  );

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Biên bản vi phạm giao thông</title>
      <link rel="stylesheet" href="data:text/css;base64,${btoa(
        getReportCSS()
      )}">
    </head>
    <body>
      <div class="report-container">
        <div class="header">
          <h1>Biên bản vi phạm giao thông</h1>
          <p>Hệ thống giám sát giao thông thông minh</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>Thông tin vi phạm</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Mã vi phạm:</span>
                <span class="info-value">${violation.IdPhatHien}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Ngày vi phạm:</span>
                <span class="info-value">${violationDate}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Thời gian:</span>
                <span class="info-value">${violationTime}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Vị trí:</span>
                <span class="info-value">${
                  violation.ViTri || "Không xác định"
                }</span>
              </div>
              <div class="info-item">
                <span class="info-label">Loại vi phạm:</span>
                <span class="info-value">${
                  violation.danhmuc?.LoaiViPham || "Không xác định"
                }</span>
              </div>
              <div class="info-item">
                <span class="info-label">Mức phạt:</span>
                <span class="info-value">${
                  violation.danhmuc?.MucPhat || "0"
                } VNĐ</span>
              </div>
              <div class="info-item">
                <span class="info-label">Trạng thái:</span>
                <span class="info-value">
                  <span class="status-badge ${getStatusClass(
                    violation.TrangThai
                  )}">
                    ${getStatusDisplay(violation.TrangThai)}
                  </span>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Camera:</span>
                <span class="info-value">${
                  violation.anh?.camera?.IpCamera || "Không xác định"
                }</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Thông tin phương tiện</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Biển số:</span>
                <span class="info-value">${
                  violation.phuongtien?.BienSo || "Không xác định"
                }</span>
              </div>
              <div class="info-item">
                <span class="info-label">Chủ sở hữu:</span>
                <span class="info-value">${
                  violation.phuongtien?.ChuSoHuu || "Không xác định"
                }</span>
              </div>
              <div class="info-item">
                <span class="info-label">Loại xe:</span>
                <span class="info-value">${
                  violation.phuongtien?.KieuXe || "Không xác định"
                }</span>
              </div>
              <div class="info-item">
                <span class="info-label">Màu sắc:</span>
                <span class="info-value">${
                  violation.phuongtien?.MauSac || "Không xác định"
                }</span>
              </div>
            </div>
          </div>
          
          ${
            violation.anh?.DuongDan
              ? `
          <div class="section">
            <h2>Hình ảnh vi phạm</h2>
            <div class="image-section">
              <img src="${getImageUrl(
                violation.anh.DuongDan,
                apiHost,
                apiPort
              )}" 
                   alt="Hình ảnh vi phạm" 
                   class="violation-image"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
              <p style="display:none; color:#666; font-style:italic;">Không thể hiển thị hình ảnh</p>
            </div>
          </div>
          `
              : ""
          }
          
          <div class="section">
            <h2>Thông tin khu vực</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Khu vực:</span>
                <span class="info-value">${
                  violation.anh?.camera?.khuvuc?.TenKhuVuc || "Không xác định"
                }</span>
              </div>
              <div class="info-item">
                <span class="info-label">Ngày tạo biên bản:</span>
                <span class="info-value">${currentDate}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="signature-section">
            <div class="signature-box">
              <p><strong>Người vi phạm</strong></p>
              <div class="signature-line"></div>
              <p>(Ký, ghi rõ họ tên)</p>
            </div>
            <div class="signature-box">
              <p><strong>Cán bộ xử lý</strong></p>
              <div class="signature-line"></div>
              <p>(Ký, ghi rõ họ tên)</p>
            </div>
          </div>
          <p style="margin-top: 30px; color: #666; font-size: 0.9rem;">
            Biên bản này được tạo tự động bởi hệ thống giám sát giao thông thông minh
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Get status display text
 * @param {string} status - Status code
 * @returns {string} Display text
 */
export const getStatusDisplay = (status) => {
  switch (status) {
    case "Chua Xu Ly":
      return "Chưa xử lý";
    case "Da Xu Ly":
      return "Đã xử lý";
    case "Huy":
      return "Đã hủy";
    default:
      return status;
  }
};

/**
 * Get status class for CSS
 * @param {string} status - Status code
 * @returns {string} CSS class name
 */
export const getStatusClass = (status) => {
  switch (status) {
    case "Chua Xu Ly":
      return "status-pending";
    case "Da Xu Ly":
      return "status-completed";
    case "Huy":
      return "status-cancelled";
    default:
      return "status-pending";
  }
};

/**
 * Get image URL
 * @param {string} imagePath - Image path
 * @param {string} apiHost - API host
 * @param {string} apiPort - API port
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath, apiHost, apiPort) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `http://${apiHost}:${apiPort}${imagePath}`;
};

/**
 * Validate image URL
 * @param {string} url - URL to validate
 * @param {string} apiHost - API host
 * @param {string} apiPort - API port
 * @returns {boolean} Is valid URL
 */
export const isValidImageUrl = (url, apiHost, apiPort) => {
  if (!url) return false;
  try {
    const urlObj = new URL(url, `http://${apiHost}:${apiPort}`);
    return urlObj.pathname && urlObj.pathname.length > 0;
  } catch {
    return false;
  }
};

/**
 * Get CSS content for the report
 * @returns {string} CSS content
 */
const getReportCSS = () => {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Roboto', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .report-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #084bd1 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .header p {
      font-size: 1.1rem;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section h2 {
      color: #2c3e50;
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #667eea;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .info-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }
    
    .info-label {
      font-weight: 600;
      color: #2c3e50;
      min-width: 120px;
      margin-right: 15px;
    }
    
    .info-value {
      color: #34495e;
      flex: 1;
    }
    
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-pending {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }
    
    .status-completed {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .status-cancelled {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .image-section {
      text-align: center;
      margin: 30px 0;
    }
    
    .violation-image {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      border: 2px solid #ddd;
    }
    
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #dee2e6;
    }
    
    .signature-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 40px;
    }
    
    .signature-box {
      text-align: center;
      padding: 20px;
      border: 2px dashed #ddd;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 120px;
    }
    
    .signature-line {
      width: 200px;
      height: 2px;
      background: #333;
      margin: 20px auto 10px;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .report-container {
        box-shadow: none;
        border-radius: 0;
      }
      
      .header {
        background: #667eea !important;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      
      .section {
        page-break-inside: avoid;
      }
      
      .info-item {
        page-break-inside: avoid;
      }
      
      .image-section {
        page-break-inside: avoid;
      }
      
      .footer {
        page-break-inside: avoid;
      }
      
      .info-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .signature-section {
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        margin-top: 50px;
      }
      
      .signature-box {
        border: 2px dashed #333;
        min-height: 100px;
      }
      
      .signature-line {
        width: 180px;
      }
    }
    
    @media (max-width: 768px) {
      body {
        padding: 10px;
      }
      
      .header {
        padding: 20px;
      }
      
      .header h1 {
        font-size: 1.5rem;
      }
      
      .content {
        padding: 20px;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
      
      .signature-section {
        grid-template-columns: 1fr;
        gap: 20px;
        margin-top: 30px;
      }
      
      .signature-box {
        min-height: 100px;
        padding: 15px;
      }
      
      .signature-line {
        width: 150px;
      }
    }
  `;
};
