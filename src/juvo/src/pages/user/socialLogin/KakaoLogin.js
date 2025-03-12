const KakaoLogin = () => {
    const Rest_api_key = '38efa586e068f1d6b2ad94f405e175cc' //REST API KEY
    const redirect_uri = 'http://localhost:3000/login/auth2/code/kakao' //Redirect URI
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
    const code = new URL(window.location.href).searchParams.get("code");
    console.log(code);
    const handleLogin = () => {
        window.location.href = kakaoURL;
    }
    return (
        <>
            <button onClick={handleLogin}>카카오 로그인</button>
        </>
    )
}


export default KakaoLogin;

