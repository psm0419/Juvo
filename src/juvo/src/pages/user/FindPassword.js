import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/css/user/FindPassword.css';

function FindPassword() {
    let navigate = useNavigate();

    let [id, setId] = useState("");
    let [validId, setValidId] = useState(null);
    let [idMsg, setIdMsg] = useState("");

    let [tel, setTel] = useState("");
    let [validTel, setValidTel] = useState(null);
    let [telMsg, setTelMsg] = useState("");

    let [email, setEmail] = useState("");
    let [validEmail, setValidEmail] = useState(null);
    let [emailMsg, setEmailMsg] = useState("");
    let [emailSent, setEmailSent] = useState(false);

    const ref = {
        id: useRef(null),
        tel: useRef(null),
        email: useRef(null),
    };

    const REGEX = {
        ID: /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/,
        TEL: /^01(0|1|2|6|9)[-\s]?\d{3,4}[-\s]?\d{4}$/,
        EMAIL: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
    };

    useEffect(() => {
        setValidId(REGEX.ID.test(id));
        if (id.length === 0) {
            setIdMsg("");
        } else if (REGEX.ID.test(id)) {
            setIdMsg("유효한 아이디 형식입니다.");
        } else {
            setIdMsg("ID 형식이 올바르지 않습니다. (영문으로 시작, 영문+숫자 4~24자)");
        }

        setValidTel(REGEX.TEL.test(tel));
        if (tel.length === 0) {
            setTelMsg("");
        } else if (REGEX.TEL.test(tel)) {
            setTelMsg("유효한 전화번호 형식입니다.");
        } else {
            setTelMsg("전화번호 형식이 올바르지 않습니다. (예: 01012345678)");
        }

        setValidEmail(REGEX.EMAIL.test(email));
        if (email.length === 0) {
            setEmailMsg("");
        } else if (REGEX.EMAIL.test(email)) {
            setEmailMsg(emailSent ? "재설정 링크가 발송되었습니다." : "유효한 이메일 형식입니다.");
        } else {
            setEmailMsg("이메일 형식이 올바르지 않습니다.");
        }
    }, [id, tel, email, emailSent]);

    const focusInvalidField = () => {
        if (!validId) {
            ref.id.current.focus();
            return false;
        }
        if (!validTel) {
            ref.tel.current.focus();
            return false;
        }
        if (!validEmail) {
            ref.email.current.focus();
            return false;
        }
        return true;
    };

    const isValidSuccess = () => {
        return validId && validTel && validEmail && !emailSent;
    };

    const handleSendResetLink = () => {
        if (!isValidSuccess()) {
            alert("입력한 정보를 다시 확인해주세요.");
            focusInvalidField();
            return;
        }
        axios
            .post(
                "/auth/reset-password-link",
                { id, tel, email },
                { headers: { "Content-Type": "application/json" } }
            )
            .then((response) => {
                alert("비밀번호 재설정 링크가 이메일로 발송되었습니다.");
                setEmailSent(true);
                console.log("서버 응답:", response.data);
            })
            .catch((error) => {
                console.error("링크 발송 오류:", error);
                const errorMsg = error.response?.data?.message || "링크 발송 중 오류가 발생했습니다.";
                alert(errorMsg);
            });
    };

    return (
        <div className="fp-page">
        <div className="fp-container">
            <h1 className="fp-title">비밀번호 찾기</h1>

            <div className="fp-form-group">
                <input
                    type="text"
                    ref={ref.id}
                    value={id}
                    disabled={emailSent}
                    className={`fp-input ${id.length > 0 ? (validId ? 'fp-valid' : 'fp-invalid') : ''}`}
                    placeholder="아이디"
                    onChange={(e) => setId(e.target.value)}
                />
                <span
                    className={`fp-message ${id.length > 0 ? (validId ? 'fp-valid' : 'fp-invalid') : ''}`}
                >
                    {idMsg}
                </span>
            </div>

            <div className="fp-form-group">
                <input
                    type="text"
                    ref={ref.tel}
                    value={tel}
                    disabled={emailSent}
                    className={`fp-input ${tel.length > 0 ? (validTel ? 'fp-valid' : 'fp-invalid') : ''}`}
                    placeholder="전화번호 (예: 01012345678)"
                    onChange={(e) => setTel(e.target.value)}
                />
                <span
                    className={`fp-message ${tel.length > 0 ? (validTel ? 'fp-valid' : 'fp-invalid') : ''}`}
                >
                    {telMsg}
                </span>
            </div>

            <div className="fp-form-group">
                <input
                    type="text"
                    ref={ref.email}
                    value={email}
                    disabled={emailSent}
                    className={`fp-input ${
                        email.length > 0 ? (emailSent || validEmail ? 'fp-valid' : 'fp-invalid') : ''
                    }`}
                    placeholder="이메일"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <span
                    className={`fp-message ${
                        email.length > 0 ? (emailSent || validEmail ? 'fp-valid' : 'fp-invalid') : ''
                    }`}
                >
                    {emailMsg}
                </span>
            </div>

            <div className="fp-form-group">
                <button
                    className="fp-submit-btn"
                    onClick={handleSendResetLink}
                    disabled={!isValidSuccess()}
                >
                    재설정 링크 요청
                </button>
            </div>

            {emailSent && (
                <div className="fp-form-group">
                    <p className="fp-message fp-valid">
                        이메일로 전송된 링크를 통해 비밀번호를 재설정해주세요.
                    </p>
                    <button
                        className="fp-login-btn"
                        onClick={() => navigate("/user/login")}
                    >
                        로그인 페이지로 이동
                    </button>
                </div>
            )}
        </div>
        </div>
    );
}

export default FindPassword;