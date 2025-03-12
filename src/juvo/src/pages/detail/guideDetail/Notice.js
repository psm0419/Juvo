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
        <div className="notice">
            {notices.length > 0 ? (
                notices.map((notice) => (
                    <div key={notice.noticeId} className="notice-item">
                        <h4>
                            <Link
                                to={`/detail/guideDetail/Notice/detail/${notice.noticeId}`}
                                className="notice-title"
                            >
                                {notice.title}
                            </Link>
                        </h4>
                        <p>{notice.content}</p>
                        <span>{notice.createdDate}</span>
                    </div>
                ))
            ) : (
                <p>현재 공지사항이 없습니다.</p>
            )}
        </div>
    );
};

export default Notice;