import axiosInstance from '../../../util/AxiosConfig';


function KakaoPost() {
    const code = new URL(window.location.href).searchParams.get("code");
    console.log(code);
    const handleLogin = () => {
        axiosInstance.post('/login/auth2/code/kakao', {
            code: code
        })
            .then(response => {
                console.log(response);
            })
    }   
    return (
        <div>
            <button onClick={handleLogin}>카카오 로그인 처리</button>
        </div>
    );
}

export default KakaoPost;
