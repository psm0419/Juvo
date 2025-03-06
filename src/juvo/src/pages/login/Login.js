import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    let [id, setId] = useState("");
    let [pw, setPw] = useState("");
    let navigate = useNavigate();
    return (
        <div>
            <h1>로그인</h1>
            ID : <input type="text" onChange={(e) => {
                setId(e.target.value);
            }}/>
            <br/>

            Password : <input type="password" onChange={(e) => {
                setPw(e.target.value);
            }} />
            <br/>

            <button onClick={() => {
                axios.post(
                    "/user/loginJWT",
                    {
                        id: id,
                        pw: pw
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                    .then(response => {

                        let accessToken = response.data;//accessToken JWT
                        //토큰은 localStorage 저장 해둔다
                        //다음에 API 요청 할 때 사용 할 수 있게
                        if(accessToken == "fail"){
                            alert ('로그인 실패');
                        } else {
                            localStorage.setItem("accessToken", accessToken);
                            alert ('로그인 성공');
                            navigate('/')
                        }
                        
                    })
                    .catch(error => {
                        console.log(error);
                    })

            }}>로그인</button><br />
            <button>네이버로 로그인</button><br />
            <button>구글로 로그인</button><br />
            <button>카카오계정으로 로그인</button><br />
        </div>
    );
}



export default Login;