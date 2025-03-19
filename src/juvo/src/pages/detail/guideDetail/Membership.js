import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/detail/Membership.css';
import PremiumStar from '../../../assets/image/PremiumStar.png';
import Free from '../../../assets/image/free.png';
import Swal from 'sweetalert2';

const Membership = () => {
    const navigate = useNavigate();

    const isLoggedIn = () => {
        return !!localStorage.getItem('accessToken');
    };

    const handleStartClick = () => {
        if (isLoggedIn()) {
            navigate('/detail/guideDetail/MembershipDetail');
        } else {
            Swal.fire({
                title: '경고',
                text: '로그인이 필요합니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                confirmButtonColor: '#f89400',  // 확인 버튼 색상 변경
                customClass: {
                    confirmButton: 'my-custom-button'  // 선택적으로 추가
                }
            }).then(() => {
                navigate('/user/login');
            });
        }
    };

    const tiers = [
        {
            title: 'JUVO PASS 이용안내',
            subtitle: '가장 저렴하게 주유소를 이용하는 방법',
            features: [
                'JUVO PASS 카드는 프리미엄 요금제 가입 시 자동으로 발급됩니다.',
                'JUVO 카드 사용 시 주유 1L 당 10원 할인 혜택을 받을 수 있습니다.',
                '한 번에 50L 이상 주유 시 추가 5% 할인을 받을 수 있습니다.',
                '전국 JUVO 제휴 주유소에서 사용 가능하며, 앱에서 주유소 목록을 확인할 수 있습니다.',
                '카드 분실 시 고객 지원센터를 통해 즉시 재발급 받을 수 있습니다.',
                '모든 할인 혜택은 현장에서 바로 적용됩니다.',
            ],
            highlighted: false,
        },
        {
            title: '무료 서비스',
            subtitle: '일반 사용자를 위한 기본 서비스',
            features: [
                '최저가 주유소 길찾기 ( 무료서비스 )',
                '최저가 충전소 길찾기 ( 무료서비스 )',
                '최적화 경로 탐색 가능 ( 무료서비스 )',
                '이메일 기반 고객 지원 ( 무료서비스 )',
            ],
            highlighted: false,
            icon: Free,
        },
        {
            title: '프리미엄 요금제',
            subtitle: '프리미엄 사용자 맞춤형 솔루션',
            price: '4,990원 / 월',
            features: [
                'JUVO PASS 카드 발급',
                'JUVO PASS 이용 시 L 당 10원 할인',
                '주유량 50L 이상 시 추가 5% 할인',
                '전기차 충전 1kWh 당 10원 할인',
                '충전량 500kWh 이상 시 추가 5% 할인',
            ],
            highlighted: true,
            icon: PremiumStar,
        },
    ];

    return (
        <div className="membership-page">
            <header className="membership-header">
                <h1 className="membership-title">JUVO Membership</h1>
                <div className="membership-toggle">
                    <button className="toggle-button active">월간</button>
                </div>
            </header>

            <div className="membership-tiers">
                {tiers.map((tier, index) => (
                    <div
                        key={index}
                        className={`membership-card ${tier.highlighted ? 'highlighted' : ''}`}
                    >
                        {tier.icon && (
                            <div className="card-icon">
                                <img src={tier.icon} alt={`${tier.title} Icon`} />
                            </div>
                        )}
                        <h2 className="card-title">{tier.title}</h2>
                        <p className="card-subtitle">{tier.subtitle}</p>
                        {tier.price && <p className="card-price">{tier.price}</p>}
                        {tier.title === '프리미엄 요금제' && (
                            <button className="card-button active" onClick={handleStartClick}>
                                지금 시작하기
                            </button>
                        )}
                        <ul className="card-features">
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