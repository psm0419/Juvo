import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link 추가
import axios from 'axios';
import '../../../assets/css/detail/NoticeDetail.css';

const NoticeDetail = () => {
    const { noticeId } = useParams(); // URL에서 noticeId 추출
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/notice/detail/${noticeId}`);
                setNotice(response.data);
            } catch (error) {
                console.error('공지사항 상세 조회 오류:', error);
            }
        };
        fetchNotice();
    }, [noticeId]);

    if (!notice) {
        return <div className="notice-detail">로딩 중...</div>;
    }

    return (
        <div className="notice-detail">
            <div className="notice-header">
                <h2 className="detail-title">{notice.title}</h2>
                <p className="detail-date">작성일: {notice.createdDate}</p>
            </div>
            <div className="detail-content">{notice.content}</div>
            <div className="notice-footer">
                <Link to="/detail/guideDetail/Notice" className="back-link">목록보기</Link>
            </div>
        </div>
    );
};

export default NoticeDetail;