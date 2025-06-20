import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
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
        <div className="analytics-container">
            <h1>Thống Kê Giao Thông</h1>

            <div className="stats-overview">
                <div className="card">
                    <h2>Tổng số vụ vi phạm</h2>
                    <p>{violationStats.reduce((sum, v) => sum + v.count, 0)}</p>
                </div>
                <div className="card">
                    <h2>Tốc độ trung bình</h2>
                    <p>{avgSpeed ? `${avgSpeed} km/h` : 'Không có dữ liệu'}</p>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-card">
                    <h3>Số vụ vi phạm theo ngày</h3>
                    <ResponsiveContainer width="100%" height={300}>
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

                <div className="chart-card">
                    <h3>Phân bố mật độ giao thông</h3>
                    <ResponsiveContainer width="100%" height={300}>
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

                <div className="chart-card">
                    <h3>Tỉ lệ loại vi phạm</h3>
                    <ResponsiveContainer width="100%" height={300}>
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
                    {/* Custom legend
                    <div className="custom-legend">
                        {violationTypeRatio.map((entry, index) => (
                            <div key={entry.name} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{
                                    display: 'inline-block',
                                    width: 16,
                                    height: 16,
                                    backgroundColor: COLORS[index % COLORS.length],
                                    borderRadius: 4,
                                    marginRight: 8,
                                    border: '1px solid #ccc'
                                }} />
                                <span>{entry.name}</span>
                            </div>
                        ))}
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;