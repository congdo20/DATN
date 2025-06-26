import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; 
import '../../assets/styles/TrafficPage.css'; 
import { useNavigate } from 'react-router-dom';


const createCustomIcon = (colorClass) => {
    return new L.DivIcon({
        className: `custom-marker-icon ${colorClass}`,
        html: '<div class="marker-dot"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10], 
        popupAnchor: [0, -10]
    });
};

const getLevelClass = (matDo) => {
    if (!matDo) return '';
    const lowerCaseMatDo = matDo.toLowerCase();
    if (lowerCaseMatDo === 'un tac') return 'severe';
    if (lowerCaseMatDo === 'dong duc') return 'moderate';
    if (lowerCaseMatDo === 'thong thoang') return 'normal';
    return '';
};

const getDisplayMatDo = (matDo) => {
    if (!matDo) return 'Không rõ';
    switch (matDo.toLowerCase()) {
        case 'thong thoang': return 'Thông Thoáng';
        case 'un tac': return 'Ùn Tắc';
        case 'dong duc': return 'Đông Đúc';
        default: return matDo;
    }
};

const TrafficStatusPage = () => {
    const [trafficData, setTrafficData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    
    const defaultCenter = [21.0278, 105.8342]; 
    const defaultZoom = 13;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/traffic/get/latest`);
                setTrafficData(res.data);
            } catch (err) {
                setError('Không thể tải dữ liệu giao thông. Vui lòng kiểm tra lại kết nối hoặc định dạng dữ liệu từ API.');
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const activeTrafficData = trafficData.filter(
        (item) => item.camera && item.camera.TrangThaiCamera === 'Hoat Dong'
    );

    if (loading) return <div className="traffic-status-container"><p>Đang tải dữ liệu...</p></div>;
    if (error) return <div className="traffic-status-container"><p>{error}</p></div>;

    return (
        <div className="traffic-status-container">
            <h1>Trạng Thái Giao Thông</h1>

            <div className="map-container">
                <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: '600px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {activeTrafficData.length === 0 ? (
                        <div className="no-data-overlay">Không có dữ liệu giao thông để hiển thị trên bản đồ.</div>
                    ) : (
                        activeTrafficData.map((item) => {
                            const lat = item.camera?.Latitude;
                            const lon = item.camera?.Longitude;

                            if (lat && lon) {
                                const levelClass = getLevelClass(item.MatDoGiaoThong);
                                const customIcon = createCustomIcon(levelClass);
                                return (
                                    <Marker position={[lat, lon]} icon={customIcon} key={item.IdTinhTrang}>
                                        <Popup>
                                            <div className={`popup-content ${levelClass}`}>
                                                <h4>{item.camera?.ViTriLapDat || 'Không rõ vị trí'}</h4>
                                                <p><strong>Khu vực:</strong> {item.camera?.khuvuc?.TenKhuVuc || 'Không rõ khu vực'}</p>
                                                <p><strong>Mật độ:</strong> {getDisplayMatDo(item.MatDoGiaoThong)}</p>
                                                <p><strong>Tốc độ TB:</strong> {item.TocDoTrungBinh ? `${item.TocDoTrungBinh} km/h` : 'Không rõ'}</p>
                                                <p><strong>Cập nhật:</strong> {item.ThoiGian ? new Date(item.ThoiGian).toLocaleString('vi-VN') : 'Không rõ'}</p>
                                                <button
                                                    className="view-video-btn"
                                                    onClick={() => navigate(`/showcamera/${item.camera?.IdCamera}`)}
                                                    style={{ marginTop: 8, padding: '6px 12px', borderRadius: 4, background: '#1890ff', color: '#fff', border: 'none', cursor: 'pointer' }}
                                                >
                                                    Xem Camera
                                                </button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            }
                            return null;
                        })
                    )}
                </MapContainer>
            </div>

            <h2>Chi Tiết Tình Trạng Giao Thông</h2>
            <div className="traffic-list">
                {activeTrafficData.length === 0 ? (
                    <p>Không có dữ liệu giao thông để hiển thị chi tiết.</p>
                ) : (
                    activeTrafficData.map((item) => (
                        <div className={`traffic-card ${getLevelClass(item.MatDoGiaoThong)}`} key={item.IdTinhTrang}>
                            <div className="info">
                                <h3>{item.camera?.ViTriLapDat || 'Không rõ vị trí'}</h3>
                                <p><strong>Khu vực:</strong> {item.camera?.khuvuc?.TenKhuVuc || 'Không rõ khu vực'}</p>
                                <p><strong>Mật độ giao thông:</strong> {getDisplayMatDo(item.MatDoGiaoThong)}</p>
                                <p><strong>Tốc độ trung bình:</strong> {item.TocDoTrungBinh ? `${item.TocDoTrungBinh} km/h` : 'Không rõ'}</p>
                                <p><strong>Thời gian cập nhật:</strong> {item.ThoiGian ? new Date(item.ThoiGian).toLocaleString('vi-VN') : 'Không rõ'}</p>
                                <p><strong>Camera IP:</strong> {item.camera?.IpCamera || 'Không rõ'}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TrafficStatusPage;

