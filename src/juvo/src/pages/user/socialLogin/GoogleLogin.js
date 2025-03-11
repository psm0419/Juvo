import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../util/AxiosConfig';

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const clientId = '644052706094-6c06scq99si1pq94j35e00no0jleob92.apps.googleusercontent.com';  // Google Cloud Console에서 발급받은 ID로 교체 필요

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // 구글 로그인 성공 후 백엔드로 토큰 전송
            const response = await axiosInstance.post("/google/login", {
                credential: credentialResponse.credential
            });

            const { accessToken, refreshToken } = response.data;

            if (accessToken && refreshToken) {
                // 토큰 저장
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                window.dispatchEvent(new Event("storage")); 

                // 리다이렉트 처리
                const redirectUrl = sessionStorage.getItem('redirectUrl');
                sessionStorage.removeItem('redirectUrl');
                navigate(redirectUrl || '/');
            } else {
                alert('로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('Google 로그인 에러:', error);
            alert('로그인 처리 중 오류가 발생했습니다.');
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Google 로그인 실패:', error);
        alert('Google 로그인에 실패했습니다.');
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                theme="filled_blue"
                shape="rectangular"
                locale="ko"
                text="signin_with"
                size="large"
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;