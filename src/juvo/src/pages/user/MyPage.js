import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/css/user/MyPage.css';

function MyPage() {
    let navigate = useNavigate();

    // 사용자 정보 상태
    let [userInfo, setUserInfo] = useState(null);
    let [isLoading, setIsLoading] = useState(true);

    // 비밀번호 변경 모달 상태
    let [showModal, setShowModal] = useState(false);
    let [newPw, setNewPw] = useState("");
    let [newPwCheck, setNewPwCheck] = useState("");
    let [validNewPw, setValidNewPw] = useState(null);
    let [newPwMsg, setNewPwMsg] = useState("");
    let [newPwMatch, setNewPwMatch] = useState(true);
    let [newPwCheckMsg, setNewPwCheckMsg] = useState("");

    const ref = {
        newPw: useRef(null),
        newPwCheck: useRef(null),
    };

    const REGEX = {
        PWD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
    };

    // JWT 토큰 가져오기
    const getToken = () => {
        return localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
    };

    // 사용자 정보 가져오기
    useEffect(() => {
        const token = getToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/user/login");
            return;
        }

        axios
            .get("/user/me", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // JWT 토큰 헤더에 포함
                },
            })
            .then((response) => {
                setUserInfo(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("사용자 정보 가져오기 오류:", error);
                if (error.response?.status === 401) {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    navigate("/user/login");
                } else {
                    alert("사용자 정보를 불러오는 데 실패했습니다.");
                }
                setIsLoading(false);
            });
    }, [navigate]);

    // 비밀번호 유효성 검사
    useEffect(() => {
        setValidNewPw(REGEX.PWD.test(newPw));
        if (newPw.length === 0) {
            setNewPwMsg("");
        } else if (REGEX.PWD.test(newPw)) {
            setNewPwMsg("사용 가능한 비밀번호입니다.");
        } else {
            setNewPwMsg("소문자, 대문자, 숫자, 특수문자(!@#$%)가 포함된 8~24자여야 합니다.");
        }

        setNewPwMatch(newPw === newPwCheck);
        if (newPwCheck.length === 0) {
            setNewPwCheckMsg("");
        } else if (newPw === newPwCheck) {
            setNewPwCheckMsg("비밀번호가 일치합니다.");
        } else {
            setNewPwCheckMsg("비밀번호가 일치하지 않습니다.");
        }
    }, [newPw, newPwCheck]);

    // 민감 정보 마스킹 함수
    const maskSensitiveInfo = (value, type) => {
        if (!value) return "";
        switch (type) {
            case "tel":
                return value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-****-$3");
            case "jumin":
                return value.substring(0, 6) + "-*******";
            case "email":
                const [local, domain] = value.split("@");
                return `${local.slice(0, 3)}****@${domain}`;
            default:
                return value;
        }
    };

    // 비밀번호 변경 제출
    const handleChangePassword = () => {
        if (!validNewPw || !newPwMatch) {
            alert("비밀번호를 다시 확인해주세요.");
            if (!validNewPw) ref.newPw.current.focus();
            else if (!newPwMatch) ref.newPwCheck.current.focus();
            return;
        }
        const token = getToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/user/login");
            return;
        }

        axios
            .post(
                "/user/change-password",
                { newPw },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // JWT 토큰 헤더에 포함
                    },
                }
            )
            .then((response) => {
                alert("비밀번호가 성공적으로 변경되었습니다.");
                setShowModal(false);
                setNewPw("");
                setNewPwCheck("");
            })
            .catch((error) => {
                console.error("비밀번호 변경 오류:", error);
                if (error.response?.status === 401) {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    navigate("/user/login");
                } else {
                    const errorMsg = error.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.";
                    alert(errorMsg);
                }
            });
    };

    if (isLoading) {
        return <div className="mp-container">로딩 중...</div>;
    }

    if (!userInfo) {
        return <div className="mp-container">사용자 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="mp-container">
            <h1 className="mp-title">마이페이지</h1>

            <div className="mp-form-group">
                <label className="mp-label">아이디</label>
                <input
                    type="text"
                    value={userInfo.id || ""}
                    className="mp-input"
                    disabled
                />
            </div>

            <div className="mp-form-group">
                <label className="mp-label">이름</label>
                <input
                    type="text"
                    value={userInfo.username || ""}
                    className="mp-input"
                    disabled
                />
            </div>

            <div className="mp-form-group">
                <label className="mp-label">닉네임</label>
                <input
                    type="text"
                    value={userInfo.nickname || ""}
                    className="mp-input"
                    disabled
                />
            </div>

            <div className="mp-form-group">
                <label className="mp-label">전화번호</label>
                <input
                    type="text"
                    value={maskSensitiveInfo(userInfo.tel, "tel")}
                    className="mp-input"
                    disabled
                />
            </div>

            <div className="mp-form-group">
                <label className="mp-label">생년월일</label>
                <input
                    type="text"
                    value={maskSensitiveInfo(userInfo.jumin, "jumin")}
                    className="mp-input"
                    disabled
                />
            </div>

            <div className="mp-form-group">
                <label className="mp-label">이메일</label>
                <input
                    type="text"
                    value={maskSensitiveInfo(userInfo.email, "email")}
                    className="mp-input"
                    disabled
                />
            </div>

            <div className="mp-form-group">
                <button
                    className="mp-change-pw-btn"
                    onClick={() => setShowModal(true)}
                >
                    비밀번호 변경
                </button>
            </div>

            {showModal && (
                <div className="mp-modal-overlay">
                    <div className="mp-modal">
                        <h2 className="mp-modal-title">비밀번호 변경</h2>

                        <div className="mp-form-group">
                            <input
                                type="password"
                                ref={ref.newPw}
                                value={newPw}
                                className={`mp-input ${newPw.length > 0 ? (validNewPw ? 'mp-valid' : 'mp-invalid') : ''}`}
                                placeholder="새 비밀번호"
                                onChange={(e) => setNewPw(e.target.value)}
                            />
                            <span
                                className={`mp-message ${newPw.length > 0 ? (validNewPw ? 'mp-valid' : 'mp-invalid') : ''}`}
                            >
                                {newPwMsg}
                            </span>
                        </div>

                        <div className="mp-form-group">
                            <input
                                type="password"
                                ref={ref.newPwCheck}
                                value={newPwCheck}
                                className={`mp-input ${newPwCheck.length > 0 ? (newPwMatch ? 'mp-valid' : 'mp-invalid') : ''}`}
                                placeholder="비밀번호 확인"
                                onChange={(e) => setNewPwCheck(e.target.value)}
                            />
                            <span
                                className={`mp-message ${newPwCheck.length > 0 ? (newPwMatch ? 'mp-valid' : 'mp-invalid') : ''}`}
                            >
                                {newPwCheckMsg}
                            </span>
                        </div>

                        <div className="mp-modal-buttons">
                            <button
                                className="mp-submit-btn"
                                onClick={handleChangePassword}
                            >
                                확인
                            </button>
                            <button
                                className="mp-cancel-btn"
                                onClick={() => setShowModal(false)}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyPage;