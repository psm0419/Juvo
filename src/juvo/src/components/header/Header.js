import '../../assets/css/header/Header.css';
import Logo from '../../assets/image/Logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
    const [isNavHovered, setIsNavHovered] = useState(false);
    const navigate = useNavigate ();

    const menuItems = {
        '주유소찾기': [
            { name: 'Region', label: '지역별', path: '/Juyuso' },
        ],
        '유가관련정보': [
            { name: 'Conversion', label: '환산정보', path: '/detail/oilinfoDetail/Conversion' },
            { name: 'Tax', label: '세금정보', path: '/detail/oilinfoDetail/Tax' },
        ],
        '불법행위공표': [
            { name: 'Blackjuyuso', label: '불법주유소', path: '/detail/blackjuyusoDetail/Blackjuyuso' },
        ],
        '이용안내': [
            { name: 'Guide', label: 'JUVO이용안내', path: '/detail/guideDetail/Guide' },
            { name: 'Law', label: '법률', path: '/detail/guideDetail/Law' },
            { name: 'LocationServiceTerms', label: '위치서비스약관', path: '/detail/guideDetail/LocationServiceTerms' },
            { name: 'PrivacyPolicy', label: '개인정보정책', path: '/detail/guideDetail/PrivacyPolicy' },
            { name: 'RefundPolicy', label: '환불정책', path: '/detail/guideDetail/RefundPolicy' },
        ],
    };

    const handleMouseEnter = () => setIsNavHovered(true);
    const handleMouseLeave = () => setIsNavHovered(false);

    return (
        <div className="containerHD">
            <h1 className="logo">
                <a href="/">
                    <img src={Logo} alt="로고" />
                </a>
            </h1>
            <div
                className="nav"
                onMouseEnter={handleMouseEnter}
            >
                {Object.keys(menuItems).map((menu) => (
                    <div key={menu} className="nav-item">
                        <a>{menu}</a>
                    </div>
                ))}
                {isNavHovered && (
                    <div className="dropdown-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        {Object.keys(menuItems).map((menu) => (
                            <div key={menu} className="dropdown-column">
                                {menuItems[menu].map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.path}
                                        className="dropdown-item"
                                    >
                                        - {item.label} {/* label 앞에 "- " 추가 */}
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="btns">
                <div className="login" onClick={()=>{
                    navigate("/user/login");
                }}>로그인</div>
                <div className="signup" onClick={()=>{
                    navigate("/user/signup");
                }}>회원가입</div>
            </div>
        </div>
    );
}

export default Header;
