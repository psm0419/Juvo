import React, { useState } from "react";
import axios from "axios";
import '../../assets/css/user/FindPasswordRequest.css';

function FindPasswordRequest() {
    const [form, setForm] = useState({
        email: "",
        id: "",
        tel: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/findPassword/request", form);
            setMessage(response.data.message || "비밀번호 재설정 링크가 이메일로 전송되었습니다.");
        } catch (error) {
            setMessage(error.response?.data?.message || "오류가 발생했습니다.");
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
                {message && <p className="fp-message">{message}</p>}
            </div>
        </div>
    );
}

export default FindPasswordRequest;