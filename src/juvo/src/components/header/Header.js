import '../../assets/css/header/Header.css';
import Logo from '../../assets/image/Logo.png';
import { useState } from 'react';

function Header() {
    const [navListVisible, setNavListVisible] = useState(false);

    const mouseEnter = () => {
        setNavListVisible(true);
    };

    const mouseLeave = () => {
        setNavListVisible(false);
    };

    return (
        <>
            <div className='containerHD'>
                <h1 className="logo"><img src={Logo} alt="로고" /></h1>
                <div className="nav" onMouseEnter={mouseEnter} >
                    <a>싼주유소찾기</a>
                    <a>유가관련정보</a>
                    <a>불법행위공표</a>
                    <a>이용안내</a>
                </div>
                <div className="btns">
                    <div className="login">로그인</div>
                    <div className="signup">회원가입</div>
                </div>
            </div>
            <div className={`nav_list ${navListVisible ? 'visible' : ''}`} 
                    onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
                <div className='navListContainer'>
                    <div className='list_logo list'></div>
                    <div className='list_cheap list'></div>
                    <div className='list_info list'></div>
                    <div className='list_black list'></div>
                    <div className='list_juvo list'></div>
                    <div className='list_login list'></div>
                </div>
            </div>
        </>
    );
}

export default Header;
