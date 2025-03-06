import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/user/Login.css';

function Login() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

    const isValid = id.trim() && pw.trim(); // 더 간결하게

    const handleLogin = async () => {
        if (!isValid) {
            alert('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(
                '/user/loginJWT',
                { id, pw },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const accessToken = response.data;

            if (accessToken === 'fail') {
                alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
                setId('');
                setPw('');
            } else {
                localStorage.setItem('accessToken', accessToken);
                alert('로그인 성공');
                navigate('/');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            const errorMsg = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
            alert(errorMsg);
            setId('');
            setPw('');
        }
    };

    return (
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
            <div className="login-form-group login-social-group">
                <button className="login-social-btn naver-login-btn">
                    <span className="login-social-icon naver-icon" />
                    <span>네이버로 로그인</span>
                </button>
                <button className="login-social-btn google-login-btn">
                    <span className="login-social-icon google-icon" />
                    <span>구글로 로그인</span>
                </button>
                <button className="login-social-btn kakao-login-btn">
                    <span className="login-social-icon kakao-icon" />
                    <span>카카오계정으로 로그인</span>
                </button>
            </div>
        </div>
    );
}

export default Login;