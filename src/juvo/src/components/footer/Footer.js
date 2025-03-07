import '../../assets/css/footer/Footer.css';
import { useState, useEffect } from 'react';

function Footer() {
    const [showTopButton, setShowTopButton] = useState(false);

    // 정책 항목 배열 정의
    const policies = [
        { name: 'Law', label: '법률', path: '/detail/guideDetail/Law' },
        { name: 'LocationServiceTerms', label: '위치서비스약관', path: '/detail/guideDetail/LocationServiceTerms' },
        { name: 'PrivacyPolicy', label: '개인정보정책', path: '/detail/guideDetail/PrivacyPolicy' },
        { name: 'RefundPolicy', label: '환불정책', path: '/detail/guideDetail/RefundPolicy' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowTopButton(true);
            } else {
                setShowTopButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div className='containerFT'>
                <div className='footerTop'>
                    <img src="https://www.opinet.co.kr/images/user/main/knoc_logo.jpg" alt="KNOC:한국석유공사"/>
                    <img src="https://www.opinet.co.kr/images/user/main/foot_logo_2.gif" alt="산업통산자원부"/>
                </div>
                <div className='footerMiddle'>
                    {policies.map((policy, index) => (
                        <span key={policy.name}>
                            <a href={policy.path} className="policyLink">
                                {policy.label}
                            </a>
                            {index < policies.length - 1 && <span className="pipe">|</span>}
                        </span>
                    ))}
                </div>
                <div className='footerBottom'>
                    <p> (31144)충남 천안시 동남구 대흥동 134 3교육실  사업자번호 000-00-00000 대표전화 041-561-1122</p>
                    <p className="copyright"> COPYRIGHT(C) 2025 BY JUVO. ALL RIGHTS RESERVED. </p>
                </div>
            </div>
            {showTopButton && (
                <button className="topButton" onClick={scrollToTop}>TOP</button>
            )}
        </>
    );
}

export default Footer;