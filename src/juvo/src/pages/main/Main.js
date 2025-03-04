import { useNavigate } from "react-router-dom"


function Main() {
	let navigate = useNavigate();
	return (
		<div>
			<h1>main page 입니다.</h1>

			<button onClick={() => {
				navigate('/user/signup')
			}}>회원가입</button>

			<button onClick={() => {
				navigate('/user/login')
			}}>로그인</button>
		</div>
	);
}

export default Main;