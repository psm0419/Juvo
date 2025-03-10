import '../../assets/css/admin/Admin.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import CustomerManagement from '../../components/admin/CustomerManagement';
import GasStationManagement from '../../components/admin/GasStationManagement';
import User from '../../assets/image/user.jpg'

function Admin() {
    const [activeTab, setActiveTab] = useState('customer'); // 기본값: 고객 관리

    return (
        <div className='adminContainer'>
            <div className='LContainer'>
                <div className='profile'>
                    <img src={User}/>
                    <h3 className='admin'> ' 관리자 이름 ' 님 </h3>
                </div>
                <div className='management'> 
                    <p className='user cusor' onClick={() => setActiveTab('customer')}> 고객 관리 </p>
                    <p className='juyuso cusor' onClick={() => setActiveTab('gasstation')}> 주유소 관리 </p>
                </div>
            </div>

            <div className='RContainer'>
                {activeTab === 'customer' ? <CustomerManagement /> : (activeTab === 'gasstation' ? <GasStationManagement /> : "오류" )}
            </div>
        </div>
    );
}

export default Admin;

