import '../../assets/css/header/Header.css';
import Logo from '../../assets/image/Logo.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [userType, setUserType] = useState(null); // userType 상태 추가

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const type = localStorage.getItem('userType'); // userType 가져오기
        setIsLogin(!!token);
        setUserType(type); // userType 설정
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('accessToken');
            const type = localStorage.getItem('userType');
            setIsLogin(!!token);
            setUserType(type); // storage 변경 시 userType도 업데이트
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userType'); // userType도 제거
        setIsLogin(false);
        setUserType(null); // 상태 초기화
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    const handleMyPageClick = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login'); // 로그인 페이지로 이동
            return;
        }
        navigate("/myPage/profile"); // CUS용 마이페이지 경로
    };

    const handleAdminClick = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        navigate("/admin"); // ADM용 관리자 페이지 경로
    };

    const menuItems = {
        '주유소찾기': [
            { name: 'Region', label: '주유소/충전소', path: '/Juyuso' },
        ],
        '유가관련정보': [
            { name: 'Conversion', label: '환산정보', path: '/detail/oilinfoDetail/Conversion' },
            { name: 'Tax', label: '세금정보', path: '/detail/oilinfoDetail/Tax' },
        ],
        '불법행위공표': [
            { name: 'Blackjuyuso', label: '불법주유소', path: '/detail/blackjuyusoDetail/Blackjuyuso' },
        ],
        '이용안내': [
            { name: 'Notice', label: '공지사항', path: '/detail/guideDetail/Notice' },
            { name: 'Guide', label: 'JUVO이용안내', path: '/detail/guideDetail/Guide' },
            { name: 'Faq', label: '자주묻는질문', path: '/detail/guideDetail/Faq' },
            { name: 'Membership', label: 'JUVO 멤버십', path: '/detail/guideDetail/Membership' },
        ],
    };

    return (
        <div className="containerHD">
            <h1 className="logo">
                <a href="/">
                    <img src={Logo} alt="로고" />
                </a>
            </h1>
            <div className="nav">
                {Object.keys(menuItems).map((menu) => (
                    <div key={menu} className="nav-item">
                        <a>{menu}</a>
                    </div>
                ))}
                <div className="dropdown-container">
                    {Object.keys(menuItems).map((menu) => (
                        <div key={menu} className="dropdown-column">
                            {menuItems[menu].map((item) => (
                                <a
                                    key={item.name}
                                    href={item.path}
                                    className="dropdown-item"
                                >
                                    - {item.label}
                                </a>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="btns">
                {isLogin ? (
                    <>
                        {userType === 'CUS' && (
                            <div className="mypage" onClick={handleMyPageClick}>마이페이지</div>
                        )}
                        {userType === 'ADM' && (
                            <div className="admin" onClick={handleAdminClick}>관리자 페이지</div>
                        )}
                        <div className="logout" onClick={handleLogout}>로그아웃</div>
                    </>
                ) : (
                    <>
                        <div className="login" onClick={() => navigate("/user/login")}>로그인</div>
                        <div className="signup" onClick={() => navigate("/user/signup")}>회원가입</div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Header;

