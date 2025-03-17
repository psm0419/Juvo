import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../assets/css/detail/Notice.css';
import axios from 'axios';

const Notice = () => {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('http://localhost:3000/notice/list');
                setNotices(response.data);
            } catch (error) {
                console.error('공지사항을 불러오는 중 오류 발생:', error);
            }
        };

        fetchNotices();
    }, []);

    return (
        <div className="notice-page">
            <h1 className="notice-title">공지사항</h1>
            <div className="notice-grid">
                {notices.length > 0 ? (
                    notices.map((notice) => (
                        <Link
                            key={notice.noticeId}
                            to={`/detail/guideDetail/Notice/detail/${notice.noticeId}`}
                            className="notice-card"
                        >
                            <h3 className="card-title">{notice.title}</h3>
                            <p className="card-content">{notice.content}</p>
                            <span className="card-date">{notice.createdDate}</span>
                        </Link>
                    ))
                ) : (
                    <div className="empty-notice">
                        <p>공지사항이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notice;