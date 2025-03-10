import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../../assets/css/user/myPage/MyPageLayout.css';

function MyPageLayout() {
    return (
        <div className="mypage-layout">
            {/* 왼쪽 사이드바 */}
            <div className="mypage-sidebar">
                <h2 className="sidebar-title">마이페이지</h2>
                <nav className="sidebar-nav">
                    <NavLink 
                        to="/mypage/profile" 
                        className={({ isActive }) => 
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        내 정보
                    </NavLink>
                    <NavLink 
                        to="/mypage/favorites" 
                        className={({ isActive }) => 
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        즐겨찾기
                    </NavLink>
                    <NavLink 
                        to="/mypage/membership" 
                        className={({ isActive }) => 
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        멤버십
                    </NavLink>
                </nav>
            </div>
            
            {/* 오른쪽 컨텐츠 영역 */}
            <div className="mypage-content">
                <Outlet />
            </div>
        </div>
    );
}

export default MyPageLayout; 