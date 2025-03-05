import '../../assets/css/footer/Footer.css';

function Footer(){

    return(
        <>
            <div className='containerFT'>
                <div className='footerTop'>
                    <img src="https://www.opinet.co.kr/images/user/main/knoc_logo.jpg" alt="KNOC:한국석유공사"/>
                    <img src="https://www.opinet.co.kr/images/user/main/foot_logo_2.gif" alt="산업통산자원부"/>
                </div>
                <div className='footerMiddle'>
                    <span>개인정보처리방침</span>
                    <span className="pipe">|</span>
                    <span>저작권정책</span>
                    <span className="pipe">|</span>
                    <span>이메일주소무단수집거부</span>
                    <span className="pipe">|</span>
                    <span>원격지원요청</span>
                </div>
                <div className='footerBottom'>
                    <p> (31144)충남 천안시 동남구 대흥동 134 3교육실  사업자번호 000-00-00000 대표전화 0000-0000</p>
                    <p className="copyright"> COPYRIGHT(C) 2025 BY JUVO. ALL RIGHTS RESERVED. </p>
                </div>
            </div>
        </>
    );
}
export default Footer;