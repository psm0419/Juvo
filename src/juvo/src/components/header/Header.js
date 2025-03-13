import '../../assets/css/header/Header.css';
import Logo from '../../assets/image/Logo.png';
import MembershipIcon from '../../assets/image/PremiumStar.png'; // 멤버십 표시용 이미지 추가
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Header() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [userType, setUserType] = useState(null);
    const [membership, setMembership] = useState(null); // membership 상태 추가

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const type = localStorage.getItem('userType');
        setIsLogin(!!token);
        setUserType(type);
        if (token) {
            fetchUserInfo(token); // 로그인 상태일 때 사용자 정보 가져오기
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('accessToken');
            const type = localStorage.getItem('userType');
            setIsLogin(!!token);
            setUserType(type);
            if (token) {
                fetchUserInfo(token); // 스토리지 변경 시 사용자 정보 갱신
            } else {
                setMembership(null); // 로그아웃 시 membership 초기화
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
            
            setMembership(response.data.membership); // 응답에서 membership 값 설정
            console.log(membership);
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
        setMembership(null); // 로그아웃 시 membership 초기화
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    const handleMyPageClick = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        navigate("/myPage/profile");
    };

    const handleAdminClick = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        navigate("/admin");
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
                            <div className="mypage-container" style={{ display: 'flex', alignItems: 'center' }}>
                                {membership == 1 && (
                                    <img
                                        src={MembershipIcon}
                                        alt="멤버십 아이콘"
                                        style={{ width: '20px', height: '20px', marginLeft: '5px' }}
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
                        <div className="login" onClick={() => navigate("/user/login")}>로그인</div>
                        <div className="signup" onClick={() => navigate("/user/signup")}>회원가입</div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Header;