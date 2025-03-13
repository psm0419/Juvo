import React from 'react';
import '../../../assets/css/detail/Guide.css';

export default function Guide() {
    return (
        <div className="guide-container">
            <div className="guide-header">
                <h1 className="guide-title">JUVO</h1>
            </div>
            <div className="guide-content">
                <h2 className="guide-subtitle">JUVO란</h2>
                <p className="guide-text">
                    “JUVO는 ‘주유(油)’와 ‘VOLT’를 합친 단어로,<br />
                    내연기관 차량이든 전기차든 누구나 쉽게 주유소나 충전소 정보를 찾을 수 있도록 돕는 서비스입니다.”
                </p>

                <h2 className="guide-subtitle">이용 방법</h2>
                <ul className="guide-list">
                    <li>홈페이지 접속: JUVO 메인 홈페이지(<a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer">www.juvo.co.kr</a>)에 접속합니다.</li>
                    <li>유가 조회: 메인페이지에서 지역과 유종을 선택하여 저렴한 주유소 TOP5를 확인하실 수 있습니다.</li>
                    <li>유가추이: 선택한 지역의 7일간의 해당하는 유종의 유가추이를 확인하실 수 있습니다.</li>
                    <li>시도별 평균: 시도별 휘발유의 평균 유가를 확인하실 수 있습니다.</li>
                    <li>주유소 찾기: 지역과 사용자가 원하는 주유소 브랜드와 부가정보를 선택하여 조회합니다.</li>
                    <li>충전소 찾기: 전기차 사용자를 위해 각 시도별 전기차 충전소를 확인하실 수 있습니다.</li>
                    <li>주유소,충전소 상세 정보 확인: 조회를 누르시면 주유소 이름, 주소, 전화번호 등 상세 정보를 확인할 수 있습니다.</li>
                    <li>주유소 신고:주유소를 선택하고 유저들이 불법행위를 하는  주유소를 직접 신고하실 수 있습니다.     관리자가 검토 후 해당 주유소 제제 예정입니다.</li>

                    <li>환산 정보: 단위환산이 가능하며 일반석유제품 달러/배럴 , 원/배럴 등등 실시간 환율로 계산 하실 수 있습니다.</li>
                    <li>유류세 조회: 휘발유, 고급 휘발유, 경유, 전기차 등 해당하는 유종에 대한 세금을 확인할 수 있습니다.</li>
                    <li>불법 주유소: 불법 행위를 한 주유소를 확인하실 수 있으며, 주유 전 확인해 주시길 바랍니다.</li>
                    <li>자주 묻는 질문(FAQ): 유저들이 자주 질문을 하신 내용을 정리하였습니다.</li>
                    <li>JUVO 멤버십: 가입자에 한 해서 JUVO 카드 이용 시 혜택을 누릴 수 있습니다.</li>

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