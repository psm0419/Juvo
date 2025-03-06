import React from 'react';
import '../../../assets/css/detail/RefundPolicy.css';

const RefundPolicy = () => {
    return (
        <div className="refund-container">
            <h1>환불 정책</h1>
            <p>
                JUVO 주식회사(이하 "회사"라 합니다)는 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 회원의 권익을 보호하기 위해 다음과 같은 환불 정책을 수립·공개합니다.
            </p>

            <section className="refund-section">
                <h2>제1조 (환불 가능 사유)</h2>
                <p>회원은 다음 경우에 환불을 요청할 수 있습니다.</p>
                <ol>
                    <li>서비스 결함: 회사의 귀책 사유로 서비스가 정상적으로 제공되지 않은 경우.</li>
                    <li>계약 철회: 서비스 이용 계약을 철회한 경우(단, 법정 철회 기간 내).</li>
                    <li>오결제: 결제 오류로 인해 의도하지 않은 금액이 결제된 경우.</li>
                </ol>
            </section>

            {/* 나머지 조항 추가 */}

            <section className="refund-section">
                <h2>부칙</h2>
                <p>본 환불 정책은 2025년 3월 26일부터 시행합니다.</p>
            </section>
        </div>
    );
};

export default RefundPolicy;