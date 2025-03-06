import React from 'react';
import '../../../assets/css/detail/Guide.css';

export default function Guide() {
    return (
        <div className="guide-container">
            <div className="guide-header-container">
                <h1 className="guide-title">JUVO</h1>
                <p className="guide-description">
                    JUVO 이용안내.
                </p>
            </div>
            <div className="guide-content-container">
                <h2 className="guide-subtitle">JUVO 란</h2>
                <p className="guide-text">
                    “JUVO는 ‘주유(油)’랑 ‘VOLT’를 합친 단어로,<br/>
                    내연기관 차량이든 전기차든 누구나 쉽게 주유소나 충전소 정보를 찾을 수 있도록 돕는 서비스 입니다. <br/>
                </p>

                <h2 className="guide-subtitle">이용 방법</h2>
                <ul className="guide-list">
                    <li>홈페이지 접속: JUVO 메인 홈페이지(<a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer">www.juvo.co.kr</a>)에 접속합니다.</li>
                    <li>지역 선택: 원하는 지역을 선택하여 해당 지역의 주유소 정보를 확인합니다.</li>
                    <li>유종 선택: 휘발유, 경유, 전기 등 원하는 유종을 선택하여 가격을 비교합니다.</li>
                    <li>상세 정보 확인: 주유소 이름, 주소, 전화번호 등 상세 정보를 확인할 수 있습니다.</li>
                    <li>유류세 조회: 보통,고급 휘발유,선박,자동차용 경유,전기차 등 해당하는 유종에 대한 세금을 확인할 수 있습니다.</li>

                </ul>

                <h2 className="guide-subtitle">유의사항</h2>
                <ul className="guide-list">
                    <li>제공되는 유가 정보는 실시간으로 갱신되지만, 일부 주유소의 정보는 지연될 수 있습니다.</li>
                    <li>가격 정보는 참고용이며, 실제 주유소 방문 시 가격이 다를 수 있습니다.</li>
                    <li>서비스 이용 중 문제가 발생할 경우, 고객센터(041-561-1122)로 문의해 주세요.</li>
                </ul>

                <h2 className="guide-subtitle">문의처</h2>
                <p className="guide-text">
                    JUVO 고객센터: 041-561-1122 (평일 09:00 ~ 18:00)<br />
                    이메일: JUVO@naver.com
                </p>
            </div>
        </div>
    );
}