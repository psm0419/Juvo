import axios from 'axios';
import { useState, useEffect } from 'react';

function GasStationManagement() {
    // 탭 상태 관리
    const [activeTab, setActiveTab] = useState('all');
    // 페이지 상태 관리
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 주유소
    const [blackList, setBlackList] = useState([]);

    // 데이터 가져오기
    const fetchBlackList = () => {
        axios.get('/api/admin/blackJuyuso')
            .then(response => {
                console.log(response.data);
                setBlackList(response.data);
            })
            .catch(error => console.error('Error fetching black list:', error));
    };

    useEffect(() => {
        fetchBlackList();
    }, []);

    // 탭에 따라 필터링된 주유소 목록
    const filteredBlackList = blackList.filter(station => {
        if (activeTab === 'all') return true;
        if (activeTab === '용도외판매') return station.blackType === 0;
        if (activeTab === '품질기준부적합') return station.blackType === 1;
        if (activeTab === '가짜석유취급') return station.blackType === 2;
        if (activeTab === '정량미달판매') return station.blackType === 3;
        return false;
    });

    // 삭제 함수
    const removeBlack = (uniId) => {
        if (window.confirm(`주유소 코드: ${uniId}를 정말 삭제하시겠습니까?`)) {
            axios.get(`/api/admin/removeBlack?uniId=${uniId}`)
                .then(response => {
                    console.log(response.data);
                    if (response.data === "success") {
                        fetchBlackList(); // 삭제 성공 시 목록 갱신
                    } else {
                        alert("주유소 삭제에 실패했습니다.");
                    }
                })
                .catch(error => {
                    console.error('Error deleting gas station:', error);
                    alert("삭제 중 오류가 발생했습니다.");
                });
        }
    };

    // 페이지네이션 계산
    const totalItems = filteredBlackList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredBlackList.slice(startIndex, endIndex);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 탭 변경 핸들러
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // 탭 변경 시 첫 페이지로 이동
    };

    return (
        <>
            <h2>불법 주유소 관리</h2>
            <div className='gasContainer'>
                {/* 탭 버튼 */}
                <div className="tabButtons">
                    <button
                        className={activeTab === 'all' ? 'active' : ''}
                        onClick={() => handleTabChange('all')}
                    > 전체 </button>
                    <button
                        className={activeTab === '용도외판매' ? 'active' : ''}
                        onClick={() => handleTabChange('용도외판매')}
                    > 용도외판매 </button>
                    <button
                        className={activeTab === '품질기준부적합' ? 'active' : ''}
                        onClick={() => handleTabChange('품질기준부적합')}
                    > 품질기준부적합 </button>
                    <button
                        className={activeTab === '가짜석유취급' ? 'active' : ''}
                        onClick={() => handleTabChange('가짜석유취급')}
                    > 가짜석유취급 </button>
                    <button
                        className={activeTab === '정량미달판매' ? 'active' : ''}
                        onClick={() => handleTabChange('정량미달판매')}
                    > 정량미달판매  </button>
                </div>

                {/* 주유소 목록 테이블 */}
                <table>
                    <thead>
                        <tr>
                            <th>주유소 코드</th>
                            <th>위반 유형</th>
                            <th>업종 구분</th>
                            <th>상호</th>
                            <th>도로명 주소</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((station) => (
                                <tr key={station.uniId}>
                                    <td>{station.uniId}</td>
                                    <td>
                                        {station.blackType === 0 ? '용도외판매' :
                                            station.blackType === 1 ? '품질기준부적합' :
                                            station.blackType === 2 ? '가짜석유취급' :
                                            station.blackType === 3 ? '정량미달판매' : '알 수 없음'}
                                    </td>
                                    <td>{station.lpgYn === 'Y' ? 'LPG' : '주유소'}</td>
                                    <td>{station.osNm}</td>
                                    <td>{station.newAdr}</td>
                                    <td>
                                        <button>추가</button>
                                        <button onClick={() => removeBlack(station.uniId)}>삭제</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">불법 주유소 목록이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* 페이지네이션 */}
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    > ◁ </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? 'active' : ''}
                        > {page} </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    > ▷ </button>
                </div>
            </div>
        </>
    );
}

export default GasStationManagement;