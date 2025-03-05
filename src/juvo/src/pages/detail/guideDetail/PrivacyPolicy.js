import React from 'react';
import '../../../assets/css/detail/PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="policy-container">
            <h1>개인정보 처리방침</h1>
            <p>
                JUVO 주식회사(이하 "회사"라 합니다)는 「개인정보 보호법」 및 「위치정보의 보호 및 이용 등에 관한 법률」에 따라 회원의 개인정보를 보호하고, 이와 관련된 고충을 신속히 처리하기 위해 다음과 같은 개인정보 처리방침을 수립·공개합니다.
            </p>
            <br/>
            <section className="policy-section">
                <h2>제1조 (개인정보의 처리 목적)</h2>
                <p>회사는 다음의 목적을 위해 개인정보를 처리합니다...</p>
                <ol>
                    <li>서비스 제공: 위치기반서비스, 상품 정보 제공, 길 안내 등 생활편의 서비스 제공.</li>
                    <li>마케팅 및 광고: 이벤트 정보, 프로모션 혜택 알림 제공.</li>
                    <li>민원 처리: 고객 문의 응대 및 처리.</li>
                </ol>
            </section>

            {/* 나머지 조항은 약관과 동일한 방식으로 추가 */}

            <section className="policy-section">
                <h2>부칙</h2>
                <p>본 개인정보 처리방침은 2025년 3월 26일부터 시행합니다.</p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;