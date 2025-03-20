import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/user/Login.css';
import Header from '../../components/header/Header';
import axiosInstance from '../../util/AxiosConfig';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Swal from 'sweetalert2';

function LoginInner() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const generateState = () => {
        return Math.random().toString(36).substring(2, 15);
    };

    // 네이버 로그인 처리
    const handleNaverLogin = async () => {
        try {
            const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=x_Tt5R7epi0hivTwepgZ&redirect_uri=${encodeURIComponent('http://localhost:3000/callback/naver')}&state=${generateState()}`;
            console.log("Generated Naver Auth URL:", naverAuthUrl);
            window.location.href = naverAuthUrl;
        } catch (error) {
            console.error('네이버 로그인 오류:', error);
        Swal.fire({
            icon:"error",
            title: "네이버 로그인",
            text: "네이버 로그인 중 오류가 발생했습니다.",
            confirmButtonText: "확인",
            confirmButtonColor: "#f89400",});
        }
    };

    // 카카오 로그인 처리
    const handleKakaoLogin = async () => {
        try {
            const kakaoClientId = '3856ad752152ae3f28b78d2b608a1967'; // 실제 REST API 키로 교체
            const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent('http://localhost:3000/callback/kakao')}`;
            console.log("Generated Kakao Auth URL:", kakaoAuthUrl);
            window.location.href = kakaoAuthUrl;
        } catch (error) {
            console.error('카카오 로그인 오류:', error);
            Swal.fire({
                icon:"error",
                title: "네이버 로그인",
                text: "카카오 로그인 중 오류가 발생했습니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",});
        }
    };

    // 콜백 처리 (네이버 + 카카오)
    const handleSocialCallback = async (provider) => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        console.log(`${provider} Callback - Full URL:`, location.href);
        console.log(`${provider} Callback - Code:`, code, "State:", state);

        if (code) {
            try {
                console.log(`Sending /${provider}Login request with code:`, code);
                const res = await axiosInstance.post(`/${provider}Login`, { code }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log("Backend Response:", res.data);
                const { accessToken, refreshToken, userType } = res.data;

                if (accessToken === 'fail') {
                    console.warn(`${provider} login failed - accessToken: fail`);
                    alert(`${provider} 로그인 실패`);
                } else {
                    console.log(`${provider} login success - Tokens:`, { accessToken, refreshToken, userType });
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('userType', userType);
                    window.dispatchEvent(new Event("storage"));
                    Swal.fire({
                        icon:"success",
                        title: `${provider} 로그인 성공`,
                        text: "로그인을 성공했습니다 !",
                        confirmButtonText: "확인",
                        confirmButtonColor: "#f89400",}).then((result) => {
                            if (result.isConfirmed) {
                                // "확인" 버튼을 누른 경우에만 실행
                                sessionStorage.setItem("redirectUrl", window.location.pathname);
                                window.location.href = "/user/login"};
                            });
                    

                    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
                    sessionStorage.removeItem('redirectUrl');
                    navigate(redirectUrl, { replace: true });
                }
            } catch (error) {
                console.error(`${provider} 로그인 오류:`, error.response ? error.response.data : error.message);
                Swal.fire({
                    icon:"error",
                    title: `${provider} 로그인 오류`,
                    text: "로그인 중 오류가 발생했습니다..",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",}).then((result) => {
                        if (result.isConfirmed) {
                            // "확인" 버튼을 누른 경우에만 실행
                            sessionStorage.setItem("redirectUrl", window.location.pathname);
                            window.location.href = "/user/login"};
                        });
                
            }
        } else {
            console.warn(`${provider} Callback - No code parameter found`);
        }
    };

    // URL 변경 감지 및 콜백 처리
    useEffect(() => {
        if (location.pathname === '/callback/naver') {
            console.log("Naver callback detected");
            handleSocialCallback('naver');
        } else if (location.pathname === '/callback/kakao') {
            console.log("Kakao callback detected");
            handleSocialCallback('kakao');
        }
    }, [location, navigate]);

    // 구글 로그인 설정 (기존 코드 유지)
    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            console.log("Google Response:", response);
            try {
                const { code } = response;
                if (!code) {
                    throw new Error("Authorization code not found in response");
                }

                const res = await axiosInstance.post('/googleLogin', { code }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log("Backend Response:", res.data);
                const { accessToken, refreshToken, userType } = res.data;

                if (accessToken === 'fail') {
                    Swal.fire({
                        icon:"error",
                        title: `구글로 로그인 `,
                        text: "로그인을 실패했습니다..",
                        confirmButtonText: "확인",
                        confirmButtonColor: "#f89400",}).then((result) => {
                            if (result.isConfirmed) {
                                // "확인" 버튼을 누른 경우에만 실행
                                sessionStorage.setItem("redirectUrl", window.location.pathname);
                                window.location.href = "/user/login"};
                            });
                } else {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('userType', userType);
                    window.dispatchEvent(new Event("storage"));
                    Swal.fire({
                        icon:"success",
                        title: `구글로 로그인`,
                        text: "로그인을 성공했습니다 !",
                        confirmButtonText: "확인",
                        confirmButtonColor: "#f89400",}).then((result) => {
                            if (result.isConfirmed) {
                                // "확인" 버튼을 누른 경우에만 실행
                                sessionStorage.setItem("redirectUrl", window.location.pathname);
                                window.location.href = "/user/login"};
                            });
                    

                    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
                    sessionStorage.removeItem('redirectUrl');
                    navigate(redirectUrl, { replace: true });
                }
            } catch (error) {
                console.error('구글 로그인 오류:', error);
                Swal.fire({
                    icon:"error",
                    title: `구글로 로그인 `,
                    text: "로그인 중 오류가 발생했습니다..",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",}).then((result) => {
                        if (result.isConfirmed) {
                            // "확인" 버튼을 누른 경우에만 실행
                            sessionStorage.setItem("redirectUrl", window.location.pathname);
                            window.location.href = "/user/login"};
                        });
            }
        },
        onError: (error) => {
            console.error('구글 로그인 실패:', error);
            Swal.fire({
                icon:"error",
                title: `구글로 로그인 `,
                text: "로그인 중 오류가 발생했습니다..",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",}).then((result) => {
                    if (result.isConfirmed) {
                        // "확인" 버튼을 누른 경우에만 실행
                        sessionStorage.setItem("redirectUrl", window.location.pathname);
                        window.location.href = "/user/login"};
                    });
            //alert('구글 로그인에 실패했습니다.');
        },
        flow: 'auth-code',
        scope: 'openid profile email',
        redirect_uri: window.location.origin,
    });

    const isValid = id.trim() && pw.trim();

    const handleLogin = async () => {
        if (!id || !pw) {
            Swal.fire({
                icon:"warning",
                title: `로그인 실패 `,
                text: "아이디와 비밀번호를 확인해주세요 !",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",}).then((result) => {
                    if (result.isConfirmed) {
                        // "확인" 버튼을 누른 경우에만 실행
                        sessionStorage.setItem("redirectUrl", window.location.pathname);
                        window.location.href = "/user/login"};
                    });
            return;
        }

        try {
            const response = await axiosInstance.post('/user/loginJWT', { id, pw }, {
                headers: { 'Content-Type': 'application/json' }
            });
            const { accessToken, refreshToken, userType } = response.data;

            if (accessToken === 'fail') {
                alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
                setId('');
                setPw('');
            } else {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('userType', userType);
                window.dispatchEvent(new Event("storage"));
                alert('로그인 성공');

                const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
                sessionStorage.removeItem('redirectUrl');
                navigate(redirectUrl, { replace: true });
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            const errorMsg = error.response?.data?.message;
            alert(errorMsg);
            setId('');
            setPw('');
        }
    };

    const handleFindId = () => {
        navigate('/findIdRequest');
    };

    const handleFindPw = () => {
        navigate('/findPasswordRequest');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">로그인</h1>
                <div className="login-form-group">
                    <label className="login-label">ID</label>
                    <input
                        type="text"
                        value={id}
                        className="login-input"
                        placeholder="아이디"
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                <div className="login-form-group">
                    <label className="login-label">Password</label>
                    <input
                        type="password"
                        value={pw}
                        className="login-input"
                        placeholder="비밀번호"
                        onChange={(e) => setPw(e.target.value)}
                    />
                </div>
                <div className="login-form-group">
                    <button
                        className="login-submit-btn"
                        onClick={handleLogin}
                        disabled={!isValid}
                    >
                        로그인
                    </button>
                </div>
                <div className="login-form-group find-buttons">
                    <button className="find-btn find-id-btn" onClick={handleFindId}>
                        아이디 찾기
                    </button>
                    <button className="find-btn find-pw-btn" onClick={handleFindPw}>
                        비밀번호 찾기
                    </button>
                </div>
                <div className="login-form-group login-social-group">
                    <button className="login-social-btn naver-login-btn" onClick={handleNaverLogin}>
                        <span className="login-social-icon naver-icon" />
                        <span>네이버로 로그인</span>
                    </button>
                    <button className="login-social-btn kakao-login-btn" onClick={handleKakaoLogin}>
                        <span className="login-social-icon kakao-icon" />
                        <span>카카오계정으로 로그인</span>
                    </button>
                    <button
                        className="login-social-btn google-login-btn custom"
                        onClick={() => loginWithGoogle()}
                        disabled={false}
                    >
                        <span className="login-social-icon google-icon" />
                        <span>구글로 로그인</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function Login() {
    return (
        <GoogleOAuthProvider clientId="115778231067-ocno0uge1khs3k1b47se1b6fh5f079ku.apps.googleusercontent.com">
            <LoginInner />
        </GoogleOAuthProvider>
    );
}

export default Login;