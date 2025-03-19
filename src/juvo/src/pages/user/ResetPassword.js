import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../../assets/css/user/ResetPassword.css';
import Swal from "sweetalert2";

function ResetPassword() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validNewPw, setValidNewPw] = useState(null);
    const [newPwMsg, setNewPwMsg] = useState("");
    const [pwMatch, setPwMatch] = useState(null);
    const [matchMsg, setMatchMsg] = useState("");
    const [message, setMessage] = useState("");

    let navigate = useNavigate();

    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    useEffect(() => {
        const isValid = PWD_REGEX.test(newPassword);
        setValidNewPw(newPassword ? isValid : null);
        setNewPwMsg(
            newPassword
                ? isValid
                    ? "유효한 비밀번호입니다."
                    : "소문자, 대문자, 숫자, 특수문자(!@#$%) 포함 8~24자"
                : ""
        );

        const match = newPassword === confirmPassword;
        setPwMatch(confirmPassword ? match : null);
        setMatchMsg(confirmPassword ? (match ? "일치합니다." : "비밀번호가 일치하지 않습니다.") : "");
    }, [newPassword, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validNewPw || !pwMatch) {
            setMessage("비밀번호가 유효하지 않거나 일치하지 않습니다.");
            return;
        }

        try {
            const response = await axios.post("/resetPassword/request", {
                token,
                newPassword,
            });
            Swal.fire({
                icon: "success",
                title: "성공",
                text: "비밀번호가 성공적으로 변경되었습니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            }).then((result) => {
                if (result.isConfirmed) {
                    // "확인" 버튼을 누른 경우에만 실행   
                    setNewPassword("");
                    setConfirmPassword("");
                    window.location.href = "/user/login";
                }
            });            
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "실패",
                text: "비밀번호 변경에 실패하였습니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });            
        }
    };

    return (
        <div className="rp-page">
            <div className="rp-container">
                <h1 className="rp-title">비밀번호 재설정</h1>
                <form onSubmit={handleSubmit}>
                    <div className="rp-form-group">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`rp-input ${newPassword.length > 0 ? (validNewPw ? "rp-valid" : "rp-invalid") : ""}`}
                            placeholder="새 비밀번호 입력"
                            required
                        />
                        <span
                            className={`rp-message ${newPassword.length > 0 ? (validNewPw ? "rp-valid" : "rp-invalid") : ""}`}
                        >
                            {newPwMsg}
                        </span>
                    </div>
                    <div className="rp-form-group">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`rp-input ${confirmPassword.length > 0 ? (pwMatch ? "rp-valid" : "rp-invalid") : ""}`}
                            placeholder="비밀번호 확인"
                            required
                        />
                        <span
                            className={`rp-message ${confirmPassword.length > 0 ? (pwMatch ? "rp-valid" : "rp-invalid") : ""}`}
                        >
                            {matchMsg}
                        </span>
                    </div>
                    <div className="rp-form-group">
                        <button type="submit" className="rp-submit-btn">
                            비밀번호 변경
                        </button>
                    </div>
                </form>
                {message && <p className="rp-message">{message}</p>}
            </div>
        </div>
    );
}

export default ResetPassword;