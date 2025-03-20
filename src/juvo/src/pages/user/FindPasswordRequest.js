import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../assets/css/user/FindPasswordRequest.css';
import Swal from "sweetalert2";

function FindPasswordRequest() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        id: "",
        tel: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/findPassword/request", form);
            if (response.data === true) {
                Swal.fire({
                    icon: "success",
                    title: "성공",
                    text: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                }).then((result) => {
                    if (result.isConfirmed) {
                        // "확인" 버튼을 누른 경우에만 실행                        
                        window.location.href = "/user/login";
                    }
                });                
            }
        } catch (error) {
            // 서버에서 전달된 에러 메시지 처리
            let errorMessage = "오류가 발생했습니다. 다시 시도해주세요.";
            
            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    // JSON 형식으로 온 경우
                    errorMessage = error.response.data.message;
                } else if (typeof error.response.data === 'string' && error.response.data.includes('RuntimeException')) {
                    // HTML 형식으로 온 경우 메시지 추출
                    const match = error.response.data.match(/RuntimeException: (.*?)</);
                    if (match && match[1]) {
                        errorMessage = match[1];
                    }
                }
            }
            Swal.fire({
                icon: "warning",
                title: "경고",
                text: "입력하신 정보와 일치하는 사용자를 찾을 수 없습니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });            
        }
    };

    return (
        <div className="fp-page">
            <div className="fp-container">
                <h1 className="fp-title">비밀번호 찾기</h1>
                <form onSubmit={handleSubmit}>
                    <div className="fp-form-group">
                        <input
                            type="text"
                            name="id"
                            value={form.id}
                            onChange={handleChange}
                            className="fp-input"
                            placeholder="아이디 입력"
                            required
                        />
                    </div>
                    <div className="fp-form-group">
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="fp-input"
                            placeholder="이메일 입력"
                            required
                        />
                    </div>
                    <div className="fp-form-group">
                        <input
                            type="tel"
                            name="tel"
                            value={form.tel}
                            onChange={handleChange}
                            className="fp-input"
                            placeholder="전화번호 입력 (예: 01012345678)"
                            required
                        />
                    </div>
                    <div className="fp-form-group">
                        <button type="submit" className="fp-submit-btn">
                            재설정 링크 요청
                        </button>
                    </div>
                </form>
                <div className="fp-form-group">
                    <button
                        className="fp-login-btn"
                        onClick={() => navigate("/user/login")}
                    >
                        로그인 페이지로 이동
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FindPasswordRequest;