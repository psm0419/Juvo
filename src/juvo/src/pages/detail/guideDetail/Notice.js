import React, { useState, useEffect } from 'react';
import '../../../assets/css/detail/Notice.css';
import axios from 'axios';

const Notice = () => {
    const [notices, setNotices] = useState([]);

    // 공지사항 API 호출
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('/api/notices'); // 공지사항 API
                setNotices(response.data); // 응답된 데이터를 notices에 저장
            } catch (error) {
                console.error('공지사항을 불러오는 중 오류 발생:', error);
            }
        };

        fetchNotices();
    }, []); // 페이지 로드 시 한 번만 호출

    return (
        <div className="notice">
            {notices.length > 0 ? (
                notices.map((notice, index) => (
                    <div key={index} className="notice-item">
                        <h4>{notice.title}</h4>
                        <p>{notice.content}</p>
                        <span>{notice.date}</span>
                    </div>
                ))
            ) : (
                <p>현재 공지사항이 없습니다.</p>
            )}
        </div>
    );
};

export default Notice;
