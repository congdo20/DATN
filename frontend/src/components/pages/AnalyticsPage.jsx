import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import { FaCarCrash, FaTachometerAlt } from 'react-icons/fa';
import '../../assets/styles/AnalyticsPage.css';

const COLORS = ['#ff4d4f', '#fa8c16', '#1890ff', '#52c41a', '#722ed1'];

const AnalyticsPage = () => {
    const [violationStats, setViolationStats] = useState([]);
    const [densityStats, setDensityStats] = useState([]);
    const [violationTypeRatio, setViolationTypeRatio] = useState([]);
    const [loading, setLoading] = useState(true);
    const [avgSpeed, setAvgSpeed] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const resViolations = await axios.get('http://127.0.0.1:8000/violations/get');
                const violations = resViolations.data;

                const byDate = {};
                violations.forEach(v => {
                    const date = new Date(v.ThoiGian).toLocaleDateString('vi-VN');
                    byDate[date] = (byDate[date] || 0) + 1;
                });
                const violationStatsArr = Object.entries(byDate).map(([date, count]) => ({ date, count }));
                setViolationStats(violationStatsArr);

                const byType = {};
                violations.forEach(v => {
                    const type = v.danhmuc?.LoaiViPham || v.LoaiViPham || 'Không xác định';
                    byType[type] = (byType[type] || 0) + 1;
                });
                const violationTypeArr = Object.entries(byType).map(([name, value]) => ({ name, value }));
                setViolationTypeRatio(violationTypeArr);

                const resTraffic = await axios.get('http://127.0.0.1:8000/traffic/get');
                const traffics = resTraffic.data;

                const byDensity = {};
                let speedSum = 0, speedCount = 0;
                traffics.forEach(t => {
                    const density = t.MatDoGiaoThong === "Dong Duc" ? "Đông Đúc" : t.MatDoGiaoThong === "Un Tac" ? "Ùn Tắc" : "Thông Thoáng"|| 'Không xác định';
                    byDensity[density] = (byDensity[density] || 0) + 1;
                    if (t.TocDoTrungBinh) {
                        speedSum += t.TocDoTrungBinh;
                        speedCount++;
                    }
                });
                const densityArr = Object.entries(byDensity).map(([mat_do, so_luong]) => ({ mat_do, so_luong }));
                setDensityStats(densityArr);

                setAvgSpeed(speedCount > 0 ? (speedSum / speedCount).toFixed(2) : null);

            } catch (err) {
                alert('Không thể tải dữ liệu thống kê!');
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <div className="analytics-container"><p>Đang tải dữ liệu...</p></div>;

    return (
        <div className="analytics-container" style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
            <h1 style={{ textAlign: 'center', marginBottom: 32, color: '#1890ff', fontWeight: 700, letterSpacing: 1 }}>Thống Kê Giao Thông</h1>

            <div className="stats-overview" style={{
                display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap'
            }}>
                <div className="card" style={{
                    background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 32, minWidth: 260, textAlign: 'center', flex: 1
                }}>
                    <FaCarCrash size={36} color="#ff4d4f" style={{ marginBottom: 12 }} />
                    <h2 style={{ color: '#333', fontWeight: 600 }}>Tổng số vụ vi phạm</h2>
                    <p style={{ fontSize: 32, color: '#ff4d4f', fontWeight: 700 }}>{violationStats.reduce((sum, v) => sum + v.count, 0)}</p>
                </div>
                <div className="card" style={{
                    background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 32, minWidth: 260, textAlign: 'center', flex: 1
                }}>
                    <FaTachometerAlt size={36} color="#1890ff" style={{ marginBottom: 12 }} />
                    <h2 style={{ color: '#333', fontWeight: 600 }}>Tốc độ trung bình</h2>
                    <p style={{ fontSize: 32, color: '#1890ff', fontWeight: 700 }}>{avgSpeed ? `${avgSpeed} km/h` : 'Không có dữ liệu'}</p>
                </div>
            </div>

            <div className="charts-section" style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32
            }}>
                <div className="chart-card" style={{
                    background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24
                }}>
                    <h3 style={{ color: '#ff4d4f', fontWeight: 600, marginBottom: 16 }}>Số vụ vi phạm theo ngày</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={violationStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#ff4d4f" name="Số vụ vi phạm" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card" style={{
                    background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24
                }}>
                    <h3 style={{ color: '#1890ff', fontWeight: 600, marginBottom: 16 }}>Phân bố mật độ giao thông</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={densityStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mat_do" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="so_luong" fill="#1890ff" name="Số lần ghi nhận" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card" style={{
                    background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24
                }}>
                    <h3 style={{ color: '#fa8c16', fontWeight: 600, marginBottom: 16 }}>Tỉ lệ loại vi phạm</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={violationTypeRatio}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {violationTypeRatio.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;