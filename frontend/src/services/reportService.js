// Report Service for handling report generation and export
import { generateViolationReport } from "../utils/violationReportGenerator";

/**
 * Export violation report as HTML file
 * @param {Object} violation - Violation data
 * @param {string} apiHost - API host
 * @param {string} apiPort - API port
 */
export const exportViolationAsHTML = (violation, apiHost, apiPort) => {
  try {
    const reportContent = generateViolationReport(violation, apiHost, apiPort);
    const blob = new Blob([reportContent], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `bien_ban_vi_pham_${violation.IdPhatHien}_${
        new Date().toISOString().split("T")[0]
      }.html`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { success: true, message: "Đã lưu biên bản dưới dạng file HTML!" };
  } catch (error) {
    console.error("Error exporting HTML:", error);
    return { success: false, message: "Có lỗi xảy ra khi xuất file HTML" };
  }
};

/**
 * Export violation report as PDF (using browser print)
 * @param {Object} violation - Violation data
 * @param {string} apiHost - API host
 * @param {string} apiPort - API port
 */
export const exportViolationAsPDF = (violation, apiHost, apiPort) => {
  try {
    const reportContent = generateViolationReport(violation, apiHost, apiPort);
    const reportWindow = window.open(
      "",
      "_blank",
      "width=800,height=600,scrollbars=yes"
    );
    reportWindow.document.write(reportContent);
    reportWindow.document.close();

    // Wait for content to load then print as PDF
    setTimeout(() => {
      reportWindow.print();
    }, 1000);

    return {
      success: true,
      message:
        "Đã mở cửa sổ xuất PDF. Vui lòng chọn 'Save as PDF' trong hộp thoại in!",
    };
  } catch (error) {
    console.error("Error exporting PDF:", error);
    return { success: false, message: "Có lỗi xảy ra khi xuất PDF" };
  }
};

/**
 * Print violation report
 * @param {Object} violation - Violation data
 * @param {string} apiHost - API host
 * @param {string} apiPort - API port
 */
export const printViolationReport = (violation, apiHost, apiPort) => {
  try {
    const reportContent = generateViolationReport(violation, apiHost, apiPort);
    const reportWindow = window.open(
      "",
      "_blank",
      "width=800,height=600,scrollbars=yes"
    );
    reportWindow.document.write(reportContent);
    reportWindow.document.close();

    // Print the report
    setTimeout(() => {
      reportWindow.print();
    }, 500);

    return { success: true, message: "Đã mở cửa sổ in biên bản!" };
  } catch (error) {
    console.error("Error printing report:", error);
    return { success: false, message: "Có lỗi xảy ra khi in biên bản" };
  }
};

/**
 * Export violations list as CSV
 * @param {Array} violations - Array of violation objects
 */
export const exportViolationsAsCSV = (violations) => {
  try {
    if (violations.length === 0) {
      return { success: false, message: "Không có dữ liệu để xuất báo cáo!" };
    }

    // Create CSV content
    const headers = [
      "ID Vi phạm",
      "Vị trí",
      "ID Camera",
      "IP Camera",
      "Thời gian",
      "Loại vi phạm",
      "Mức phạt",
      "Biển số",
      "Chủ sở hữu",
      "Loại xe",
      "Trạng thái",
    ];

    const csvContent = [
      headers.join(","),
      ...violations.map((violation) =>
        [
          violation.IdPhatHien,
          violation.ViTri,
          violation.anh?.camera?.IdCamera || "",
          violation.anh?.camera?.IpCamera || "",
          violation.ThoiGian,
          violation.danhmuc?.LoaiViPham || "",
          violation.danhmuc?.MucPhat || "",
          violation.phuongtien?.BienSo || "",
          violation.phuongtien?.ChuSoHuu || "",
          violation.phuongtien?.KieuXe || "",
          violation.TrangThai === "Chua Xu Ly"
            ? "Chưa xử lý"
            : violation.TrangThai === "Da Xu Ly"
            ? "Đã xử lý"
            : "Đã hủy",
        ].join(",")
      ),
    ].join("\n");

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `bao_cao_vi_pham_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return {
      success: true,
      message: `Đã xuất báo cáo ${violations.length} vi phạm thành công!`,
    };
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return { success: false, message: "Có lỗi xảy ra khi xuất báo cáo CSV" };
  }
};

/**
 * Main function to handle report generation
 * @param {Object} violation - Violation data
 * @param {string} format - Export format ('print', 'pdf', 'html')
 * @param {string} apiHost - API host
 * @param {string} apiPort - API port
 * @returns {Object} Result object with success status and message
 */
export const generateReport = (
  violation,
  format = "print",
  apiHost,
  apiPort
) => {
  if (!violation) {
    return {
      success: false,
      message: "Vui lòng chọn một vi phạm để tạo biên bản!",
    };
  }

  switch (format) {
    case "html":
      return exportViolationAsHTML(violation, apiHost, apiPort);
    case "pdf":
      return exportViolationAsPDF(violation, apiHost, apiPort);
    case "print":
    default:
      return printViolationReport(violation, apiHost, apiPort);
  }
};
