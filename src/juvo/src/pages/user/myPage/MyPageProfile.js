import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../../../assets/css/user/myPage/MyPageProfile.css';
import MyPageProfileModal from './MyPageProfileModal';


function MyPage() {
    let navigate = useNavigate();

    // 사용자 정보 상태
    let [userInfo, setUserInfo] = useState({});
    let [isLoading, setIsLoading] = useState(true);

    // 비밀번호 변경 모달 상태
    let [showPwModal, setShowPwModal] = useState(false);
    let [newPw, setNewPw] = useState("");
    let [newPwCheck, setNewPwCheck] = useState("");
    let [validNewPw, setValidNewPw] = useState(null);
    let [newPwMsg, setNewPwMsg] = useState("");
    let [newPwMatch, setNewPwMatch] = useState(true);
    let [newPwCheckMsg, setNewPwCheckMsg] = useState("");

    // 닉네임 변경 모달 상태
    let [showNicknameModal, setShowNicknameModal] = useState(false);
    let [newNickname, setNewNickname] = useState("");
    let [isNicknameValid, setIsNicknameValid] = useState(null);
    let [nicknameMsg, setNicknameMsg] = useState("");

    const ref = {
        newPw: useRef(null),
        newPwCheck: useRef(null),
        newNickname: useRef(null),
    };

    const REGEX = {
        PWD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
        NICKNAME: /^[a-zA-Z0-9가-힣]{2,10}$/,
    };

    const getToken = () => localStorage.getItem("accessToken");

    useEffect(() => {
        const token = getToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/user/login");
            return;
        }

        axios
            .get("/user/checkUserByToken", {
                headers: { "Authorization": `Bearer ${token}` },
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
                }
                setIsLoading(false);
            });
    }, [navigate]);

    useEffect(() => {
        setValidNewPw(REGEX.PWD.test(newPw));
        setNewPwMsg(
            newPw.length === 0
                ? ""
                : REGEX.PWD.test(newPw)
                    ? "사용 가능한 비밀번호입니다."
                    : "소문자, 대문자, 숫자, 특수문자(!@#$%)가 포함된 8~24자여야 합니다."
        );
        setNewPwMatch(newPw === newPwCheck);
        setNewPwCheckMsg(
            newPwCheck.length === 0
                ? ""
                : newPw === newPwCheck
                    ? "비밀번호가 일치합니다."
                    : "비밀번호가 일치하지 않습니다."
        );
    }, [newPw, newPwCheck]);

    useEffect(() => {
        if (newNickname.length === 0) {
            setIsNicknameValid(null);
            setNicknameMsg("");
            return;
        }

        if (!REGEX.NICKNAME.test(newNickname)) {
            setIsNicknameValid(false);
            setNicknameMsg("닉네임은 2~10자이며 영문, 숫자, 한글만 가능합니다.");
        } else {
            setIsNicknameValid(null);
            setNicknameMsg("닉네임 중복 확인 중...");
            checkNicknameAvailability();
        }
    }, [newNickname]);

    const checkNicknameAvailability = async () => {
        try {
            const token = getToken();
            const response = await axios.post(
                "/user/checkDupNickname",
                { id: userInfo.id, nickname: newNickname },
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            setIsNicknameValid(response.data);
            setNicknameMsg(
                response.data ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다."
            );
        } catch (error) {
            console.error("닉네임 확인 중 오류 발생:", error);
        }
    };

    const maskSensitiveInfo = (value, type) => {
        if (!value) return "";
        switch (type) {
            case "tel": return value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-****-$3");
            case "jumin": return value.substring(0, 6) + "-*******";
            case "email": return `${value.split("@")[0].slice(0, 3)}****@${value.split("@")[1]}`;
            default: return value;
        }
    };

    const handleChangePassword = () => {
        if (!REGEX.PWD.test(newPw) || newPw !== newPwCheck) {
            alert("비밀번호를 다시 확인해주세요.");
            if (!REGEX.PWD.test(newPw)) ref.newPw.current.focus();
            else ref.newPwCheck.current.focus();
            return;
        }

        const token = getToken();
        axios
            .post(
                "/user/changePassword",
                { id: userInfo.id, pw: newPw },
                { headers: { "Authorization": `Bearer ${token}` } }
            )
            .then((response) => {
                if (response.data) {
                    alert("비밀번호가 성공적으로 변경되었습니다.");
                    setShowPwModal(false);
                    setNewPw("");
                    setNewPwCheck("");
                }
            })
            .catch((error) => {
                console.error("비밀번호 변경 오류:", error);
                if (error.response?.status === 401) {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    navigate("/user/login");
                }
            });
    };

    const handleChangeNickname = () => {
        if (!REGEX.NICKNAME.test(newNickname) || isNicknameValid !== true) {
            alert("닉네임을 다시 확인해주세요.");
            ref.newNickname.current.focus();
            return;
        }

        const token = getToken();
        axios
            .post(
                "/user/changeNickname",
                { id: userInfo.id, nickname: newNickname },
                { headers: { "Authorization": `Bearer ${token}` } }
            )
            .then((response) => {
                if (response.data) {
                    alert("닉네임이 성공적으로 변경되었습니다.");
                    setUserInfo({ ...userInfo, nickname: newNickname });
                    setShowNicknameModal(false);
                    setNewNickname("");
                }
            })
            .catch((error) => {
                console.error("닉네임 변경 오류:", error);
                if (error.response?.status === 401) {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    navigate("/user/login");
                }
            });
    };

    if (isLoading) return <div className="mp-container">로딩 중...</div>;
    if (!userInfo) return <div className="mp-container">사용자 정보를 불러올 수 없습니다.</div>;

    return (
            <div className="mp-page">

                <div className="mp-container">
                    <h1 className="mp-title">정보 수정</h1>

                    <div className="mp-form-group">
                        <label className="mp-label">아이디</label>
                        <input type="text" value={userInfo.id || ""} className="mp-input" disabled />
                    </div>

                    <div className="mp-form-group">
                        <label className="mp-label">이름</label>
                        <input type="text" value={userInfo.username || ""} className="mp-input" disabled />
                    </div>

                    <div className="mp-form-group">
                        <label className="mp-label">닉네임</label>
                        <input type="text" value={userInfo.nickname || ""} className="mp-input" disabled />
                    </div>

                    <div className="mp-form-group">
                        <label className="mp-label">전화번호</label>
                        <input type="text" value={maskSensitiveInfo(userInfo.tel, "tel")} className="mp-input" disabled />
                    </div>

                    <div className="mp-form-group">
                        <label className="mp-label">생년월일</label>
                        <input type="text" value={maskSensitiveInfo(userInfo.jumin, "jumin")} className="mp-input" disabled />
                    </div>

                    <div className="mp-form-group">
                        <label className="mp-label">이메일</label>
                        <input type="text" value={maskSensitiveInfo(userInfo.email, "email")} className="mp-input" disabled />
                    </div>

                    <div className="mp-form-group">
                        <button className="mp-change-pw-btn" onClick={() => setShowPwModal(true)}>
                            비밀번호 변경
                        </button>
                        <button className="mp-change-nickname-btn" onClick={() => setShowNicknameModal(true)}>
                            닉네임 변경
                        </button>
                    </div>

                    {/* 비밀번호 변경 모달 */}
                    <MyPageProfileModal
                        isOpen={showPwModal}
                        onClose={() => setShowPwModal(false)}
                        title="비밀번호 변경"
                        onSubmit={handleChangePassword}
                    >
                        <div className="mp-form-group">
                            <input
                                type="password"
                                ref={ref.newPw}
                                value={newPw}
                                className={`mp-input ${newPw.length > 0 ? (validNewPw ? 'mp-valid' : 'mp-invalid') : ''}`}
                                placeholder="새 비밀번호"
                                onChange={(e) => setNewPw(e.target.value)}
                            />
                            <span className={`mp-message ${newPw.length > 0 ? (validNewPw ? 'mp-valid' : 'mp-invalid') : ''}`}>
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
                            <span className={`mp-message ${newPwCheck.length > 0 ? (newPwMatch ? 'mp-valid' : 'mp-invalid') : ''}`}>
                                {newPwCheckMsg}
                            </span>
                        </div>
                    </MyPageProfileModal>

                    {/* 닉네임 변경 모달 */}
                    <MyPageProfileModal
                        isOpen={showNicknameModal}
                        onClose={() => setShowNicknameModal(false)}
                        title="닉네임 변경"
                        onSubmit={handleChangeNickname}
                    >
                        <div className="mp-form-group">
                            <input
                                type="text"
                                ref={ref.newNickname}
                                value={newNickname}
                                className={`mp-input ${newNickname.length > 0 ? (isNicknameValid === true ? 'mp-valid' : isNicknameValid === false ? 'mp-invalid' : '') : ''}`}
                                placeholder="새 닉네임"
                                onChange={(e) => setNewNickname(e.target.value)}
                            />
                            <span className={`mp-message ${newNickname.length > 0 ? (isNicknameValid === true ? 'mp-valid' : isNicknameValid === false ? 'mp-invalid' : '') : ''}`}>
                                {nicknameMsg}
                            </span>
                        </div>
                    </MyPageProfileModal>
                </div>
            </div>

    );
}

export default MyPage;