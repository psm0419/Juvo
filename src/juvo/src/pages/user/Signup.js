import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/css/user/Signup.css';

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
    let [checkDupEmail, setCheckDupEmail] = useState(null); // 이메일 중복 확인 상태 추가

    let [tel, setTel] = useState("");
    let [validTel, setValidTel] = useState(null);
    let [telMsg, setTelMsg] = useState("");

    let [jumin, setJumin] = useState("");
    let [validJumin, setValidJumin] = useState(null);
    let [juminMsg, setJuminMsg] = useState("");

    let [inputAuthCode, setInputAuthCode] = useState(true);
    let [authCode, setAuthCode] = useState("");
    let [isEmailAuth, setIsEmailAuth] = useState(null);

    let axiosAuthCode;
    // 정규식 객체
    const REGEX = {
        ID: /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/,
        PWD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
        NAME: /^[가-힣]{2,15}$/,
        EMAIL: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
        JUMIN: /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/,
        NICKNAME: /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{6,16}$/,
        TEL: /^01(0|1|2|6|9)[-\s]?\d{3,4}[-\s]?\d{4}$/
    }

    // 유효성 검증 및 메시지
    useEffect(() => {
        const validateFields = () => {
            // ID 유효성 검사
            if (id.length === 0) {
                setIdMsg("");
                setValidId(null);
            } else if (REGEX.ID.test(id)) {
                setValidId(true);
                setIdMsg(
                    checkDupId === true
                        ? "사용 가능한 아이디입니다."
                        : "중복 확인을 진행해주세요."
                );
            } else {
                setValidId(false);
                setIdMsg("영문으로 시작한 영문+숫자로 구성된 4~24자의 아이디");
            }

            // 비밀번호 유효성 검사
            if (pw.length === 0) {
                setPwMsg("");
                setValidPw(null);
            } else if (REGEX.PWD.test(pw)) {
                setValidPw(true);
                setPwMsg("사용 가능한 비밀번호입니다.");
            } else {
                setValidPw(false);
                setPwMsg("소문자, 대문자, 숫자, 특수문자(!,@,#,$,%)가 포함되며 8~24글자이내여야 합니다.");
            }

            // 비밀번호 확인 검사
            if (pwCheck.length === 0) {
                setPwCheckMsg("");
                setPwMatch(null);
            } else if (pw === pwCheck) {
                setPwMatch(true);
                setPwCheckMsg("비밀번호가 일치합니다.");
            } else {
                setPwMatch(false);
                setPwCheckMsg("비밀번호가 일치하지 않습니다.");
            }

            // 이메일 유효성 검사
            if (email.length === 0) {
                setEmailMsg("");
                setValidEmail(null);
            } else if (REGEX.EMAIL.test(email)) {
                setValidEmail(true);
                setEmailMsg(
                    checkDupEmail === true
                        ? isEmailAuth
                            ? "인증이 완료되었습니다."
                            : "사용 가능한 이메일입니다. 인증을 진행해주세요."
                        : "이메일 중복 확인을 진행해주세요."
                );
            } else {
                setValidEmail(false);
                setEmailMsg("이메일 형식이 올바르지 않습니다.");
            }

            // 이름 유효성 검사
            if (username.length === 0) {
                setUsernameMsg("");
                setValidUsername(null);
            } else if (REGEX.NAME.test(username)) {
                setValidUsername(true);
                setUsernameMsg("사용 가능한 이름입니다.");
            } else {
                setValidUsername(false);
                setUsernameMsg("자음과 모음만 따로 기입하는건 불가능하며 2~16자 이내의 이름만 가능합니다.");
            }

            // 닉네임 유효성 검사
            if (nickname.length === 0) {
                setNicknameMsg("");
                setValidNickname(null);
            } else if (REGEX.NICKNAME.test(nickname)) {
                setValidNickname(true);
                setNicknameMsg(
                    checkDupNickname === true
                        ? "사용 가능한 닉네임입니다."
                        : "중복 확인을 진행해주세요."
                );
            } else {
                setValidNickname(false);
                setNicknameMsg("영어 또는 숫자 또는 한글로 구성된 6~16자 닉네임을 입력해주세요.");
            }

            // 주민번호 유효성 검사
            if (jumin.length === 0) {
                setJuminMsg("");
                setValidJumin(null);
            } else if (REGEX.JUMIN.test(jumin)) {
                setValidJumin(true);
                setJuminMsg("사용 가능한 생년월일입니다.");
            } else if (isNaN(jumin)) {
                setValidJumin(false);
                setJuminMsg("숫자만 입력 해 주세요.");
            } else {
                setValidJumin(false);
                setJuminMsg("생년월일 형식이 올바르지 않습니다. ex)20000101");
            }

            // 전화번호 유효성 검사
            if (tel.length === 0) {
                setTelMsg("");
                setValidTel(null);
            } else if (REGEX.TEL.test(tel)) {
                setValidTel(true);
                setTelMsg("사용 가능한 전화번호입니다.");
            } else if (isNaN(tel)) {
                setValidTel(false);
                setTelMsg("숫자만 입력 해 주세요.");
            } else {
                setValidTel(false);
                setTelMsg("전화번호 형식이 올바르지 않습니다. ex) 01012344256");
            }
        };

        const timeoutId = setTimeout(validateFields, 500);
        return () => clearTimeout(timeoutId);
    }, [
        id, pw, pwCheck, email, username, jumin, nickname, tel, isEmailAuth,
        checkDupId, checkDupNickname, checkDupEmail
    ]);

    // 각 입력 필드에 대한 참조 추가
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
        if (!validEmail || checkDupEmail !== true || !isEmailAuth) { // 중복 확인 추가
            ref.email.current.focus();
            return false;
        }
        if (!validUsername) {
            ref.username.current.focus();
            return false;
        }
        if (!validNickname || checkDupNickname !== true) {
            ref.nickname.current.focus();
            return false;
        }
        if (!validJumin) {
            ref.jumin.current.focus();
            return false;
        }
        if (!validTel) {
            ref.tel.current.focus();
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
            checkDupEmail === true && // 이메일 중복 확인 통과 여부 추가
            isEmailAuth &&
            validUsername &&
            validNickname &&
            validJumin &&
            validTel &&
            checkDupId === true &&
            checkDupNickname === true
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

    const handleCheckDupEmail = () => {
        axios.post("/user/checkDupEmail", { email }, { headers: { "Content-Type": "application/json" } })
            .then((response) => {
                console.log("서버 응답:", response.data); // 응답 확인
                setCheckDupEmail(response.data);
                setEmailMsg(response.data ? "사용 가능한 이메일입니다. 인증을 진행해주세요." : "이미 사용 중인 이메일입니다.");
            })
            .catch((error) => {
                console.error("이메일 중복 확인 오류:", error);
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
                console.log("서버에서 받은 returnCode:", axiosAuthCode);

                setAuthCode(axiosAuthCode);
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

    // 회원가입 핸들러
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

    const handleIdChange = (e) => {
        setId(e.target.value);
        setValidId(null);
        setIdMsg("");
        setCheckDupId(null);
    };

    const handlePwChange = (e) => {
        setPw(e.target.value);
        setValidPw(null);
        setPwMsg("");
    };

    const handlePwCheckChange = (e) => {
        setPwCheck(e.target.value);
        setPwMatch(null);
        setPwCheckMsg("");
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setValidEmail(null);
        setEmailMsg("");
        setCheckDupEmail(null); // 이메일 변경 시 중복 확인 상태 초기화
        setIsEmailAuth(null);
        setInputAuthCode(true);
        const authCodeInput = document.getElementById("checkAuthCode");
        const authCodeButton = document.getElementById("checkAuthCode_btn");
        if (authCodeInput) authCodeInput.value = "";
        if (authCodeInput) authCodeInput.hidden = false;
        if (authCodeButton) authCodeButton.hidden = false;
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setValidUsername(null);
        setUsernameMsg("");
    };

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
        setValidNickname(null);
        setNicknameMsg("");
        setCheckDupNickname(null);
    };

    const handleTelChange = (e) => {
        setTel(e.target.value);
        setValidTel(null);
        setTelMsg("");
    };

    const handleJuminChange = (e) => {
        setJumin(e.target.value);
        setValidJumin(null);
        setJuminMsg("");
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
                        onChange={handleIdChange}
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
                        onChange={handlePwChange}
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
                        onChange={handlePwCheckChange}
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
                        className={`input-field ${
                            email.length > 0
                                ? isEmailAuth
                                    ? 'valid'
                                    : checkDupEmail === true
                                    ? 'pending'
                                    : validEmail
                                    ? 'pending'
                                    : 'invalid'
                                : ''
                        }`}
                        placeholder="이메일"
                        onChange={handleEmailChange}
                    />
                    {validEmail && checkDupEmail !== true && (
                        <button className="check-button" onClick={handleCheckDupEmail}>
                            중복 확인
                        </button>
                    )}
                    {validEmail && checkDupEmail === true && !isEmailAuth && (
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
                                : checkDupEmail === true
                                ? 'pending'
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
                    onChange={handleUsernameChange}
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
                        onChange={handleJuminChange}
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
                        onChange={handleTelChange}
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
                        className={`input-field ${
                            nickname.length > 0
                                ? checkDupNickname === true
                                    ? 'valid'
                                    : validNickname
                                    ? 'pending'
                                    : 'invalid'
                                : ''
                        }`}
                        placeholder="사용할 닉네임"
                        onChange={handleNicknameChange}
                    />
                    {validNickname && checkDupNickname !== true && (
                        <button className="check-button" onClick={handleCheckDupNickname}>
                            중복 확인
                        </button>
                    )}
                </div>
                <span
                    className={`validation-msg ${
                        nickname.length > 0
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