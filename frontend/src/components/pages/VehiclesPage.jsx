import React, { useState } from "react";
import { Button, Input, Spin, message, Card, Row, Col, Radio } from "antd";
import axios from "axios";
import "../../assets/styles/VehiclesPage.css";

const VehiclesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  // const API_BASE_URL = "http://127.0.0.1:8000";
  const apiHost = process.env.REACT_APP_API_HOST;
  const apiPort = process.env.REACT_APP_API_PORT;

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      message.warning("Vui lòng nhập biển số xe để tìm kiếm.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://${apiHost}:${apiPort}/detect_vehicles/get/plate/${encodeURIComponent(
          searchTerm
        )}`
      );

      if (Array.isArray(response.data)) {
        setVehicles(response.data);
      } else if (response.data && typeof response.data === "object") {
        setVehicles([response.data]);
      } else {
        setVehicles([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phương tiện:", error);
      message.error("Không thể lấy dữ liệu phương tiện.");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const updateDoTinCay = async (index, isTrust) => {
    const vehicle = vehicles[index];
    // const newDoTinCay = isTrust
    //   ? (Math.random() * 0.2 + 0.8).toFixed(2)
    //   : (Math.random() * 0.5).toFixed(2);
    const newDoTinCay = isTrust
      ? parseFloat((Math.random() * 0.2 + 0.8).toFixed(2))
      : parseFloat((Math.random() * 0.5).toFixed(2));


    try {
      await axios.put(
        `http://${apiHost}:${apiPort}/detect_vehicles/put/${vehicle.IdNhanDangPhuongTien}`,
        { DoTinCay: parseFloat(newDoTinCay) }
      );
      // Nếu thành công, cập nhật lại state
      setVehicles((prev) => {
        const newVehicles = [...prev];
        newVehicles[index] = {
          ...newVehicles[index],
          DoTinCay: newDoTinCay,
        };
        return newVehicles;
      });
      message.success("Cập nhật độ tin cậy thành công!");
    } catch (error) {
      message.error("Cập nhật độ tin cậy thất bại!");
    }
  };

  const renderVehicleCards = () => {
    if (vehicles.length === 0) {
      return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          {searchTerm
            ? "Không tìm thấy phương tiện phù hợp."
            : "Nhập biển số xe để tìm kiếm."}
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {vehicles.map((item, index) => {
          const { ThoiGian, ViTri, DoTinCay, phuongtien, anh } = item;
          const camera = anh?.camera;
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                hoverable
                title={`Biển số: ${phuongtien?.BienSo || "Không rõ"}`}
                // cover={
                //   anh?.DuongDan ? (
                //     <img
                //       alt="Ảnh phương tiện"
                //       src={anh?.DuongDan?.startsWith("http")
                //         ? anh.DuongDan
                //         : `http://${apiHost}:${apiPort}${anh.DuongDan}`}
                //       style={{ height: 160, objectFit: "cover" }}
                //     />
                //   ) : null
                // }
                cover={
                  anh?.DuongDan ? (
                    <img
                      alt="Ảnh phương tiện"
                      src={
                        anh.DuongDan.startsWith("http")
                          ? anh.DuongDan
                          : `http://${apiHost}:${apiPort}${anh.DuongDan}`
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback-image.jpg"; // Ảnh fallback nếu không load được
                      }}
                      style={{ height: 160, objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ height: 160, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      Không có ảnh
                    </div>
                  )
                }
              >
                {/* <Radio.Group
                  style={{ marginBottom: 8 }}
                  onChange={e => updateDoTinCay(index, e.target.value === "trust")}
                  value={item.DoTinCay >= 0.8 ? "trust" : item.DoTinCay <= 0.5 ? "not_trust" : undefined}
                >
                  <Radio value="trust">Tin cậy</Radio>
                  <Radio value="not_trust">Không tin cậy</Radio>
                </Radio.Group> */}
                <Radio.Group
                  style={{ marginBottom: 8 }}
                  onChange={e => updateDoTinCay(index, e.target.value === "trust")}
                  value={
                    item.DoTinCay >= 0.8
                      ? "trust"
                      : item.DoTinCay <= 0.5
                        ? "not_trust"
                        : null
                  }
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value="trust">Tin cậy</Radio.Button>
                  <Radio.Button value="not_trust">Không tin cậy</Radio.Button>
                </Radio.Group>
                <p><b>Chủ sở hữu:</b> {phuongtien?.ChuSoHuu || "Không rõ"}</p>
                <p><b>Loại xe:</b> {phuongtien?.KieuXe}</p>
                <p><b>Màu sắc:</b> {phuongtien?.MauSac}</p>
                <p><b>Thời gian nhận dạng:</b> {new Date(ThoiGian).toLocaleString("vi-VN")}</p>
                <p><b>Vị trí nhận dạng:</b> {ViTri}</p>
                <p><b>Độ tin cậy:</b> {DoTinCay ? parseFloat(DoTinCay).toFixed(2) : "Không rõ"}</p>
                <p><b>Thời gian ảnh:</b> {anh?.ThoiGian ? new Date(anh.ThoiGian).toLocaleString("vi-VN") : "Không có"}</p>
                {/* <p><b>Kích thước ảnh:</b> {anh?.KichThuoc?.toFixed(2)} MB</p> */}
                <p><b>IP Camera:</b> {camera?.IpCamera}</p>
                {/* <p><b>Vị trí camera:</b> {camera?.ViTriLapDat}</p> */}
                {/* <p><b>Khu vực:</b> {camera?.khuvuc?.TenKhuVuc}</p> */}
                {/* <p><b>Trạng thái camera:</b> {camera?.TrangThaiCamera}</p> */}
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <div className="vehicle-search-container">
      <h1>Tìm kiếm phương tiện theo biển số</h1>
      <div className="search-bar" style={{ marginBottom: 24 }}>
        <Input
          style={{ width: 300, marginRight: 8 }}
          placeholder="Nhập biển số xe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Button type="primary" onClick={handleSearch} loading={loading}>
          Tìm kiếm
        </Button>
      </div>
      <Spin spinning={loading}>
        {renderVehicleCards()}
      </Spin>
    </div>
  );
};

export default VehiclesPage;
