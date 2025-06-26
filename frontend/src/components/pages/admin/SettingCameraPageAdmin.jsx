import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "../../../assets/styles/SettingCamera.css";

const initialCamera = {
  ip: "",
  location: "",
  status: "",
  installDate: "",
  maintenanceDate: "",
  areaName: "",
  areaId: null,
  latitude: "",
  longitude: "", 
};

function LocationPicker({ latitude, longitude, onChange }) {
  const position = latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : [21.0278, 105.8342];

  const cameraIcon = new L.Icon({
    // iconUrl: '/icons/camera-marker.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [35, 50], 
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  function LocationMarker() {
    useMapEvents({
      click(e) {
        onChange(e.latlng.lat, e.latlng.lng);
      }
    });
    return <Marker position={position} icon={cameraIcon} />;
  }

  return (
    <MapContainer center={position} zoom={15} style={{ height: 300, width: '100%', marginBottom: 16 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
}

export default function SettingCameraPageAdmin() {
  const [camera, setCamera] = useState(initialCamera);
  const { id } = useParams();
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/cameras/get/id/${id}`
      )
      .then((res) => {
        const cam = res.data;
        setCamera({
          ip: cam.IpCamera || "",
          location: cam.ViTriLapDat || "",
          status: cam.TrangThaiCamera || "",
          installDate: cam.NgayLapDat || null,
          maintenanceDate: cam.BaoTri || null,
          areaName: cam.khuvuc?.TenKhuVuc || "",
          areaId: cam.khuvuc?.IdKhuVuc || null,
          latitude: cam.Latitude || "",
          longitude: cam.Longitude || "",
        });
      })
      .catch((err) => {
        console.error("Lỗi khi tải camera:", err);
        alert("Không thể tải thông tin camera!");
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/areas/get`
      )
      .then((res) => {
        setAreas(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi tải khu vực:", err);
        alert("Không thể tải danh sách khu vực!");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCamera((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/cameras/put/id/${id}`,
        {
          IpCamera: camera.ip,
          ViTriLapDat: camera.location,
          TrangThaiCamera: camera.status,
          NgayLapDat: camera.installDate,
          BaoTri: camera.maintenanceDate,
          IdKhuVuc: camera.areaId,
          Latitude: camera.latitude,
          Longitude: camera.longitude,
        }
      );
      alert("Đã lưu thông tin camera!");
      navigate(`/admin/camerasetting/${id}`);
    } catch (err) {
      console.error(
        "Lỗi khi cập nhật camera:",
        err.response?.data || err.message
      );
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="setting-page">
      <h2 className="form-title">Cài đặt Camera - ID: {id}</h2>
      <form className="setting-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Địa chỉ IP</label>
          <input
            type="text"
            name="ip"
            value={camera.ip}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Vị trí lắp đặt</label>
          <input
            type="text"
            name="location"
            value={camera.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Chọn vị trí trên bản đồ</label>
          <LocationPicker
            latitude={camera.latitude}
            longitude={camera.longitude}
            onChange={(lat, lng) => setCamera(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng
            }))}
          />
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <label>Vĩ độ (Latitude):</label>
              <input type="text" value={camera.latitude} readOnly />
            </div>
            <div>
              <label>Kinh độ (Longitude):</label>
              <input type="text" value={camera.longitude} readOnly />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Trạng thái</label>
          <select name="status" value={camera.status} onChange={handleChange}>
            <option value="Hoat Dong">Hoạt động</option>
            <option value="Hu Hong">Hư Hỏng</option>
            <option value="Khong Hoat Dong">Không Hoạt Động</option>
            <option value="Bao Tri">Bảo Trì</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ngày lắp đặt</label>
          <input
            type="date"
            name="installDate"
            value={camera.installDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Ngày bảo trì</label>
          <input
            type="date"
            name="maintenanceDate"
            value={camera.maintenanceDate || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Khu vực</label>
          <select
            name="areaId"
            value={camera.areaId || ""}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Chọn khu vực --
            </option>
            {areas.map((area) => (
              <option key={area.IdKhuVuc} value={area.IdKhuVuc}>
                {area.TenKhuVuc}
              </option>
            ))}
          </select>
        </div>

        <button className="submit-btn" type="submit">
          Lưu
        </button>
      </form>
    </div>
  );
}
