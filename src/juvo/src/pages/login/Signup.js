
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Validator from "../../components/validator/Validator";

function Signup() {
    let [id, setId] = useState("");
    let [validId, setValidId] = useState(false);
    let [idMsg, setIdMsg] = useState("");
    let [checkDupId, setCheckDupId] = useState();

    let [pw, setPw] = useState("");
    let [validPw, setValidPw] = useState(false);
    let [pwMsg, setPwMsg] = useState("");

    let [pwCheck, setPwCheck] = useState("");
    let [pwMatch, setPwMatch] = useState(true);
    let [pwCheckMsg, setPwCheckMsg] = useState("");

    let [username, setUsername] = useState("");
    let [validUsername, setValidUsername] = useState(false);
    let [usernameMsg, setUsernameMsg] = useState("");

    let [nickname, setNickname] = useState("");
    let [validNickname, setValidNickname] = useState(false);
    let [nicknameMsg, setNicknameMsg] = useState("");

    let [email, setEmail] = useState("");
    let [validEmail, setValidEmail] = useState(false);
    let [emailMsg, setEmailMsg] = useState("");

    let [tel, setTel] = useState("");
    let [validTel, setValidTel] = useState(false);
    let [telMsg, setTelMsg] = useState("");

    let [jumin, setJumin] = useState("");
    let [validJumin, setValidJumin] = useState(false);
    let [juminMsg, setJuminMsg] = useState("");

    let [emailAble, setEmailAble] = useState(false);
    let [inputAuthCode, setInputAuthCode] = useState(true);
    let [authCode, setAuthCode] = useState();
    
    useEffect(() => {
        setValidId(ID_REGEX.test(id));
    }, [id]);

    useEffect(() => {
        setValidPw(PWD_REGEX.test(pw));
    }, [pw]);

    useEffect(() => {
        setPwMatch(pw === pwCheck);
    }, [pw, pwCheck]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidUsername(NAME_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidJumin(JUMIN_REGEX.test(jumin));
    }, [jumin]);

    useEffect(() => {
        setValidNickname(NICKNAME_REGEX.test(nickname));
    }, [nickname]);

    useEffect(() => {
        setValidTel(TEL_REGEX.test(tel));
    }, [tel]);


    useEffect(() => {
        if (id.length === 0) {
            setIdMsg("");
        } else if (validId) {
            setIdMsg("사용 가능한 ID입니다.");
        } else {
            setIdMsg("ID 형식이 올바르지 않습니다.");
        }
    }, [id, validId]);

    useEffect(() => {
        if (pw.length === 0) {
            setPwMsg("");
        } else if (validPw) {
            setPwMsg("사용 가능한 비밀번호입니다.");
        } else {
            setPwMsg("소문자, 대문자, 숫자, 특수문자(!,@,#,$,%)가 포함되며 8~24글자이내여야 합니다.");
        }
    }, [pw, validPw]);

    useEffect(() => {
        if (pwCheck.length === 0) {
            setPwCheckMsg("");
        } else if (pwMatch) {
            setPwCheckMsg("비밀번호가 일치합니다.");
        } else {
            setPwCheckMsg("비밀번호가 일치하지 않습니다.");
        }
    }, [pwCheck, pwMatch]);

    useEffect(() => {
        if (email.length === 0) {
            setEmailMsg("");
        } else if (validEmail) {
            setEmailMsg("사용 가능한 이메일입니다.");
        } else {
            setEmailMsg("이메일 형식이 올바르지 않습니다.");
        }
    }, [email, validEmail]);

    useEffect(() => {
        if (username.length === 0) {
            setUsernameMsg("");
        } else if (validUsername) {
            setUsernameMsg("사용 가능한 이름입니다.");
        } else {
            setUsernameMsg("자음과 모음만 따로 기입하는건 불가능 하며 2~16자 이내의 이름만 가능합니다.");
        }
    }, [username, validUsername]);

    useEffect(() => {
        if (nickname.length === 0) {
            setNicknameMsg("");
        } else if (validNickname) {
            setNicknameMsg("사용 가능한 닉네임입니다.");
        } else {
            setNicknameMsg("영어 또는 숫자 또는 한글로 구성 된 6자 이상 16자 이하의 닉네임을 입력해주세요.");
        }
    }, [nickname, validNickname]);

    useEffect(() => {
        if (jumin.length === 0) {
            setJuminMsg("");
        } else if (validJumin) {
            setJuminMsg("사용 가능한 생년월일입니다.");
        } else if(isNaN(jumin) == true){
            setJuminMsg("숫자만 입력 해 주세요.");
        } else {
            setJuminMsg("생년월일 형식이 올바르지 않습니다. ex)20000101");
        }
    }, [jumin, validJumin]);

    useEffect(() => {
        if (tel.length === 0) {
            setTelMsg("");
        } else if (validTel) {
            setTelMsg("사용 가능한 전화번호입니다.");
        } else if(isNaN(tel) == true){
            setTelMsg("숫자만 입력 해 주세요.");
        } 
        else {
            setTelMsg("전화번호 형식이 올바르지 않습니다. ex) 01012344256");
        }
    }, [tel, validTel]);




    let navigate = useNavigate();

    const ID_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/; // 첫글자는 소문자, 대문자 알파벳
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/; //소문자, 대문자, 숫자, 특수문자 !@#$%가 꼭 들어있고 8~24글자
    const NAME_REGEX = /^[가-힣]{2,15}$/; // 자음 모음 불가, 2~15
    const EMAIL_REGEX = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; //이메일 정규식
    const JUMIN_REGEX = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/; // 생년월일 정규식
    const NICKNAME_REGEX = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{6,16}$/; //닉네임 정규식 6자 이상 16자 이하, 영어 또는 숫자 또는 한글로 구성
    const TEL_REGEX = /^01(0|1|2|6|9)[-\s]?\d{3,4}[-\s]?\d{4}$/; // 휴대전화 번호 정규식
    return (

        <div>
            <h1>회원가입</h1>

            <div>
                ID : <input type="text" title="test" onChange={(e) => {
                    setId(e.target.value);
                }} />
                <button onClick={()=>{
                    axios.post( // BE와 통신
                        "/user/checkDupId",
                        {
                            id: id
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                        .then(response => {
                            checkDupId = response.data
                            setCheckDupId(checkDupId);
                            console.log(checkDupId);
                        })
                        .catch(error => {
                            console.log(error);
                        })

                }}>중복 확인</button>
                <br />
                <span style={{ color: validId ? "green" : "red" }}>{idMsg}</span>
                <br />

                비밀번호 : <input type="password" onChange={(e) => {
                    setPw(e.target.value)
                }} />

                <br />
                <span style={{ color: validPw ? "green" : "red" }}>{pwMsg}</span>
                <br />

                비밀번호 확인 : <input type="password" onChange={(e) => {
                    setPwCheck(e.target.value)
                }} />

                <br />
                <span style={{ color: pwMatch ? "green" : "red" }}>{pwCheckMsg}</span>
                <br />
            </div>

            <div>
                이메일 : <input type="text" id="inputEmail" disabled={emailAble} onChange={(e) => {
                    setEmail(e.target.value);
                }} />

                <button id="requestAuthCode_btn" onClick={() => {
                    if (validEmail == true) {
                        axios.post( // BE와 통신
                            "/auth/email",
                            {
                                email: email
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }
                        )
                            .then(response => {
                                alert('이메일로 인증번호가 발송 되었습니다.')
                                setEmailAble(!emailAble); // email disabled
                                setInputAuthCode(!inputAuthCode); // visible input Authcode  
                                setAuthCode(response.data); // save return code
                            })
                            .catch(error => {
                                console.log(error);
                            })

                        {
                            document.getElementById("requestAuthCode_btn").disabled = true;
                        }
                    } else {
                        alert("이메일을 확인해주세요.");
                    }
                }}>
                    이메일 인증</button>

                <br />
                <span style={{ color: validEmail ? "green" : "red" }}>{emailMsg}</span>
                <br />
                <br />

                <div hidden={inputAuthCode}>
                    인증번호 입력 :
                    <input type="text" id="checkAuthCode" />
                    <button id="checkAuthCode_btn" onClick={() => {
                        console.log(authCode);
                        if (document.getElementById("checkAuthCode").value == authCode) {
                            alert("값 일치")
                            {
                                document.getElementById("checkAuthCode").disabled = true;
                                document.getElementById("checkAuthCode_btn").disabled = true;
                                document.getElementById("signup_btn").disabled = false;
                            }
                        } else {
                            alert("값 불일치")
                        }
                    }
                    }>인증번호확인</button>
                </div>
            </div>
            {/* ----------------------------------------------------------------------------------------- */}
            <div>
                이름 : <input type="text" onChange={(e) => {
                    setUsername(e.target.value)
                }} />

                <br />
                <span style={{ color: validUsername ? "green" : "red" }}>{usernameMsg}</span>
                <br />

                생년월일 : <input type="text" onChange={(e) => {
                    setJumin(e.target.value)
                }} />

                <br />
                <span style={{ color: validJumin ? "green" : "red" }}>{juminMsg}</span>
                <br />


                휴대전화번호 : <input type="text" onChange={(e) => {
                    setTel(e.target.value)
                }} />

                <br />
                <span style={{ color: validTel ? "green" : "red" }}>{telMsg}</span>
                <br />

                사용할 닉네임 : <input type="text" onChange={(e) => {
                    setNickname(e.target.value)
                }} />

                <br />
                <span style={{ color: validNickname ? "green" : "red" }}>{nicknameMsg}</span>
                <br />
            </div>
            {/* ----------------------------------------------------------------------------------------- */}
            <button id="signup_btn" disabled onClick={() => {
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

            }}>회원가입</button><br />

        </div>
    );
}

export default Signup;