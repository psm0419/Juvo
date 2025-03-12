import axios from 'axios';
import { useState, useEffect } from 'react';
import GasStationTabs from './GasStationTabs';
import GasStationTable from './GasStationTable';
import Pagination from './Pagination'; // Pagination 임포트

function GasStationManagement() {
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [blackList, setBlackList] = useState([]);
    const itemsPerPage = 10;

    const fetchBlackList = () => {
        axios.get('/api/admin/findBlack')
            .then(response => {
                console.log(response.data);
                setBlackList(response.data);
            })
            .catch(error => console.error('Error fetching black list:', error));
    };

    useEffect(() => {
        fetchBlackList();
    }, []);

    const filteredBlackList = blackList.filter(station => {
        if (activeTab === 'all') return true;
        if (activeTab === '용도외판매') return station.blackType === 0;
        if (activeTab === '품질기준부적합') return station.blackType === 1;
        if (activeTab === '가짜석유취급') return station.blackType === 2;
        if (activeTab === '정량미달판매') return station.blackType === 3;
        return false;
    });

    const modifyBlack = (uniId) => {
        if (window.confirm(`주유소 코드: ${uniId}를 블랙 주유소에 추가하시겠습니까?`)) {
            axios.post('/api/admin/modifyBlack', { uniId })
                .then(response => {
                    console.log(response.data);
                    if (response.data === "success") {
                        fetchBlackList();
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
                        fetchBlackList();
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
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredBlackList.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <>
            <h2>불법 주유소 관리</h2>
            <div className='gasContainer'>
                <GasStationTabs activeTab={activeTab} handleTabChange={handleTabChange} />
                <GasStationTable 
                    currentItems={currentItems} 
                    modifyBlack={modifyBlack} 
                    removeBlack={removeBlack} 
                />
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                />
            </div>
        </>
    );
}

export default GasStationManagement;