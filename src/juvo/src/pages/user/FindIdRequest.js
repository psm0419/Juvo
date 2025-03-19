import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/css/user/FindIdRequest.css';
import Swal from "sweetalert2";

function FindId() {
    let navigate = useNavigate();

    let [tel, setTel] = useState("");
    let [validTel, setValidTel] = useState(null);
    let [telMsg, setTelMsg] = useState("");

    let [email, setEmail] = useState("");
    let [validEmail, setValidEmail] = useState(null);
    let [emailMsg, setEmailMsg] = useState("");

    let [foundId, setFoundId] = useState(null); // 서버에서 받은 ID 저장

    const ref = {
        tel: useRef(null),
        email: useRef(null),
    };

    const REGEX = {
        TEL: /^01(0|1|2|6|9)[-\s]?\d{3,4}[-\s]?\d{4}$/,
        EMAIL: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
    };

    const handleTelChange = (e) => {
        setTel(e.target.value);
        setValidTel(null);
        setTelMsg("");
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setValidEmail(null);
        setEmailMsg("");
    };

    useEffect(() => {
        const validateTel = () => {
            if (tel.length === 0) {
                setTelMsg("");
                setValidTel(null);
            } else if (REGEX.TEL.test(tel)) {
                setTelMsg("유효한 전화번호 형식입니다.");
                setValidTel(true);
            } else {
                setTelMsg("전화번호 형식이 올바르지 않습니다. (예: 01012345678)");
                setValidTel(false);
            }
        };

        const validateEmail = () => {
            if (email.length === 0) {
                setEmailMsg("");
                setValidEmail(null);
            } else if (REGEX.EMAIL.test(email)) {
                setEmailMsg("유효한 이메일 형식입니다.");
                setValidEmail(true);
            } else {
                setEmailMsg("이메일 형식이 올바르지 않습니다.");
                setValidEmail(false);
            }
        };

        // 입력값이 변경될 때마다 유효성 검사 실행
        const timeoutId = setTimeout(() => {
            validateTel();
            validateEmail();
        }, 500); // 디바운스 처리

        return () => clearTimeout(timeoutId);
    }, [tel, email]);

    const focusInvalidField = () => {
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
        return validTel && validEmail && !foundId; // ID 찾기 전까지만 버튼 활성화
    };

    const handleFindId = () => {
        if (!isValidSuccess()) {
            Swal.fire({
                icon: "warning",
                title: "경고",
                text: "입력한 정보를 다시 확인해주세요.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });            
            focusInvalidField();
            return;
        }
        axios
            .post(
                "/user/findId",
                { tel, email },
                { headers: { "Content-Type": "application/json" } }
            )
            .then((response) => {
                const userId = response.data.id; // 서버에서 ID 반환 가정
                
                if (userId != null) {
                    setFoundId(userId);
                    Swal.fire({
                        icon: "success",
                        title: "성공",
                        text: "아이디를 성공적으로 찾았습니다.",
                        confirmButtonText: "확인",
                        confirmButtonColor: "#f89400",
                    });                    
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "경고",
                        text: "일치하는 사용자를 찾을 수 없습니다.",
                        confirmButtonText: "확인",
                        confirmButtonColor: "#f89400",
                    });                    
                }
            })
            .catch((error) => {
                console.error("아이디 찾기 오류:", error);
                Swal.fire({
                    icon: "error",
                    title: "오류",
                    text: "아이디 찾기 중 오류가 발생했습니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                });
            });
    };

    return (
        <div className="fi-page">
            <div className="fi-container">
                <h1 className="fi-title">아이디 찾기</h1>

                <div className="fi-form-group">
                    <input
                        type="text"
                        ref={ref.tel}
                        value={tel}
                        disabled={foundId}
                        className={`fi-input ${tel.length > 0 ? (validTel ? 'fi-valid' : 'fi-invalid') : ''}`}
                        placeholder="전화번호 (예: 01012345678)"
                        onChange={handleTelChange}
                    />
                    <span
                        className={`fi-message ${tel.length > 0 ? (validTel ? 'fi-valid' : 'fi-invalid') : ''}`}
                    >
                        {telMsg}
                    </span>
                </div>

                <div className="fi-form-group">
                    <input
                        type="text"
                        ref={ref.email}
                        value={email}
                        disabled={foundId}
                        className={`fi-input ${email.length > 0 ? (validEmail ? 'fi-valid' : 'fi-invalid') : ''}`}
                        placeholder="이메일"
                        onChange={handleEmailChange}
                    />
                    <span
                        className={`fi-message ${email.length > 0 ? (validEmail ? 'fi-valid' : 'fi-invalid') : ''}`}
                    >
                        {emailMsg}
                    </span>
                </div>

                <div className="fi-form-group">
                    <button
                        className="fi-submit-btn"
                        onClick={handleFindId}
                        disabled={!isValidSuccess()}
                    >
                        아이디 찾기
                    </button>
                </div>

                {foundId && (
                    <div className="fi-form-group">
                        <p className="fi-message fi-valid">
                            회원님의 아이디: <strong>{foundId}</strong>
                        </p>
                    </div>
                )}

                <div className="fi-form-group">
                    <button
                        className="fi-login-btn"
                        onClick={() => navigate("/user/login")}
                    >
                        로그인 페이지로 이동
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FindId;