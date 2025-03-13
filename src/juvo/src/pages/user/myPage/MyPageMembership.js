import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/user/myPage/MyPageMembership.css';

function MyPageMembership() {
    const navigate = useNavigate();
    const [membershipInfo, setMembershipInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [subscriptionDays, setSubscriptionDays] = useState(0);

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
            const response = await axios.get(
                "/api/membershipCheck",
                {
                    headers: { "Authorization": `Bearer ${token}` }
                }
            );

            const membershipData = response.data;
            setMembershipInfo(membershipData);

            // created_at을 이용해 구독 일수 계산
            if (membershipData.created_at) {
                const createdDate = new Date(membershipData.created_at);
                const currentDate = new Date();
                const timeDiff = currentDate - createdDate;
                const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                setSubscriptionDays(daysDiff);
            }

            setIsLoading(false);
        } catch (error) {
            console.error("멤버십 정보 조회 오류:", error);
            if (error.response.status === 401) {
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
            fetchMembershipInfo(); // 정보 갱신
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
            fetchMembershipInfo(); // 정보 갱신
        } catch (error) {
            console.error("구독 해지 오류:", error);
            alert("구독 해지에 실패했습니다.");
        }
    };

    const handleNavigateToDetail = () => {
        navigate('/detail/guideDetail/MembershipDetail');
    };

    if (isLoading) return <div className="membership-container">로딩 중...</div>;

    return (
        <div className="membership-container">
            <h1 className="membership-title">멤버십 관리</h1>

            {membershipInfo ? (
                // 구독 중인 경우
                <div className="subscription-info">
                    <div className="status-box subscribed">
                        <h2>{membershipInfo.name}</h2>
                        <p className="subscription-period">
                            구독 {subscriptionDays}일째
                        </p>
                        <p className="user-info">
                            아이디: {membershipInfo.userId}
                        </p>
                        <p className="tel-info">
                            전화번호: {membershipInfo.tel}
                        </p>
                        <button
                            className="unsubscribe-btn"
                            onClick={handleUnsubscribe}
                        >
                            구독 해지
                        </button>
                    </div>
                </div>
            ) : (
                // 미구독인 경우
                <div className="subscription-info">
                    <div className="status-box unsubscribed">
                        <h2>멤버십 미가입</h2>
                        <button
                            className="subscribe-btn"
                            onClick={handleNavigateToDetail}
                        >
                            구독 시작
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyPageMembership;