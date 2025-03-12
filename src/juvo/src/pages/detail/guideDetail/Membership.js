import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/detail/Membership.css';
import PremiumStar from '../../../assets/image/PremiumStar.png';

const Membership = () => {
    const navigate = useNavigate();

    // ✅ 로그인 상태 확인 함수 (JWT 토큰 여부)
    const isLoggedIn = () => {
        return !!localStorage.getItem('accessToken'); 
    };

    // ✅ "지금 시작하기" 버튼 클릭 시 실행할 함수
    const handleStartClick = () => {
        if (isLoggedIn()) {
            navigate('/detail/guideDetail/MembershipDetail'); // 로그인된 경우 MembershipDetail 이동
        } else {
            alert('로그인을 해주세요.');
            navigate('/user/login'); // ❌ 로그인 안 된 경우 로그인 페이지 이동
        }
    };

    const tiers = [
        {
            title: 'JUVO PASS 이용안내',
            subtitle: '가장 저렴하게 주유소를 이용하는 방법',
            features: [
                'JUVO PASS 카드는 프리미엄 요금제 가입 시 자동으로 발급됩니다.',
                'JUVO 카드 사용 시 주유 1L 당 10원 할인 혜택을 받을 수 있습니다.',
                '한 번에 50L 이상 주유 시 추가로 5% 할인을 받을 수 있습니다.',
                '전국 JUVO 제휴 주유소에서 사용 가능하며, 앱에서 주유소 목록을 확인할 수 있습니다.',
                '카드 분실 시 고객 지원센터를 통해 즉시 재발급 받을 수 있습니다.',
                '모든 할인 혜택은 현장에서 바로 적용됩니다.'
            ],
            highlighted: false,
        },
        {
            title: '무료 서비스',
            subtitle: '일반 사용자를 위한 기본 서비스',
            features: [
                '최저가 주유소 길찾기',
                '최저가 충전소 길찾기',
                '최적화 경로 탐색 가능',
                '이메일 기반 고객 지원',
            ],
            highlighted: false,
        },
        {
            title: '프리미엄 요금제',
            subtitle: '프리미엄 사용자 맞춤형 솔루션',
            price: '4,990원 / 월',
            features: [
                'JUVO PASS 카드 발급',
                'JUVO PASS 카드 이용 시 1L 당 10원 할인',
                '주유량 50L 이상 시 추가 5% 할인',
                '전기차 충전 1kWh 당 10원 할인',
                '충전량 500kWh 이상 시 추가 5% 할인'
            ],
            highlighted: false,
            icon: PremiumStar,
        },
    ];

    return (
        <div className="membership-page">
            <header className="membership-header">
                <h1>JUVO Membership</h1>
                <div className="toggle-switch">
                    <button className="toggle-button active">월간</button>
                </div>
            </header>

            <div className="membership-tiers">
                {tiers.map((tier, index) => (
                    <div
                        key={index}
                        className={`tier-card ${tier.highlighted ? 'highlighted' : ''}`}
                    >
                        {tier.icon && (
                            <div className="tier-icon">
                                <img src={tier.icon} alt={`${tier.title} Icon`} />
                            </div>
                        )}
                        <h2 className="tier-title">{tier.title}</h2>
                        <p className="tier-subtitle">{tier.subtitle}</p>
                        <p className="tier-price">{tier.price}</p>
                        {tier.title === '프리미엄 요금제' && (
                            <button
                                className="tier-button active"
                                onClick={handleStartClick} // ✅ 로그인 상태 검증 후 이동
                            >
                                지금 시작하기
                            </button>
                        )}
                        <ul className="tier-features">
                            {tier.features.map((feature, idx) => (
                                <li key={idx}>
                                    <span className="checkmark">✓</span> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Membership;
