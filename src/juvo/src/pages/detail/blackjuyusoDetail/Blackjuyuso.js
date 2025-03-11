import React, { useState } from 'react';
import '../../../assets/css/detail/Blackjuyuso.css';

export default function Blackjuyuso() {
    const allData = [
        { type: "용도외판매", industry: "주유소", name: "장화주유소", address: "전북 김제시 벽골제로 637 (장화동)"},
        { type: "가짜석유취급", industry: "주유소", name: "칠송정주유소", address: "경북 칠곡군 가산면 인동가산로 827"},
        { type: "용도외판매", industry: "일반판매소", name: "SK동방에너지", address: "부산광역시 북구 백양대로1016번나길 76-11"},
        { type: "용도외판매", industry: "일반판매소", name: "연수에너지", address: "인천광역시 중구 제물량로241번길 24"},
        { type: "용도외판매", industry: "일반판매소", name: "대구에너지", address: "대구광역시 서구 당산로67길 8"},
        { type: "가짜석유취급", industry: "일반판매소", name: "작전석유", address: "경기도 부천시 소사구 경인로216번길 61 (심곡본동)"},
        { type: "가짜석유취급", industry: "주유소", name: "㈜케이씨 양주주유소", address: "경기 양주시 은현면 화합로 1174"},
        { type: "가짜석유취급", industry: "주유소", name: "수동주유소", address: "경기 남양주시 수동면 비룡로 815"},
        { type: "용도외판매", industry: "일반판매소", name: "태성에너지", address: "경상북도 문경시 영순면 사근왕태길 24-1"},
        { type: "가짜석유취급", industry: "일반판매소", name: "대성석유", address: "인천광역시 미추홀구 미추홀대로697번길16 (주안동)"},
        { type: "용도외판매", industry: "일반판매소", name: "행복에너지", address: "경기도 여주시 대신면 하림3길 24, 113호"},
        { type: "용도외판매", industry: "주유소", name: "성곡IC주유소", address: "경북 포항시 북구 흥해읍 동해대로 1119" },
        { type: "용도외판매", industry: "일반판매소", name: "원에너지", address: "대구광역시 서구 국채보상로81길 11"},
        { type: "용도외판매", industry: "일반판매소", name: "덕산에너지", address: "경상남도 창원시 의창구 동읍 용잠로 17"},
        { type: "용도외판매", industry: "일반판매소", name: "신화에너지", address: "경기도 파주시 적성면 율곡로 1455-4"},
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        region: '',
        industry: '',
        name: '',
        owner: '',
        type: '',
    });
    const itemsPerPage = 10;

    const filteredData = allData.filter((item) => {
        return (
            (filters.region === '' || item.address.includes(filters.region)) &&
            (filters.industry === '' || item.industry === filters.industry) &&
            (filters.name === '' || item.name.includes(filters.name)) &&
            (filters.owner === '' || item.owner.includes(filters.owner)) &&
            (filters.type === '' || item.type === filters.type)
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const visibleData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const regions = [...new Set(allData.map((item) => item.address.split(' ')[0]))];
    const industries = [...new Set(allData.map((item) => item.industry))];
    const types = [...new Set(allData.map((item) => item.type))];

    return (
        <div className="bj-container">
            <div className="bj-header-container">
                <h3 className="bj-title">불법,적발 주유소</h3>
                <p className="bj-description">
                    본 내용은 각 지방자치단체에서 직접 게시한 사항이오니, <br/>
                    공표와 관련한 자세한 내용은 해당 기관에 문의하시기 바랍니다.
                </p>
            </div>
            <div className="bj-filter-container">
                <div className="bj-filter-item">
                    <label>지역</label>
                    <select name="region" value={filters.region} onChange={handleFilterChange}>
                        <option value="">전체</option>
                        {regions.map((region) => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>
                <div className="bj-filter-item">
                    <label>업종</label>
                    <select name="industry" value={filters.industry} onChange={handleFilterChange}>
                        <option value="">전체</option>
                        {industries.map((industry) => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>
                </div>
                <div className="bj-filter-item">
                    <label>업체명</label>
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="업체명 입력"
                    />
                </div>
                <div className="bj-filter-item">
                    <label>위반유형</label>
                    <select name="type" value={filters.type} onChange={handleFilterChange}>
                        <option value="">전체</option>
                        {types.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <button
                    className="bj-reset-btn"
                    onClick={() => setFilters({ region: '', industry: '', name: '', owner: '', type: '' })}
                >
                    초기화
                </button>
            </div>
            <div className="bj-table-container">
                <table className="bj-data-table">
                    <thead>
                        <tr>
                            <th className="bj-table-header">위반유형</th>
                            <th className="bj-table-header">업종</th>
                            <th className="bj-table-header">업체명</th>
                            <th className="bj-table-header">주소</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleData.length > 0 ? (
                            visibleData.map((item, index) => (
                                <tr key={index} className="bj-table-row">
                                    <td className="bj-table-cell">{item.type}</td>
                                    <td className="bj-table-cell">{item.industry}</td>
                                    <td className="bj-table-cell">{item.name}</td>
                                    <td className="bj-table-cell">{item.address}</td>
                                    <td className="bj-table-cell">{item.owner}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="bj-table-cell bj-no-data">검색 결과가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="bj-pagination">
                <button
                    className="bj-page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={`bj-page-btn ${currentPage === page ? 'bj-active' : ''}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
                <button
                    className="bj-page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
}