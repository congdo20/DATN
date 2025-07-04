import React, { useState } from 'react';
import { Button, Input, Spin, Card, Row, Col, message, Radio, Form, InputNumber } from 'antd';
import axios from 'axios';
import '../../assets/styles/PersonPage.css';

const apiHost = process.env.REACT_APP_API_HOST;
const apiPort = process.env.REACT_APP_API_PORT;

const PersonsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://${apiHost}:${apiPort}/detect_persons/get/feature/${encodeURIComponent(searchTerm)}?limit=${limit}`
            );
            setPersons(Array.isArray(response.data) ? response.data : []);
            if (!response.data || response.data.length === 0) {
                message.info('Không tìm thấy người phù hợp với mô tả này.');
            }
        } catch (error) {
            message.error('Không thể lấy dữ liệu người nhận dạng.');
            setPersons([]);
        } finally {
            setLoading(false);
        }
    };

    const updateDoTinCay = async (index, isTrust) => {
        const person = persons[index];
        const newDoTinCay = isTrust
            ? parseFloat((Math.random() * 0.2 + 0.8).toFixed(2))
            : parseFloat((Math.random() * 0.5).toFixed(2));
        try {
            await axios.put(
                `http://${apiHost}:${apiPort}/detect_persons/put/id/${person.IdNhanDangNguoi}`,
                { DoTinCay: newDoTinCay }
            );
            setPersons((prev) => {
                const newPersons = [...prev];
                newPersons[index] = {
                    ...newPersons[index],
                    DoTinCay: newDoTinCay,
                };
                return newPersons;
            });
            message.success('Cập nhật độ tin cậy thành công!');
        } catch (error) {
            message.error('Cập nhật độ tin cậy thất bại!');
        }
    };

    const renderPersonCards = () => {
        if (persons.length === 0) {
            return (
                <div style={{ textAlign: 'center', marginTop: 50 }}>
                    {searchTerm
                        ? 'Không tìm thấy người phù hợp.'
                        : 'Nhập mô tả để tìm kiếm.'}
                </div>
            );
        }
        return (
            <Row gutter={[16, 16]}>
                {persons.map((item, index) => {
                    const { Tuoi, GioiTinh, DacTrung, ThoiGian, ViTri, DoTinCay, anh } = item;
                    const camera = anh?.camera;
                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={item.IdNhanDangNguoi || index}>
                            <Card
                                hoverable
                                // title={`Tuổi: ${Tuoi || '?'} - ${GioiTinh === "Nam" ? "Nam" : (GioiTinh === "Nu" ? "Nữ" : "Khác") || '?'}`}
                                cover={
                                    anh?.DuongDan ? (
                                        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#f5f5f5' }}>
                                            <img
                                                alt="Ảnh nhận dạng"
                                                src={anh.DuongDan.startsWith('http')
                                                    ? anh.DuongDan
                                                    : `http://${apiHost}:${apiPort}${anh.DuongDan}`}
                                                onError={e => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/fallback-image.jpg';
                                                }}
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: 'scale(1)' }}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ height: 200, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            Không có ảnh
                                        </div>
                                    )
                                }
                            >
                                <Radio.Group
                                    style={{ marginBottom: 8 }}
                                    onChange={e => updateDoTinCay(index, e.target.value === 'trust')}
                                    value={
                                        item.DoTinCay >= 0.8
                                            ? 'trust'
                                            : item.DoTinCay <= 0.5
                                                ? 'not_trust'
                                                : null
                                    }
                                    optionType="button"
                                    buttonStyle="solid"
                                >
                                    <Radio.Button value="trust">Tin cậy</Radio.Button>
                                    <Radio.Button value="not_trust">Không tin cậy</Radio.Button>
                                </Radio.Group>
                                {/* <p><b>Trang phục:</b> {DacTrung?.TrangPhuc || 'Không rõ'}</p>
                                <p><b>Phụ kiện:</b> {DacTrung?.PhuKien || 'Không rõ'}</p>
                                <p><b>Hình dáng:</b> {DacTrung?.HinhDang || 'Không rõ'}</p>
                                <p><b>Tóc:</b> {DacTrung?.Toc || 'Không rõ'}</p> */}
                                {/* {DacTrung?.captions?.map((caption, index) => (
                                    <p key={index}><b>Mô tả:</b> {caption}</p>
                                ))} */}
                                                                
                                {DacTrung?.captions && DacTrung.captions.length > 0 && (
                                    <div style={{ marginTop: '8px' }}>
                                        <b>Mô tả:</b>
                                        <ul style={{ paddingLeft: '20px', marginBottom: '0', marginTop: '4px' }}>
                                            {DacTrung.captions.map((caption, index) => (
                                                <li key={index} style={{ marginBottom: '4px' }}>{caption}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <p><b>Thời gian nhận dạng:</b> {ThoiGian ? new Date(ThoiGian).toLocaleString('vi-VN') : 'Không rõ'}</p>
                                <p><b>Vị trí nhận dạng:</b> {ViTri || 'Không rõ'}</p>
                                {/* <p><b>Độ tin cậy:</b> {DoTinCay !== undefined ? Number(DoTinCay).toFixed(2) : 'Không rõ'}</p> */}
                                <p><b>Thời gian ảnh:</b> {anh?.ThoiGian ? new Date(anh.ThoiGian).toLocaleString('vi-VN') : 'Không có'}</p>
                                <p><b>IP Camera:</b> {camera?.IpCamera || 'Không rõ'}</p>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        );
    };

    return (
        <div className="person-search-container">
            <h1>Tìm kiếm người nhận dạng</h1>
            <div className="search-bar" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Input
                    style={{ width: 300 }}
                    placeholder="Nhập mô tả để tìm kiếm..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onPressEnter={handleSearch}
                />
                <Form.Item label="Số kết quả" style={{ marginBottom: 0 }}>
                    <InputNumber
                        min={1}
                        max={50}
                        value={limit}
                        onChange={(value) => setLimit(value || 1)}
                    />
                </Form.Item>
                <Button type="primary" onClick={handleSearch} loading={loading}>
                    Tìm kiếm
                </Button>
            </div>
            <Spin spinning={loading}>
                {renderPersonCards()}
            </Spin>
        </div>
    );
};

export default PersonsPage;