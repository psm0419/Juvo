import axios from 'axios';
import { useState, useEffect } from 'react';
import GasStationTabs from './GasStationTabs';
import GasStationTable from './GasStationTable';
import Pagination from './Pagination';

function GasStationManagement() {
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [blackList, setBlackList] = useState([]); // 신고접수된 블랙주유소 목록
    const [allBlackList, setAllBlackList] = useState([]); // 모든 블랙주유소 목록
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 10;

    // 신고접수된 블랙주유소 목록 가져오기
    const fetchBlackList = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/admin/findBlack');
            console.log('신고접수된 블랙주유소:', response.data); // 데이터 확인
            setBlackList(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching black list:', error);
            setBlackList([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 모든 블랙주유소 목록 가져오기
    const fetchAllBlackList = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/admin/findBlackAll');
            console.log('모든 블랙주유소:', response.data); // 데이터 확인
            setAllBlackList(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching all black list:', error);
            setAllBlackList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'reported') {
            fetchBlackList();
        } else {
            fetchAllBlackList();
        }
    }, [activeTab]);

    useEffect(() => {
        setCurrentPage(1); // 데이터가 변경될 때마다 첫 페이지로 초기화
    }, [activeTab, blackList, allBlackList]);

    const filteredBlackList = activeTab === 'reported'
        ? blackList
        : allBlackList.filter(station => {
            if (!station) return false;
            if (activeTab === 'all') return true;
            if (activeTab === '용도외판매') return station.blackType === 1;
            if (activeTab === '품질기준부적합') return station.blackType === 2;
            if (activeTab === '가짜석유취급') return station.blackType === 3;
            if (activeTab === '정량미달판매') return station.blackType === 4;
            return false;
        });

        const modifyBlack = (uniId) => {
            if (window.confirm(`주유소 코드: ${uniId}를 블랙 주유소에 추가하시겠습니까?`)) {
                axios.post('/api/admin/modifyBlack', { uniId })
                    .then(response => {
                        console.log(response.data);
                        if (response.data === "success") {
                            // 상태를 즉시 갱신
                            if (activeTab === 'reported') {
                                setBlackList(prev =>
                                    prev.map(item =>
                                        item.uniId === uniId ? { ...item, status: 1 } : item
                                    )
                                );
                                fetchBlackList(); // 서버에서 최신 데이터 가져오기
                            } else {
                                setAllBlackList(prev =>
                                    prev.map(item =>
                                        item.uniId === uniId ? { ...item, status: 1 } : item
                                    )
                                );
                                fetchAllBlackList();
                            }
                            alert("주유소가 성공적으로 수정되었습니다.");
                        } else {
                            alert("주유소 수정에 실패했습니다.");
                        }
                    })
                    .catch(error => {
                        console.error('Error modifying gas station:', error);
                        alert("수정 중 오류가 발생했습니다.");
                    });
            }
        };

    const removeBlack = (uniId) => {
        if (window.confirm(`주유소 코드: ${uniId}를 블랙주유소에서 삭제하시겠습니까?`)) {
            axios.get(`/api/admin/removeBlack?uniId=${uniId}`)
                .then(response => {
                    console.log(response.data);
                    if (response.data === "success") {
                        if (activeTab === 'reported') {
                            fetchBlackList();
                        } else {
                            fetchAllBlackList();
                        }
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

    const totalItems = filteredBlackList.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage)); 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredBlackList.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        const newPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(newPage);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div>;

    return (
        <div className="admin-layout">
            <div className="admin-content">
                <h2>불법 주유소 신고 관리</h2>
                <div className="gasContainer">
                    <GasStationTabs activeTab={activeTab} handleTabChange={handleTabChange} />
                    <GasStationTable 
                        currentItems={currentItems} 
                        modifyBlack={modifyBlack} 
                        removeBlack={removeBlack} // removeBlack prop 추가
                        activeTab={activeTab}
                    />
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange} 
                    />
                </div>
            </div>
        </div>
    );
}

export default GasStationManagement;