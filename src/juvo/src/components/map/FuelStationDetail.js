import React, { useState, useEffect } from 'react';
import '../../assets/css/map/FuelStationDetail.css';
import Swal from "sweetalert2";

const FuelStationDetail = ({ station, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [keywordCounts, setKeywordCounts] = useState({});
    const [userKeywords, setUserKeywords] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [showKeywordForm, setShowKeywordForm] = useState(false);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState('');
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [visibleReviews, setVisibleReviews] = useState(3);
    const [userNickname, setUserNickname] = useState(null);

    function decodeBase64URL(base64URL) {
        const base64 = base64URL.replace(/-/g, '+').replace(/_/g, '/');
        const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
        const decoded = atob(base64 + padding);
        // UTF-8 디코딩
        return new TextDecoder('utf-8').decode(Uint8Array.from(decoded, c => c.charCodeAt(0)));
    }
    useEffect(() => {
        if (!station?.uniId) {
            console.log("No station uniId provided");
            return;
        }

        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
        if (token) {
            try {
                const base64Payload = token.split('.')[1];
                const decodedPayload = decodeBase64URL(base64Payload);
                const payload = JSON.parse(decodedPayload);
                console.log("Decoded payload:", payload);
                console.log("userId:", payload.userId);
                console.log("nickname:", payload.nickname);
                setUserId(payload.userId);
                setUserNickname(payload.nickname || null);
            } catch (e) {
                console.error('Error decoding token:', e);
            }
        }

        fetchReviews();
        fetchKeywords();
    }, [station?.uniId]);

    // 오버레이 클릭 시 닫기
    const handleOverlayClick = (e) => {
        if (e.target.className === 'fuel-station-detail-overlay') {
            onClose();
        }
    };
    // 내부 컨텐츠 클릭 시 이벤트 전파 방지
    const handleContentClick = (e) => {
        e.stopPropagation();
    };
    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews?uniId=${station.uniId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error("Failed to fetch reviews");
            const data = await response.json();
            console.log("Reviews data:", data);
            setReviews(data.reviews || []);
            setAverageRating(data.averageRating || 0);
            setVisibleReviews(3); //리뷰 새로 가져올 때마다 3개로 리셋
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
            setAverageRating(0);
        }
    };

    const fetchKeywords = async () => {
        try {
            const headers = { 'Content-Type': 'application/json' };
            const token = localStorage.getItem('accessToken');
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`/api/keywords?uniId=${station.uniId}`, {
                method: 'GET',
                headers,
            });
            if (!response.ok) throw new Error("Failed to fetch keywords");
            const data = await response.json();
            console.log("Keywords data:", data);
            setKeywordCounts(data.keywordCounts || {});
        } catch (error) {
            console.error('Error fetching keywords:', error);
            setKeywordCounts({});
        }
    };

    const fetchUserKeywords = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            const response = await fetch(`/api/user-keywords?uniId=${station.uniId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch user keywords");
            const data = await response.json();
            console.log("User keywords:", data);
            setUserKeywords(data.keywords || []);
            setSelectedKeywords(data.keywords || []);
        } catch (error) {
            console.error('Error fetching user keywords:', error);
            setUserKeywords([]);
            setSelectedKeywords([]);
        }
    };

    const handleWriteReview = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "경고",
                text: "로그인이 필요합니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });
            return;
        }

        if (!reviewContent || !reviewRating || isNaN(reviewRating) || reviewRating < 0 || reviewRating > 5) {
            Swal.fire({
                icon: "warning",
                title: "경고",
                text: "리뷰 내용과 유효한 별점(0~5)을 입력해주세요.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            })
            return;
        }

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    uniId: station.uniId,
                    content: reviewContent,
                    starCnt: parseFloat(reviewRating),
                }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            console.log('Review save response:', data);
            if (data.status === 'success') {
                Swal.fire({
                    icon: "success",
                    title: "성공",
                    text: "리뷰가 저장되었습니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                });
                setReviewContent('');
                setReviewRating('');
                setShowReviewForm(false);
                fetchReviews();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "실패",
                    text: "리뷰 저장에 실패했습니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                });
            }
        } catch (error) {
            console.error('Error saving review:', error);
            Swal.fire({
                icon: "error",
                title: "실패",
                text: "리뷰 저장중 오류가 발생했습니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });
        }
    };

    const handleSelectKeyword = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "경고",
                text: "로그인이 필요 합니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });
            return;
        }

        if (selectedKeywords.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "경고",
                text: "최소 하나의 키워드를 선택해주세요.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });
            return;
        }

        try {
            const response = await fetch('/api/keywords', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    uniId: station.uniId,
                    keywords: selectedKeywords,
                }),
            });
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            console.log('Keyword save response:', data);
            if (data.status === 'success') {
                Swal.fire({
                    icon: "success",
                    title: "성공",
                    text: "키워드가 저장되었습니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                });
                setSelectedKeywords([]);
                setShowKeywordForm(false);
                fetchKeywords(); // 전체 키워드 갱신
                fetchUserKeywords(); // 사용자 키워드 갱신
            } else {
                Swal.fire({
                    icon: "error",
                    title: "실패",
                    text: "키워드 저장에 실패했습니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                });
            }
        } catch (error) {
            console.error('Error saving keywords:', error);
            Swal.fire({
                icon: "error",
                title: "실패",
                text: "키워드 저장중 오류가 발생했습니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setReviewContent(review.CONTENT);
        setReviewRating(review.STARCNT);
        setShowReviewForm(true);
    };

    const handleUpdateReview = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "경고",
                text: "로그인이 필요 합니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });
            return;
        }

        try {
            await handleDeleteReview(editingReview, false);
            await handleWriteReview();
            setEditingReview(null);
        } catch (error) {
            console.error('Error updating review:', error);
            Swal.fire({
                icon: "error",
                title: "실패",
                text: "리뷰 수정 중 오류가 발생했습니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });
        }
    };

    const handleDeleteReview = async (review, refresh = true) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "경고",
                text: "로그인이 필요 합니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });
            return;
        }

        try {
            const response = await fetch('/api/reviews', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    uniId: station.uniId,
                    content: review.CONTENT,
                }),
            });
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            console.log('Review delete response:', data);
            if (data.status === 'success') {
                if (refresh) {
                    Swal.fire({
                        icon: "success",
                        title: "성공",
                        text: "리뷰가 삭제 되었습니다.",
                        confirmButtonText: "확인",
                        confirmButtonColor: "#f89400",
                    });
                    fetchReviews();
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "실패",
                    text: "리뷰 삭제에 실패하였습니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                });
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            Swal.fire({
                icon: "error",
                title: "실패",
                text: "리뷰 삭제 중 오류가 발생했습니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });
        }
    };

    // 더보기 버튼 클릭 시 5개씩 추가
    const handleShowMore = () => {
        setVisibleReviews(prev => prev + 5);
    }

    const toggleKeyword = (id) => {
        setSelectedKeywords(prev =>
            prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
        );
    };

    const keywordOptions = {
        1: "친절",
        2: "진출입 편함",
        3: "깔끔한 시설",
        4: "정량 주유",
        5: "믿음가는 품질",
        6: "사은품 증정",
        7: "주유시 세차 할인",
    };

    return (
        <div className="fuel-station-detail-overlay" onClick={handleOverlayClick}>
            <div className="fuel-station-detail" onClick={handleContentClick}>
                <h2 className="station-title">
                    <span className="station-name">
                        {station.OS_NM || "이름 없음"}({station.pollDivCd || "이름 없음"})
                    </span>
                    <button className="close-btn" onClick={onClose}>X</button>
                </h2>
                <div className="detail-section">
                    <h3 className="section-title">주요 가격</h3>
                    <div className="price-list">
                        <div className="price-item">
                            <span>휘발유</span>
                            <span>{station.hoilPrice ? `${station.hoilPrice}원` : "정보 없음"}</span>
                        </div>
                        <div className="price-item">
                            <span>경유</span>
                            <span>{station.doilPrice ? `${station.doilPrice}원` : "정보 없음"}</span>
                        </div>
                        <div className="price-item">
                            <span>등유</span>
                            <span>{station.ioilPrice ? `${station.ioilPrice}원` : "정보 없음"}</span>
                        </div>
                    </div>
                    <p className="price-note">※ 실제 가격과 다른 경우 제공자가 잘못 입력했을 수 있습니다。</p>
                </div>
                <div className="detail-section">
                    <h3 className="section-title">키워드</h3>
                    <div className="service-icons">
                        {Object.keys(keywordCounts).length > 0 ? (
                            Object.entries(keywordCounts).map(([keywordId, count]) => (
                                keywordOptions[keywordId] ? (
                                    <span key={keywordId} className="service-item">
                                        {keywordOptions[keywordId]} {count}
                                    </span>
                                ) : null
                            ))
                        ) : (
                            <span className="service-item">키워드 없음</span>
                        )}
                    </div>
                    <p className="quality-cert">
                        {station.kpetroYn === "Y" ? "품질인증 주유소 ✅" : "품질인증 주유소 ❌"}
                    </p>
                </div>
                <div className="detail-section">
                    <h3 className="section-title">주유소 리뷰 ({reviews.length})</h3>
                    <div className="review-summary">
                        <span className="rating">★ {averageRating.toFixed(1)}</span>
                        <span className="review-count">{reviews.length}건</span>
                    </div>
                    <div className="review-list">
                        {reviews.length > 0 ? (
                            <>
                                {reviews.slice(0, visibleReviews).map((review, index) => (
                                    <div key={index} className="review-item">
                                        <div className="review-header">
                                            <span className="review-user">{isLoggedIn && review.USER_ID === userId && userNickname
                                                ? userNickname
                                                : review.USER_ID || "익명"}</span>
                                            <span className="review-date">{review.CREATE_AT || "날짜 없음"}</span>
                                        </div>
                                        <div className="review-rating">★ {review.STARCNT || 0}</div>
                                        <p className="review-comment">{review.CONTENT || "댓글 없음"}</p>
                                        {isLoggedIn && review.USER_ID === userId && (
                                            <div className="review-actions">
                                                <button onClick={() => handleEditReview(review)}>수정</button>
                                                <button onClick={() => handleDeleteReview(review)}>삭제</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {visibleReviews < reviews.length && (
                                    <button
                                        onClick={handleShowMore}
                                        className="more-btn"
                                    >
                                        더보기
                                    </button>
                                )}
                            </>
                        ) : (
                            <p className="review-comment">리뷰가 없습니다。</p>
                        )}
                    </div>
                    {showReviewForm && isLoggedIn && (
                        <div className="review-form">
                            <textarea
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                placeholder="리뷰 내용을 입력하세요"
                            />
                            <input
                                type="number"
                                value={reviewRating}
                                onChange={(e) => setReviewRating(e.target.value)}
                                placeholder="별점 (0-5)"
                                min="0"
                                max="5"
                                step="0.1"
                            /><br></br>
                            <button onClick={editingReview ? handleUpdateReview : handleWriteReview}>
                                {editingReview ? "수정 완료" : "저장"}
                            </button>
                        </div>
                    )}
                    {showKeywordForm && isLoggedIn && (
                        <div className="keyword-form">
                            {Object.entries(keywordOptions).map(([id, label]) => (
                                <label key={id}>
                                    <input
                                        type="checkbox"
                                        checked={selectedKeywords.includes(parseInt(id))}
                                        onChange={() => toggleKeyword(parseInt(id))}
                                    />
                                    {label}
                                </label>
                            ))}
                            <button onClick={handleSelectKeyword}>저장</button>
                        </div>
                    )}
                </div>
                {isLoggedIn && (
                    <div className="button-container">
                        <button onClick={() => setShowReviewForm(!showReviewForm)} className="write-review-btn">
                            {showReviewForm ? "리뷰 작성 취소" : "리뷰 작성"}
                        </button>
                        <button
                            onClick={() => {
                                setShowKeywordForm(!showKeywordForm);
                                if (!showKeywordForm) fetchUserKeywords();
                            }}
                            className="select-keyword-btn"
                        >
                            {showKeywordForm ? "키워드 선택 취소" : "키워드 선택"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FuelStationDetail;