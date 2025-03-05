import React, { useState, useEffect } from 'react';
import '../../../assets/css/detail/Tax.css';

export default function Tax() {
    // 공통 부가세(VAT) 값
    const commonVat = "10%";

    // 유류세 데이터
    const [fuelTaxData, setFuelTaxData] = useState([
        { product: "보통휘발유", transportationTax: 450.00, individualConsumptionTax: "-", educationTax: "교통세의 15%", drivingTax: "교통세의 26%", salesSurcharge: "-" },
        { product: "고급휘발유", transportationTax: 450.00, individualConsumptionTax: "-", educationTax: "교통세의 15%", drivingTax: "교통세의 26%", salesSurcharge: "36.00" },
        { product: "실내경유", transportationTax: 289.00, individualConsumptionTax: "-", educationTax: "교통세의 15%", drivingTax: "교통세의 26%", salesSurcharge: "-" },
        { product: "자동차경유", transportationTax: 289.00, individualConsumptionTax: "-", educationTax: "교통세의 15%", drivingTax: "교통세의 26%", salesSurcharge: "-" },
        { product: "등유", transportationTax: "-", individualConsumptionTax: 63.00, educationTax: "개별소비세의 15%", drivingTax: "-", salesSurcharge: "-" },
        { product: "일반프로판(원/kg)", transportationTax: "-", individualConsumptionTax: 14.00, educationTax: "-", drivingTax: "-", salesSurcharge: "-" },
        { product: "일반부탄(원/kg)", transportationTax: "-", individualConsumptionTax: 212.00, educationTax: "개별소비세의 15%", drivingTax: "-", salesSurcharge: "62.28" },
        { product: "자동차부탄", transportationTax: "-", individualConsumptionTax: 123.81, educationTax: "개별소비세의 15%", drivingTax: "-", salesSurcharge: "36.37" },
        { product: "중유", transportationTax: "-", individualConsumptionTax: 17.00, educationTax: "개별소비세의 15%", drivingTax: "-", salesSurcharge: "-" },
    ]);

    // 전기차 충전 세금 데이터
    const [evTaxData, setEvTaxData] = useState([
        { type: "완속 충전 (AC)", vat: "10%", powerFund: "3.7%", transportationTax: "없음", environmentTax: "없음", note: "기본 요금 기준" },
        { type: "급속 충전 (DC)", vat: "10%", powerFund: "3.7%", transportationTax: "없음", environmentTax: "없음", note: "기본 요금 기준" },
        { type: "민간 충전소 (예: 테슬라)", vat: "10%", powerFund: "업체별 상이", transportationTax: "없음", environmentTax: "없음", note: "추가 서비스 요금 포함 가능" },
    ]);

    // 현재 선택된 탭 상태
    const [activeTab, setActiveTab] = useState('fuel'); // 'fuel' 또는 'ev'

    // 탭 전환 함수
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // 데이터 확인용 콘솔 로그
    useEffect(() => {
        console.log("fuelTaxData:", fuelTaxData);
        console.log("evTaxData:", evTaxData);
    }, [fuelTaxData, evTaxData]);

    return (
        <div className="tax-container">
            <div className="tax-header-container">
                <h1 className="tax-title">유류세 및 <br/>전기차 세금 정보</h1>
                <p className="tax-description">
                    유류세 및 전기차 충전 요금의 세율 및 기준 정보를 제공합니다.
                </p>
            </div>

            {/* 탭 UI */}
            <div className="tax-tab-container">
                <button
                    className={`tax-tab-button ${activeTab === 'fuel' ? 'active' : ''}`}
                    onClick={() => handleTabChange('fuel')}
                >
                    유류세 정보
                </button>
                <button
                    className={`tax-tab-button ${activeTab === 'ev' ? 'active' : ''}`}
                    onClick={() => handleTabChange('ev')}
                >
                    전기차 충전 세금
                </button>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="tax-tab-content">
                {activeTab === 'fuel' && (
                    <>
                        <div className="tax-table-container">
                            <table className="tax-data-table">
                                <thead>
                                    <tr>
                                        <th className="tax-table-header">제품</th>
                                        <th className="tax-table-header">교통세</th>
                                        <th className="tax-table-header">개별소비세</th>
                                        <th className="tax-table-header">교육세</th>
                                        <th className="tax-table-header">주행세</th>
                                        <th className="tax-table-header">판매부과금</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fuelTaxData.map((item, index) => (
                                        <tr key={index} className="tax-table-row">
                                            <td className="tax-table-cell">{item.product}</td>
                                            <td className="tax-table-cell">{item.transportationTax !== "-" ? item.transportationTax.toFixed(2) : "-"}</td>
                                            <td className="tax-table-cell">{typeof item.individualConsumptionTax === "number" ? item.individualConsumptionTax.toFixed(2) : item.individualConsumptionTax}</td>
                                            <td className="tax-table-cell">{typeof item.educationTax === "number" ? item.educationTax.toFixed(2) : item.educationTax}</td>
                                            <td className="tax-table-cell">{item.drivingTax}</td>
                                            <td className="tax-table-cell">{typeof item.salesSurcharge === "number" ? item.salesSurcharge.toFixed(2) : item.salesSurcharge}</td>
                                        </tr>
                                    ))}
                                    {/* 부가세(VAT)를 별도 행으로 추가 */}
                                    <tr>
                                        <td colSpan="6" className="tax-table-cell tax-vat-row">
                                            부가세 (VAT): {commonVat} 는 공통사항 입니다.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="tax-note-container">
                            <h3 className="tax-note-title">※ 유의사항</h3>
                            <p className="tax-note-text">
                                - 고급세 = 교통에너지환경세<br />
                                - 일반적으로 석유수입 관세는 수입가격의 3%, 석유수입 부과금은 16원/리터 이나 변동될 수 있음
                            </p>
                        </div>
                    </>
                )}

                {activeTab === 'ev' && (
                    <>
                        <div className="tax-table-container">
                            <table className="tax-data-table">
                                <thead>
                                    <tr>
                                        <th className="tax-table-header">충전 유형</th>
                                        <th className="tax-table-header">부가가치세 (VAT)</th>
                                        <th className="tax-table-header">전력산업기반기금</th>
                                        <th className="tax-table-header">교통에너지환경세</th>
                                        <th className="tax-table-header">환경개선부담금</th>
                                        <th className="tax-table-header">비고</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evTaxData.map((item, index) => (
                                        <tr key={index} className="tax-table-row">
                                            <td className="tax-table-cell">{item.type}</td>
                                            <td className="tax-table-cell">{item.vat}</td>
                                            <td className="tax-table-cell">{item.powerFund}</td>
                                            <td className="tax-table-cell">{item.transportationTax}</td>
                                            <td className="tax-table-cell">{item.environmentTax}</td>
                                            <td className="tax-table-cell">{item.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="tax-note-container">
                            <h3 className="tax-note-title">※ 유의사항</h3>
                            <p className="tax-note-text">
                                - 전기차 충전 요금에는 교통에너지환경세와 환경개선부담금이 부과되지 않습니다.<br />
                                - 민간 충전소는 업체별로 추가 서비스 요금이 부과될 수 있습니다.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}