
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/css/login/Signup.css';

function Signup() {
    let navigate = useNavigate();

    let [id, setId] = useState("");
    let [validId, setValidId] = useState(null);
    let [idMsg, setIdMsg] = useState("");
    let [checkDupId, setCheckDupId] = useState(null);

    let [pw, setPw] = useState("");
    let [validPw, setValidPw] = useState(null);
    let [pwMsg, setPwMsg] = useState("");

    let [pwCheck, setPwCheck] = useState("");
    let [pwMatch, setPwMatch] = useState(true);
    let [pwCheckMsg, setPwCheckMsg] = useState("");

    let [username, setUsername] = useState("");
    let [validUsername, setValidUsername] = useState(null);
    let [usernameMsg, setUsernameMsg] = useState("");

    let [nickname, setNickname] = useState("");
    let [validNickname, setValidNickname] = useState(null);
    let [nicknameMsg, setNicknameMsg] = useState("");
    let [checkDupNickname, setCheckDupNickname] = useState(null);

    let [email, setEmail] = useState("");
    let [validEmail, setValidEmail] = useState(null);
    let [emailMsg, setEmailMsg] = useState("");

    let [tel, setTel] = useState("");
    let [validTel, setValidTel] = useState(null);
    let [telMsg, setTelMsg] = useState("");

    let [jumin, setJumin] = useState("");
    let [validJumin, setValidJumin] = useState(null);
    let [juminMsg, setJuminMsg] = useState("");

    let [emailAble, setEmailAble] = useState(false);
    let [inputAuthCode, setInputAuthCode] = useState(true);
    let [authCode, setAuthCode] = useState("");
    let [isEmailAuth, setIsEmailAuth] = useState(null);

    let axiosAuthCode;
    // 정규식 객체
    const REGEX = {
        ID: /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/,/// 첫글자는 소문자, 대문자 알파벳
        PWD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/, //소문자, 대문자, 숫자, 특수문자 !@#$%가 꼭 들어있고 8~24글자
        NAME: /^[가-힣]{2,15}$/, // 자음 모음 불가, 2~15
        EMAIL: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i, //이메일 정규식
        JUMIN: /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/, // 생년월일 정규식
        NICKNAME: /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{6,16}$/, //닉네임 정규식 6자 이상 16자 이하, 영어 또는 숫자 또는 한글로 구성
        TEL: /^01(0|1|2|6|9)[-\s]?\d{3,4}[-\s]?\d{4}$/ // 휴대전화 번호 정규식
    }

    // 각 유효성 검증 및 메시지
    useEffect(() => {
        // ID 유효성 검사 및 메시지 설정
        setValidId(REGEX.ID.test(id));
        if (id.length === 0) {
            setIdMsg("");
        } else if (REGEX.ID.test(id)) {
            setIdMsg(
                checkDupId === true
                    ? "사용 가능한 아이디입니다."
                    : "중복 확인을 진행해주세요."
            );
        } else {
            setIdMsg("ID 형식이 올바르지 않습니다. (영문으로 시작 한 영문+숫자로 구성 된 4~24자의 아이디)");
        }

        // 비밀번호 유효성 검사 및 메시지 설정
        setValidPw(REGEX.PWD.test(pw));
        if (pw.length === 0) {
            setPwMsg("");
        } else if (REGEX.PWD.test(pw)) {
            setPwMsg("사용 가능한 비밀번호입니다.");
        } else {
            setPwMsg("소문자, 대문자, 숫자, 특수문자(!,@,#,$,%)가 포함되며 8~24글자이내여야 합니다.");
        }

        // 비밀번호 확인 유효성 검사 및 메시지 설정
        setPwMatch(pw === pwCheck);
        if (pwCheck.length === 0) {
            setPwCheckMsg("");
        } else if (pw === pwCheck) {
            setPwCheckMsg("비밀번호가 일치합니다.");
        } else {
            setPwCheckMsg("비밀번호가 일치하지 않습니다.");
        }

        // 이메일 유효성 검사 및 메시지 설정
        setValidEmail(REGEX.EMAIL.test(email));
        if (email.length === 0) {
            setEmailMsg("");
        } else if (REGEX.EMAIL.test(email)) {
            setEmailMsg(isEmailAuth ? "인증이 완료되었습니다." : "사용 가능한 이메일입니다. 인증을 진행해주세요.");
        } else {
            setEmailMsg("이메일 형식이 올바르지 않습니다.");
        }

        // 사용자 이름 유효성 검사 및 메시지 설정
        setValidUsername(REGEX.NAME.test(username));
        if (username.length === 0) {
            setUsernameMsg("");
        } else if (REGEX.NAME.test(username)) {
            setUsernameMsg("사용 가능한 이름입니다.");
        } else {
            setUsernameMsg("자음과 모음만 따로 기입하는건 불가능 하며 2~16자 이내의 이름만 가능합니다.");
        }

        // 닉네임 유효성 검사 및 메시지 설정
        setValidNickname(REGEX.NICKNAME.test(nickname));
        if (nickname.length === 0) {
            setNicknameMsg("");
        } else if (REGEX.NICKNAME.test(nickname)) {
            setNicknameMsg(
                checkDupNickname === true
                    ? "사용 가능한 닉네임입니다."
                    : "중복 확인을 진행해주세요."
            );
        } else {
            setNicknameMsg("영어 또는 숫자 또는 한글로 구성된 6~16자 닉네임을 입력해주세요.");
        }

        // 주민등록번호(생년월일) 유효성 검사 및 메시지 설정
        setValidJumin(REGEX.JUMIN.test(jumin));
        if (jumin.length === 0) {
            setJuminMsg("");
        } else if (REGEX.JUMIN.test(jumin)) {
            setJuminMsg("사용 가능한 생년월일입니다.");
        } else if (isNaN(jumin)) {
            setJuminMsg("숫자만 입력 해 주세요.");
        } else {
            setJuminMsg("생년월일 형식이 올바르지 않습니다. ex)20000101");
        }

        // 전화번호 유효성 검사 및 메시지 설정
        setValidTel(REGEX.TEL.test(tel));
        if (tel.length === 0) {
            setTelMsg("");
        } else if (REGEX.TEL.test(tel)) {
            setTelMsg("사용 가능한 전화번호입니다.");
        } else if (isNaN(tel)) {
            setTelMsg("숫자만 입력 해 주세요.");
        } else {
            setTelMsg("전화번호 형식이 올바르지 않습니다. ex) 01012344256");
        }
    }, [
        id, pw, pwCheck, email, username, jumin, nickname, tel, isEmailAuth, checkDupNickname
    ]);
    //각 입력 필드에 대한 참조 추가
    const ref = {
        id: useRef(null),
        pw: useRef(null),
        pwCheck: useRef(null),
        email: useRef(null),
        username: useRef(null),
        nickname: useRef(null),
        tel: useRef(null),
        jumin: useRef(null)
    }
    // 유효성 검증 실패 시 해당 필드로 포커스 이동 함수
    const focusInvalidField = () => {
        if (!validId || checkDupId !== true) {
            ref.id.current.focus();
            return false;
        }
        if (!validPw) {
            ref.pw.current.focus();
            return false;
        }
        if (!pwMatch) {
            ref.pwCheck.current.focus();
            return false;
        }
        if (!validEmail || !isEmailAuth) {
            ref.email.current.focus();
            return false;
        }
        if (!validUsername) {
            ref.username.current.focus();
            return false;
        }
        if (!validNickname) {
            ref.nickname.current.focus();
            return false;
        }
        if (!validJumin) {
            ref.jumin.current.focus();
            return false;
        }
        if (!validTel) {
            ref.validTel.current.focus();
            return false;
        }
        return true;
    };
    // 모든 유효성 검증 통과 여부
    const isValidSuccess = () => {
        return (
            validId &&
            validPw &&
            pwMatch &&
            validEmail &&
            isEmailAuth &&
            validUsername &&
            validNickname &&
            validJumin &&
            validTel &&
            checkDupId === true
        );
    }

    // ID 중복 확인 핸들러
    const handleCheckDupId = () => {
        axios.post("/user/checkDupId", { id }, { headers: { "Content-Type": "application/json" } })
            .then((response) => {
                setCheckDupId(response.data);
                setIdMsg(response.data ? "사용 가능한 아이디입니다." : "아이디가 이미 존재합니다.");
            })
            .catch((error) => {
                console.error("ID 중복 확인 오류:", error);
                alert("오류가 발생했습니다. 다시 시도해주세요.");
            });
    };
    // 이메일 인증 요청 핸들러
    const handleEmailAuth = () => {
        axios
            .post("/auth/email", { email }, { headers: { "Content-Type": "application/json" } })
            .then((response) => {
                alert("이메일로 인증번호가 발송되었습니다.");
                axiosAuthCode = response.data;
                console.log("서버에서 받은 returnCode:", axiosAuthCode); // 응답 데이터 확인

                setAuthCode(axiosAuthCode);
                setEmailAble(true);
                setInputAuthCode(false);
                setIsEmailAuth(false);
            })
            .catch((error) => {
                console.error("이메일 인증 오류:", error);
                alert("이메일 인증 중 오류가 발생했습니다.");
            });

    };
    // 인증번호 확인 핸들러
    const handleCheckAuthCode = () => {
        let inputCode = document.getElementById("checkAuthCode").value;
        if (inputCode == authCode) {
            alert("인증번호가 일치합니다.");
            setIsEmailAuth(true);
            document.getElementById("checkAuthCode").hidden = true;
            document.getElementById("checkAuthCode_btn").hidden = true;
        } else {
            alert("인증번호를 다시 확인해주세요.");
        }
    };
    // 닉네임 중복 확인 핸들러
    const handleCheckDupNickname = () => {
        axios.post("/user/checkDupNickname", { nickname }, { headers: { "Content-Type": "application/json" } })
            .then((response) => {
                setCheckDupNickname(response.data);
                setNicknameMsg(response.data ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다.");
            })
            .catch((error) => {
                console.error("닉네임 중복 확인 오류:", error);
                alert("오류가 발생했습니다. 다시 시도해주세요.");
            });
    };
    // 회원가입 핸들
    const handleSignup = () => {
        if (!isValidSuccess()) {
            alert("입력한 정보를 다시 확인해주세요.");
            focusInvalidField();
            return;
        }
        axios.post(
            "/user/signup",
            { id, pw, username, nickname, email, tel, jumin },
            { headers: { "Content-Type": "application/json" } }
        )
            .then((response) => {
                alert("회원가입이 완료되었습니다.");
                navigate("/user/login");
            })
            .catch((error) => {
                console.error(error);
                alert("회원가입 중 오류가 발생했습니다.");
            });
    };


    return (

        <div className="signup-container">
            <h1 className="signup-title">회원가입</h1>

            <div className="input-group">
                <div className="input-with-button">
                <input
                        type="text"
                        ref={ref.id}
                        value={id}
                        className={`input-field ${
                            id.length > 0
                                ? checkDupId === true
                                    ? 'valid'
                                    : validId
                                    ? 'pending'
                                    : 'invalid'
                                : ''
                        }`}
                        placeholder="아이디"
                        onChange={(e) => setId(e.target.value)}
                    />
                    {validId && checkDupId !== true && (
                        <button className="check-button" onClick={handleCheckDupId}>
                            중복 확인
                        </button>
                    )}
                </div>
                <span
                    className={`validation-msg ${
                        id.length > 0
                            ? checkDupId === true
                                ? 'valid'
                                : validId
                                ? 'pending'
                                : 'invalid'
                            : ''
                    }`}
                >
                    {idMsg}
                </span>

                <div className="input-with-button">
                    <input
                        type="password"
                        ref={ref.pw}
                        value={pw}
                        className={`input-field ${pw.length > 0 ? (validPw ? 'valid' : 'invalid') : ''}`}
                        placeholder="비밀번호"
                        onChange={(e) => setPw(e.target.value)}
                    />
                </div>

                <span className={`validation-msg ${validPw ? 'valid' : 'invalid'}`}>
                    {pwMsg}
                </span>

                <div className="input-with-button">
                    <input
                        type="password"
                        ref={ref.pwCheck}
                        value={pwCheck}
                        className={`input-field ${pwCheck.length > 0 ? (pwMatch ? 'valid' : 'invalid') : ''}`}
                        placeholder="비밀번호 확인"
                        onChange={(e) => setPwCheck(e.target.value)}
                    />
                </div>
                <span className={`validation-msg ${pwMatch ? 'valid' : 'invalid'}`}>
                    {pwCheckMsg}
                </span>
            </div>

            <div className="input-group">
                <div className="input-with-button">
                <input
                        type="text"
                        ref={ref.email}
                        value={email}
                        disabled={emailAble}
                        className={`input-field ${
                            email.length > 0
                                ? isEmailAuth
                                    ? 'valid'
                                    : validEmail
                                    ? 'pending'
                                    : 'invalid'
                                : ''
                        }`}
                        placeholder="이메일"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {validEmail && !emailAble && (
                        <button className="auth-button" onClick={handleEmailAuth}>
                            이메일 인증
                        </button>
                    )}
                </div>
                <span
                    className={`validation-msg ${
                        email.length > 0
                            ? isEmailAuth
                                ? 'valid'
                                : validEmail
                                ? 'pending'
                                : 'invalid'
                            : ''
                    }`}
                >
                    {emailMsg}
                </span>


                <div className="auth-code-group" hidden={inputAuthCode}>
                    <div className="input-with-button">
                        <input
                            type="text"
                            id="checkAuthCode"
                            className="input-field"
                            placeholder="인증번호 입력"
                        />
                        <button id="checkAuthCode_btn" className="auth-button" onClick={handleCheckAuthCode}>
                            인증번호 확인
                        </button>
                    </div>
                </div>
            </div>

            <div className="input-group">
                <input
                    type="text"
                    ref={ref.username}
                    value={username}
                    className={`input-field ${username.length > 0 ? (validUsername ? 'valid' : 'invalid') : ''}`}
                    placeholder="이름"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <span className={`validation-msg ${validUsername ? 'valid' : 'invalid'}`}>
                    {usernameMsg}
                </span>
                <div className="input-with-button">
                    <input
                        type="text"
                        ref={ref.jumin}
                        value={jumin}
                        className={`input-field ${jumin.length > 0 ? (validJumin ? 'valid' : 'invalid') : ''}`}
                        placeholder="생년월일"
                        onChange={(e) => setJumin(e.target.value)}
                    />
                </div>
                <span className={`validation-msg ${validJumin ? 'valid' : 'invalid'}`}>
                    {juminMsg}
                </span>

                <div className="input-with-button">
                    <input
                        type="text"
                        ref={ref.tel}
                        value={tel}
                        className={`input-field ${tel.length > 0 ? (validTel ? 'valid' : 'invalid') : ''}`}
                        placeholder="휴대전화번호"
                        onChange={(e) => setTel(e.target.value)}
                    />
                </div>

                <span className={`validation-msg ${validTel ? 'valid' : 'invalid'}`}>
                    {telMsg}
                </span>

                <div className="input-with-button">
                    <input
                        type="text"
                        ref={ref.nickname}
                        value={nickname}
                        className={`input-field ${nickname.length > 0
                            ? checkDupNickname === true
                                ? 'valid'
                                : validNickname
                                    ? 'pending'
                                    : 'invalid'
                            : ''
                            }`}
                        placeholder="사용할 닉네임"
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    {validNickname && checkDupNickname !== true && (
                        <button className="check-button" onClick={handleCheckDupNickname}>
                            중복 확인
                        </button>
                    )}
                </div>
                <span
                    className={`validation-msg ${nickname.length > 0
                            ? checkDupNickname === true
                                ? 'valid'
                                : validNickname
                                    ? 'pending'
                                    : 'invalid'
                            : ''
                        }`}
                >
                    {nicknameMsg}
                </span>
            </div>

            <button disabled={!isValidSuccess()} className="signup-button" onClick={handleSignup}>
                회원가입
            </button>
        </div>
    );
}

export default Signup;