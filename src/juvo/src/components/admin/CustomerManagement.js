import axios from 'axios';
import { useState, useEffect } from 'react';

function CustomerManagement() {

    // 예시 고객 데이터
    const [customerList, setCustomerList] = useState([]);

    // 탭 상태 관리
    const [activeTab, setActiveTab] = useState('all');
    
    // 페이지 상태 관리
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 데이터 가져오기
    const fetchCustomerList = () => {
        axios.get('/api/admin/user')
            .then(response => {
                console.log(response.data);
                setCustomerList(response.data);
            })
            .catch(error => console.error('Error fetching user list:', error));
    };

    useEffect(() => {
        fetchCustomerList();
    }, []);

    const filteredCustomerList = customerList.filter(customer => {
        if (customer.userType !== 'CUS') return false; // 고객만 표시
        if (activeTab === 'all') return true;
        if (activeTab === 'normal') return customer.membership === 0;
        if (activeTab === 'pass') return customer.membership === 1;
        return false;
    });

    // 삭제 함수
    const removeUser = (id) => {
        const isConfirmed = window.confirm(`ID: ${id} 사용자를 정말 삭제하시겠습니까?`);
        if (isConfirmed) {
            // "확인" 선택 시 삭제 요청
            axios.get(`/api/admin/removeUser?id=${id}`)
                .then(response => {
                    console.log(response.data);
                    if (response.data === "success") {
                        console.log("User deleted successfully");
                        fetchCustomerList(); // 삭제 성공 시 목록 갱신
                    } else {
                        console.log("Delete failed");
                        alert("사용자 삭제에 실패했습니다.");
                    }
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                    alert("삭제 중 오류가 발생했습니다.");
                });
        } else {
            console.log("Deletion canceled by user");
        }
    };

    // 페이지네이션 계산
    const totalItems = filteredCustomerList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredCustomerList.slice(startIndex, endIndex);
    

    // 페이지 변경
    const pageChange = (page) => { setCurrentPage(page); };

    // 탭 변경 시 페이지 초기화
    const tabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // 탭 변경 시 첫 페이지로 이동
    };

    return (
        <div>
            <h2>고객 관리</h2>
            <div className='customerContainer'>
                {/* 탭 버튼 */}
                <div className="tabButtons">
                    <button 
                        className={activeTab === 'all' ? 'active' : ''} 
                        onClick={() => tabChange('all')}
                    > 전체</button>
                    <button 
                        className={activeTab === 'normal' ? 'active' : ''} 
                        onClick={() => tabChange('normal')}
                    > 일반회원 </button>
                    <button className={activeTab === 'pass' ? 'active' : ''} 
                        onClick={() => tabChange('pass')} 
                    > Pass 가입회원</button>
                </div>

                {/* 고객 목록 테이블 */}
                <table>
                    <thead>
                        <tr>
                            <th>고객 ID</th>
                            <th>이름</th>
                            <th>회원 유형</th>
                            <th>이메일</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentItems.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.username}</td>
                                <td>{customer.membership === 0 ? '일반회원' : 'Pass가입회원'}</td>
                                <td>{customer.email}</td>
                                <td>
                                    <button onClick={()=>removeUser(customer.id)}>삭제</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* 페이지네이션 */}
                <div className="pagination">
                    <button 
                        onClick={() => pageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    > ◁ </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => pageChange(page)}
                            className={currentPage === page ? 'active' : ''}
                        > {page} </button>
                    ))}
                    
                    <button
                        onClick={() => pageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    > ▷ </button>
                </div>
            </div>
        </div>
    );
}

export default CustomerManagement;