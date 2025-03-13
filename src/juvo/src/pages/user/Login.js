import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/user/Login.css';
import Header from '../../components/header/Header';
import axiosInstance from '../../util/AxiosConfig';
import NaverLogin from './socialLogin/NaverLogin';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

    const isValid = id.trim() && pw.trim();

    const handleLogin = async () => {
        if (!id || !pw) {
            alert('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        try {
            const response = await axiosInstance.post(
                '/user/loginJWT',
                { id, pw },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const { accessToken, refreshToken, userType } = response.data;

            if (accessToken == 'fail') {
                alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
                setId('');
                setPw('');
            } else {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('userType', userType); // userType 저장
                window.dispatchEvent(new Event("storage")); // 강제로 storage 이벤트 발생
                alert('로그인 성공');

                const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
                sessionStorage.removeItem('redirectUrl');
                navigate(redirectUrl);
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            const errorMsg = error.response?.data?.message
            alert(errorMsg);
            setId('');
            setPw('');
        }
    };
    //구글 로그인 구현
    const handleGoogleLoginSuccess = async (response) => {
        console.log("Google Response:", response); // 응답 확인
        try {
            const res = await axiosInstance.post(
                '/user/googleLogin',
                { code: response.code },
                { headers: { 'Content-Type': 'application/json' } }
            );
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
                navigate(redirectUrl);
            }
        } catch (error) {
            console.error('구글 로그인 오류:', error);
            alert('구글 로그인 중 오류가 발생했습니다.');
        }
    };

    const handleGoogleLoginFailure = (error) => {
        console.error('구글 로그인 실패:', error);
        alert('구글 로그인에 실패했습니다.');
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
                    <button className="login-social-btn naver-login-btn">
                        <span className="login-social-icon naver-icon" />
                        <span>네이버로 로그인</span>
                    </button>
                    <button className="login-social-btn kakao-login-btn">
                        <span className="login-social-icon kakao-icon" />
                        <span>카카오계정으로 로그인</span>
                    </button>
                    <GoogleOAuthProvider clientId="115778231067-ocno0uge1khs3k1b47se1b6fh5f079ku.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={handleGoogleLoginFailure}
                            flow="auth-code" // Authorization Code Flow로 설정
                            render={(renderProps) => (
                                <button
                                    className="login-social-btn google-login-btn"
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                >
                                    <span className="login-social-icon google-icon" />
                                    <span>구글로 로그인</span>
                                </button>
                            )}
                        />
                    </GoogleOAuthProvider>
                </div>
            </div>
        </div>
    );
}

export default Login;