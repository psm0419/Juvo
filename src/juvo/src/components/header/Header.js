import '../../assets/css/header/Header.css';
import Logo from '../../assets/image/Logo.png';

function Header(){

    return(
        <>
            <div className='containerHD'>
                <h1 className="logo"><img src={Logo} alt="로고"/></h1>
                <div className="nav">
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
            {/* <div className="nav_list">
                    navList부분
            </div> */}
        </>
    );
}
export default Header;