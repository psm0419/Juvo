import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlackJuyusoList from '../../../components/blackJuyuso/BlackJuyusoList'; 
import '../../../assets/css/detail/Blackjuyuso.css';

// 업종 매핑
const INDUSTRY_MAP = {
    'N': '주유소',
    'C': '주유소/충전소 겸업',
    'Y': '충전소',
};

// 위반 유형 매핑
const BLACK_TYPE_MAP = {
    0: '용도외판매',
    1: '품질기준부적합',
    2: '가짜석유취급',
    3: '정량미달판매',
};

function FilterItem({ label, name, value, onChange, options = [], isInput = false }) {
    return (
        <div className="bj-filter-item">
            <label>{label}</label>
            {isInput ? (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={`${label} 입력`}
                />
            ) : (
                <select name={name} value={value} onChange={onChange}>
                    <option value="">전체</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            )}
        </div>
    );
}

function Blackjuyuso() {
    const [currentPage, setCurrentPage] = useState(1);
    const [blackList, setBlackList] = useState([]);
    const [filters, setFilters] = useState({
        region: '',
        industry: '',
        name: '',
        type: '',
    });
    const itemsPerPage = 10;

    const fetchBlackList = async () => {
        try {
            const response = await axios.get('/api/admin/findProcessedBlack');
            console.log(response.data);
            setBlackList(response.data);
        } catch (error) {
            console.error('Error fetching black list:', error);
        }
    };

    useEffect(() => {
        fetchBlackList();
    }, []);

    const filterItem = (item) => {
        const regionMatch = filters.region === '' || (item.newAdr && item.newAdr.includes(filters.region));
        const industryMatch = filters.industry === '' || INDUSTRY_MAP[item.lpgYn] === filters.industry;
        const nameMatch = filters.name === '' || (item.osNm && item.osNm.includes(filters.name));
        const typeMatch = filters.type === '' || BLACK_TYPE_MAP[item.blackType] === filters.type;
        return regionMatch && industryMatch && nameMatch && typeMatch;
    };

    const filteredData = blackList.filter(filterItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const visibleData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const resetFilters = () => setFilters({ region: '', industry: '', name: '', type: '' });

    const regions = [...new Set(blackList.map((item) => item.newAdr ? item.newAdr.split(' ')[0] : ''))].filter(Boolean);
    const industries = Object.values(INDUSTRY_MAP);
    const types = Object.values(BLACK_TYPE_MAP);

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
                <FilterItem label="지역" name="region" value={filters.region} onChange={handleFilterChange} options={regions} />
                <FilterItem label="업종" name="industry" value={filters.industry} onChange={handleFilterChange} options={industries} />
                <FilterItem label="업체명" name="name" value={filters.name} onChange={handleFilterChange} isInput />
                <FilterItem label="위반유형" name="type" value={filters.type} onChange={handleFilterChange} options={types} />
                <button className="bj-reset-btn" onClick={resetFilters}>초기화</button>
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
                    <BlackJuyusoList data={visibleData}  BLACK_TYPE_MAP={BLACK_TYPE_MAP} INDUSTRY_MAP={INDUSTRY_MAP}/>
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

export default Blackjuyuso;