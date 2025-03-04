import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    let [id, setId] = useState("");
    let [pw, setPw] = useState("");
    let [username, setUsername] = useState("");
    let [nickname, setNickname] = useState("");
    let [email, setEmail] = useState("");
    let [tel, setTel] = useState("");
    let [jumin, setJumin] = useState("");

    let navigate = useNavigate();
return (
    
    <div>
        <h1>회원가입</h1>

        ID : <input type="text"  onChange={(e)=>{
            setId(e.target.value)
        }}/><br/>

        비밀번호 : <input type="password" onChange={(e)=>{
            setPw(e.target.value)
        }}/><br/>

        비밀번호 확인 : <input type="password"/><br/>

        이메일 : <input type="text" onChange={(e)=>{
            setEmail(e.target.value)
        }}/><br/>

        이름 : <input type="text" onChange={(e)=>{
            setUsername(e.target.value)
        }}/><br/>

        생년월일 : <input type="text" onChange={(e)=>{
            setJumin(e.target.value)
        }}/><br/>

        휴대전화번호 : <input type="text" onChange={(e)=>{
            setTel(e.target.value)
        }}/><br/>

        사용할 닉네임 : <input type="text" onChange={(e)=>{
            setNickname(e.target.value)
        }}/><br/>

        <button onClick={() => {
                axios.post(
                    "/user/signup",
                    {
                        id: id,
                        pw: pw,
                        username: username,
                        nickname: nickname,
                        email: email,
                        tel: tel,
                        jumin: jumin
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                    .then(response => {
                        alert('회원가입이 완료되었습니다')
                        navigate('/user/login')
                        
                    })
                    .catch(error => {
                        console.log(error);
                    })

            }}>회원가입</button><br/>
    </div>
);
}

export default Signup;