import '../../assets/css/admin/Admin.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import AdminManagement from '../../components/admin/AdminManagement';
import CustomerManagement from '../../components/admin/CustomerManagement';
import GasStationManagement from '../../components/admin/GasStationManagement';
import User from '../../assets/image/user.jpg'

function Admin() {
    const [activeTab, setActiveTab] = useState('admin'); // 기본값: 관리자 관리

    return (


        <div className="admin-layout">
            {/* 왼쪽 사이드바 */}
            <div className="admin-sidebar">
                <h2 className="sidebar-title">관리자페이지</h2>
                <div className="sidebar-nav">
                    <p className={`adminInfo cusor ${activeTab === 'admin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admin')}> 관리자 정보 </p>
                    <p className={`user cusor ${activeTab === 'customer' ? 'active' : ''}`}
                        onClick={() => setActiveTab('customer')}> 고객 관리  </p>
                    <p className={`juyuso cusor ${activeTab === 'gasstation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gasstation')}>  불법 주유소 신고 관리  </p>
                </div>
            </div>

            {/* 오른쪽 컨텐츠 영역 */}
            <div className="admin-content">
                {activeTab === 'admin' ? <AdminManagement /> : (activeTab === 'customer' ? <CustomerManagement /> : (activeTab === 'gasstation' ? <GasStationManagement /> : "오류"))}
            </div>
        </div>

    );
}

export default Admin;

