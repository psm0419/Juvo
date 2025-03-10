import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/user/myPage/MyPageMembership.css';

function MyPageMembership() {
    const navigate = useNavigate();
    const [membershipInfo, setMembershipInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMembershipInfo();
    }, []);

    const getToken = () => localStorage.getItem("accessToken");

    const fetchMembershipInfo = async () => {
        const token = getToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/user/login");
            return;
        }

        try {
            const response = await axios.get("/api/membership", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setMembershipInfo(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("멤버십 정보 조회 오류:", error);
            if (error.response?.status === 401) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate("/user/login");
            } else {
                alert("멤버십 정보를 불러오는데 실패했습니다.");
            }
            setIsLoading(false);
        }
    };

    const handleSubscribe = async () => {
        const token = getToken();
        if (!token) return;

        try {
            await axios.post("/api/membership/subscribe", {}, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            alert("구독이 시작되었습니다!");
            fetchMembershipInfo();
        } catch (error) {
            console.error("구독 신청 오류:", error);
            alert("구독 신청에 실패했습니다.");
        }
    };

    const handleUnsubscribe = async () => {
        const token = getToken();
        if (!token) return;

        if (!window.confirm("정말로 구독을 해지하시겠습니까?")) {
            return;
        }

        try {
            await axios.post("/api/membership/unsubscribe", {}, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            alert("구독이 해지되었습니다.");
            fetchMembershipInfo();
        } catch (error) {
            console.error("구독 해지 오류:", error);
            alert("구독 해지에 실패했습니다.");
        }
    };

    if (isLoading) return <div className="membership-container">로딩 중...</div>;

    return (
        <div className="membership-container">
            <h1 className="membership-title">멤버십 관리</h1>
            
            {membershipInfo?.subscription === 1 ? (
                // 구독 중인 경우
                <div className="subscription-info">
                    <div className="status-box subscribed">
                        <h2>현재 구독 중</h2>
                        <p className="subscription-period">
                            구독 {membershipInfo.months_subscribed}개월째
                        </p>
                        <p className="next-reward">
                            다음 혜택까지 {membershipInfo.next_reward_months}개월 남음
                        </p>
                        <button 
                            className="unsubscribe-btn"
                            onClick={handleUnsubscribe}
                        >
                            구독 해지하기
                        </button>
                    </div>
                    <div className="benefits-list">
                        <h3>현재 이용 중인 혜택</h3>
                        <ul>
                            <li>실시간 주유소 가격 정보 제공</li>
                            <li>무제한 즐겨찾기</li>
                            <li>월간 주유 리포트</li>
                            <li>프리미엄 고객 지원</li>
                        </ul>
                    </div>
                </div>
            ) : (
                // 미구독인 경우
                <div className="subscription-info">
                    <div className="status-box unsubscribed">
                        <h2>프리미엄 멤버십</h2>
                        <div className="price">
                            <span className="amount">9,900</span>
                            <span className="unit">원/월</span>
                        </div>
                        <button 
                            className="subscribe-btn"
                            onClick={handleSubscribe}
                        >
                            구독 시작하기
                        </button>
                    </div>
                    <div className="benefits-list">
                        <h3>구독 시 이용 가능한 혜택</h3>
                        <ul>
                            <li>실시간 주유소 가격 정보 제공</li>
                            <li>무제한 즐겨찾기</li>
                            <li>월간 주유 리포트</li>
                            <li>프리미엄 고객 지원</li>
                            <li>3개월 구독 시 한 달 무료</li>
                            <li>6개월 구독 시 두 달 무료</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyPageMembership; 