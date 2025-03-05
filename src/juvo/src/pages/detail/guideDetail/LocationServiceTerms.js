import React from 'react';
import '../../../assets/css/detail/LocationServiceTerms.css';

const LocationServiceTerms = () => {
    return (
        <div className="terms-container">
            <h1>위치기반서비스 이용약관</h1>

            <section className="terms-section">
                <h2>제1조 (목적)</h2>
                <p>
                    본 약관은 회원(JUVO 주식회사의 서비스 약관에 동의한 자를 말하며 이하 '회원'이라고 합니다)이 JUVO 주식회사(이하 '회사'라고 합니다)가 제공하는 웹페이지의 서비스를 이용함에 있어 회원과 회사의 권리 및 의무, 기타 제반 사항을 정하는 것을 목적으로 합니다.
                </p>
            </section>

            <section className="terms-section">
                <h2>제2조 (가입자격)</h2>
                <p>
                    서비스에 가입할 수 있는 회원은 위치기반서비스를 이용할 수 있는 이동전화 단말기의 소유자 본인이어야 합니다.
                </p>
            </section>

            <section className="terms-section">
                <h2>제3조 (서비스 가입)</h2>
                <p>회사는 다음 각 호에 해당하는 가입신청을 승낙하지 않을 수 있습니다.</p>
                <ol>
                    <li>실명이 아니거나 타인의 명의를 사용하는 등 허위로 신청하는 경우</li>
                    <li>고객 등록 사항을 누락하거나 오기하여 신청하는 경우</li>
                    <li>공공질서 또는 미풍양속을 저해하거나 저해할 목적을 가지고 신청하는 경우</li>
                    <li>기타 회사가 정한 이용신청 요건이 충족되지 않았을 경우</li>
                </ol>
            </section>

            {/* 나머지 조항들도 위와 같은 방식으로 추가 */}

            <section className="terms-section">
                <h2>부칙</h2>
                <ol>
                    <li>법인명: JUVO 주식회사</li>
                    <li>대표이사: 박수민</li>
                    <li>소재지: 충남 천안시 동남구 대흥동 134 휴먼교육센터 7층</li>
                    <li>연락처: 041-561-1122</li>
                </ol>
                <h3>제1조 (시행일)</h3>
                <p>본 약관은 2025.03.26.부터 시행합니다.</p>
                <h3>제2조 (위치정보관리책임자)</h3>
                <p>위치정보관리책임자는 2025.02.26.를 기준으로 다음과 같이 지정합니다.</p>
                <ol>
                    <li>소속: JUVO</li>
                    <li>성명: 박수민</li>
                    <li>직위: 팀장</li>
                    <li>전화: 041-561-1122</li>
                </ol>
            </section>
        </div>
    );
};

export default LocationServiceTerms;