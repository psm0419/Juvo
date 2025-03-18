import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/user/Login.css';
import Header from '../../components/header/Header';
import axiosInstance from '../../util/AxiosConfig';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

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
            alert('네이버 로그인 중 오류가 발생했습니다.');
        }
    };

    // 네이버 콜백 처리
    const handleNaverCallback = async () => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        console.log("Naver Callback - Full URL:", location.href);
        console.log("Naver Callback - Code:", code, "State:", state);

        if (code) {
            try {
                console.log("Sending /naverLogin request with code:", code);
                const res = await axiosInstance.post('/naverLogin', { code }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log("Backend Response:", res.data);
                const { accessToken, refreshToken, userType } = res.data;

                if (accessToken === 'fail') {
                    console.warn("Naver login failed - accessToken: fail");
                    alert('네이버 로그인 실패');
                } else {
                    console.log("Naver login success - Tokens:", { accessToken, refreshToken, userType });
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('userType', userType);
                    window.dispatchEvent(new Event("storage"));
                    alert('네이버 로그인 성공');

                    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
                    sessionStorage.removeItem('redirectUrl');
                    // URL에서 쿼리 파라미터 제거 후 리다이렉트
                    navigate(redirectUrl, { replace: true });
                }
            } catch (error) {
                console.error('네이버 로그인 오류:', error.response ? error.response.data : error.message);
                alert('네이버 로그인 중 오류가 발생했습니다.');
            }
        } else {
            console.warn("Naver Callback - No code parameter found");
        }
    };

    // URL 변경 감지 및 콜백 처리
    useEffect(() => {
        // /callback/naver 경로에서만 콜백 처리
        if (location.pathname === '/callback/naver') {
            console.log("URL Changed - Current Path:", location.pathname, "Search:", location.search);
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            if (code && state) {
                console.log("Naver callback detected - Code:", code, "State:", state);
                handleNaverCallback();
            } else {
                console.log("No Naver callback parameters found in URL");
                // 콜백 파라미터가 없으면 로그인 페이지로 리다이렉트
                navigate('/user/login', { replace: true });
            }
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
                    alert('구글 로그인 실패');
                } else {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('userType', userType);
                    window.dispatchEvent(new Event("storage"));
                    alert('구글 로그인 성공');

                    const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
                    sessionStorage.removeItem('redirectUrl');
                    navigate(redirectUrl, { replace: true });
                }
            } catch (error) {
                console.error('구글 로그인 오류:', error);
                alert('구글 로그인 중 오류가 발생했습니다.');
            }
        },
        onError: (error) => {
            console.error('구글 로그인 실패:', error);
            alert('구글 로그인에 실패했습니다.');
        },
        flow: 'auth-code',
        scope: 'openid profile email',
        redirect_uri: window.location.origin,
    });

    const isValid = id.trim() && pw.trim();

    const handleLogin = async () => {
        if (!id || !pw) {
            alert('아이디와 비밀번호를 입력해주세요.');
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
                    <button className="login-social-btn kakao-login-btn">
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