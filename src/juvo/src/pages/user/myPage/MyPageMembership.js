import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/user/myPage/MyPageMembership.css';
import Swal from 'sweetalert2'; // SweetAlert2 임포트

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
            Swal.fire("로그인이 필요합니다.");
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
            if (error.response?.status === 401) {
                Swal.fire("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate("/user/login");
            } else {
                Swal.fire("멤버십 정보를 불러오는데 실패했습니다.");
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
            Swal.fire({
                title: "구독이 시작되었습니다!",
                icon: "success",
                draggable: true
            });
            fetchMembershipInfo();
        } catch (error) {
            console.error("구독 신청 오류:", error);
            Swal.fire({
                icon: "error",
                title: "앗..!",
                text: "구독 신청에 실패했습니다.",
            });
        }
    };

    const handleUnsubscribe = async () => {
        const token = getToken();
        if (!token) return;

        Swal.fire({
            title: "정말로 구독 해지 하실건가요?",
            text: "해지 하시면 상당한 혜택을 포기하시게 됩니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "네! 해지 할래요!",
            cancelButtonText: "조금 더 해볼게요!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post("/api/membership/unsubscribe", {}, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    Swal.fire({
                        title: "구독 취소 완료.",
                        text: "그동안 JUVO 구독 서비스를 이용해주셔서 감사했습니다.",
                        icon: "success"
                    });
                    fetchMembershipInfo();
                } catch (error) {
                    console.error("구독 해지 오류:", error);
                    Swal.fire("구독 해지에 실패했습니다.");
                }
            }
        });
    };

    const handleNavigateToDetail = () => {
        navigate('/detail/guideDetail/MembershipDetail');
    };

    const premiumFeatures = [
        'JUVO PASS 카드 발급',
        'JUVO PASS 카드 이용 시 1L 당 10원 할인',
        '주유량 50L 이상 시 추가 5% 할인',
        '전기차 충전 1kWh 당 10원 할인',
        '충전량 500kWh 이상 시 추가 5% 할인'
    ];

    const freeFeatures = [
        '최저가 주유소 길찾기 가능',
        '유가 관련 정보 열람 가능',
        '최적화 경로 탐색 가능',
        '불법 주유소 열람 가능',
        '주유소 즐겨찾기 가능'
    ];

    if (isLoading) return <div className="mypage-membership-container">로딩 중...</div>;

    return (
        <div className="mypage-membership-page">
            <header className="mypage-membership-header">
                <h1 className="mypage-membership-title">멤버십 관리</h1>
            </header>

            {membershipInfo ? (
                <div className="mypage-membership-tier-card mypage-membership-subscribed">
                    <h2 className="mypage-membership-tier-title">{membershipInfo.name}</h2>
                    <p className="mypage-membership-tier-subtitle">구독 {subscriptionDays}일째</p>                    
                    <ul className="mypage-membership-tier-features">
                        {premiumFeatures.map((feature, index) => (
                            <li key={index}>
                                <span className="mypage-membership-checkmark">✓</span> {feature}
                            </li>
                        ))}
                    </ul>
                    <button className="mypage-membership-tier-button mypage-membership-unsubscribe-btn" onClick={handleUnsubscribe}>
                        구독 해지
                    </button>
                </div>
            ) : (
                <div className="mypage-membership-benefits-wrapper">
                    <div className="mypage-membership-tier-card mypage-membership-free-section">
                        <h3 className="mypage-membership-feature-title">무료 서비스 혜택</h3>
                        <p className="mypage-membership-tier-subtitle">일반 사용자를 위한 기본 서비스</p>
                        <ul className="mypage-membership-tier-features">
                            {freeFeatures.map((feature, index) => (
                                <li key={index}>
                                    <span className="mypage-membership-checkmark">✓</span> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mypage-membership-tier-card mypage-membership-premium-section">
                        <h3 className="mypage-membership-feature-title">프리미엄 요금제 혜택</h3>
                        <p className="mypage-membership-tier-subtitle">구독 시 제공</p>
                        <ul className="mypage-membership-tier-features">
                            {premiumFeatures.map((feature, index) => (
                                <li key={index}>
                                    <span className="mypage-membership-checkmark">✓</span> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* 구독 시작 버튼과 가격을 아래로 분리 */}
            {!membershipInfo && (
                <div className="mypage-membership-subscribe-section">
                    <span className="mypage-membership-price">4,990원 / 월</span> {/* 가격 수정 */}
                    <button className="mypage-membership-tier-button mypage-membership-subscribe-btn mypage-membership-active" onClick={handleNavigateToDetail}>
                        구독 시작
                    </button>
                </div>
            )}
        </div>
    );
}

export default MyPageMembership;
