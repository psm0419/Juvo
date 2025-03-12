import axios from 'axios';
import { useState, useEffect } from 'react';
import Pagination from './Pagination';

function CustomerManagement() {
    const [customerList, setCustomerList] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        if (customer.userType !== 'CUS') return false;
        if (activeTab === 'all') return true;
        if (activeTab === 'normal') return customer.membership === 0;
        if (activeTab === 'pass') return customer.membership === 1;
        return false;
    });

    const removeUser = (id) => {
        const isConfirmed = window.confirm(`ID: ${id} 사용자를 정말 삭제하시겠습니까?`);
        if (isConfirmed) {
            axios.get(`/api/admin/removeUser?id=${id}`)
                .then(response => {
                    console.log(response.data);
                    if (response.data === "success") {
                        console.log("User deleted successfully");
                        fetchCustomerList();
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

    const totalItems = filteredCustomerList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredCustomerList.slice(startIndex, endIndex);

    const pageChange = (page) => {
        setCurrentPage(page);
    };

    const tabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <div>
            <h2>고객 관리</h2>
            <div className='customerContainer'>
                <div className="tabButtons">
                    <button 
                        className={activeTab === 'all' ? 'active' : ''} 
                        onClick={() => tabChange('all')}
                    > 전체</button>
                    <button 
                        className={activeTab === 'normal' ? 'active' : ''} 
                        onClick={() => tabChange('normal')}
                    > 일반회원 </button>
                    <button 
                        className={activeTab === 'pass' ? 'active' : ''} 
                        onClick={() => tabChange('pass')} 
                    > Pass 가입회원</button>
                </div>

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
                        {currentItems.length > 0 ? (
                            currentItems.map(customer => (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td>{customer.username}</td>
                                    <td>{customer.membership === 0 ? '일반회원' : 'Pass가입회원'}</td>
                                    <td>{customer.email}</td>
                                    <td>
                                        <button onClick={() => removeUser(customer.id)}>삭제</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">고객 목록이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={pageChange}
                />
            </div>
        </div>
    );
}

export default CustomerManagement;