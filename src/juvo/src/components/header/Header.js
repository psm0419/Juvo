import '../../assets/css/header/Header.css';
import Logo from '../../assets/image/Logo.png';
import MembershipIcon from '../../assets/image/PremiumStar.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";

function Header() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [userType, setUserType] = useState(null);
    const [membership, setMembership] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 모바일 메뉴 토글 상태

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const type = localStorage.getItem('userType');
        setIsLogin(!!token);
        setUserType(type);
        if (token) {
            fetchUserInfo(token);
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('accessToken');
            const type = localStorage.getItem('userType');
            setIsLogin(!!token);
            setUserType(type);
            if (token) {
                fetchUserInfo(token);
            } else {
                setMembership(null);
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const fetchUserInfo = async (token) => {
        try {
            const response = await axios.get('/user/checkUserByToken', {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setMembership(response.data.membership);
        } catch (error) {
            console.error("사용자 정보 조회 오류:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userType');
                setIsLogin(false);
                setUserType(null);
                setMembership(null);
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate('/user/login');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userType');
        setIsLogin(false);
        setUserType(null);
        setMembership(null);
    
        Swal.fire({
            title: "로그아웃 되었습니다!",
            icon: "success",
            draggable: true,
            confirmButtonText: "확인",
        }).then(() => {
            navigate('/');
        });
    };

    const handleLogin = () => {
        sessionStorage.setItem("redirectUrl", window.location.pathname);
        navigate("/user/login");
    };

const handleMyPageClick = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "로그인이 필요합니다!",
            footer: '<a href="#">Why do I have this issue?</a>',
            confirmButtonText: "확인",
        }).then(() => {
            navigate('/login');
        });
        return;
    }
    navigate("/myPage/profile");
};

const handleAdminClick = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "로그인이 필요합니다!",
            footer: '<a href="#">Why do I have this issue?</a>',
            confirmButtonText: "확인",
        }).then(() => {
            navigate('/user/login');
        });
        return;
    }
    navigate("/admin");
};

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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

    // 모바일 여부 확인 (화면 너비 기준)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 540);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 540);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div className="containerHD">
            <h1 className="logo">
                <a href="/">
                    <img src={Logo} alt="로고" />
                </a>
            </h1>
            {isMobile && (
                <button className="hamburger" onClick={toggleMenu}>
                    ☰
                </button>
            )}
            <div className={`nav ${isMobile && isMenuOpen ? 'open' : ''}`}>
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
                {isMobile && (
                    <div className="mobile-submenu">
                        {Object.keys(menuItems).map((menu) => (
                            <div key={menu} className="mobile-submenu-section">
                                <h3 style={{ margin: '10px 0 5px 0', fontSize: '1rem', color: '#374051' }}>{menu}</h3>
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
                )}
            </div>
            <div className="btns">
                {isLogin ? (
                    <>
                        {userType === 'CUS' && (
                            <div className="mypage-container" style={{ display: 'flex', alignItems: 'center' }}>
                                {membership == 1 && (
                                    <img
                                        src={MembershipIcon}
                                        alt="멤버십 아이콘"
                                        style={{ width: '20px', height: '20px', marginRight: '5px' }}
                                    />
                                )}
                                <div className="mypage" onClick={handleMyPageClick}>마이페이지</div>
                            </div>
                        )}
                        {userType === 'ADM' && (
                            <div className="admin" onClick={handleAdminClick}>관리자 페이지</div>
                        )}
                        <div className="logout" onClick={handleLogout}>로그아웃</div>
                    </>
                ) : (
                    <>
                        <div className="login" onClick={handleLogin}>로그인</div>
                        <div className="signup" onClick={() => navigate("/user/signup")}>회원가입</div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Header;