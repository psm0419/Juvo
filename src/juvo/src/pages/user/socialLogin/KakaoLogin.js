const KakaoLogin = () => {
    const Rest_api_key = '' //REST API KEY
    const redirect_uri = '' //Redirect URI
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

