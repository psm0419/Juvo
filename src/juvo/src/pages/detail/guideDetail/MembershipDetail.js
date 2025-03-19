import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance/axioslnstance";
import "../../../assets/css/detail/MembershipDetail.css";
import Swal from "sweetalert2";

function MembershipDetail() {
    const navigate = useNavigate();
    const userType = localStorage.getItem("userType"); // "ADM" 또는 "CUS"

    // 모든 훅은 컴포넌트 최상위에서 호출합니다.
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        tel: "",
        address: "",
        detailAddress: "",
        cardCompany: "",
        cardNumber: "",
        cvc: "",
        expiry: "",
        createdAt: "",
    });
    const [validFields, setValidFields] = useState({
        name: null,
        tel: null,
        address: null,
        detailAddress: null,
        cardNumber: null,
        cvc: null,
        expiry: null,
        createdAt: true,
    });
    const [errorMessages, setErrorMessages] = useState({});

    const refs = {
        name: useRef(null),
        tel: useRef(null),
        address: useRef(null),
        detailAddress: useRef(null),
        cardNumber: useRef(null),
        cvc: useRef(null),
        expiry: useRef(null),
    };

    const REGEX = {
        NAME: /^[가-힣]{2,15}$/,
        TEL: /^01(0|1|2|6|9)[-\s]?\d{3,4}[-\s]?\d{4}$/,
        CARD_NUMBER: /^\d{16}$/,
        CVC: /^\d{3}$/,
        EXPIRY: /^(0[1-9]|1[0-2])\/\d{2}$/,
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            Swal.fire("로그인이 필요합니다!").then(() => {
                navigate("/user/login");
            });
        }
    }, [navigate]);

    // 멤버십 가입 여부 체크
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            axiosInstance
                .get("/api/membershipCheck")
                .then((res) => {
                    if (res.data) {
                        setIsSubscribed(true);
                        if (userType === "CUS") {
                            Swal.fire("이미 가입한 회원입니다.").then(() => {
                                navigate("/mypage/membership");
                            });
                        }
                    }
                })
                .catch((error) => {
                    console.error("Membership check error:", error);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [navigate, userType]);

    // 실시간 유효성 검사
    useEffect(() => {
        const validateFields = () => {
            const newValidFields = {};
            const newErrorMessages = {};

            newValidFields.address = formData.address.length === 0 ? null : true;
            newErrorMessages.address =
                formData.address.length === 0 ? "" : "";

            newValidFields.detailAddress =
                formData.detailAddress.length === 0 ? null : true;
            newErrorMessages.detailAddress =
                formData.detailAddress.length === 0 ? "" : "";

            newValidFields.cardNumber =
                formData.cardNumber.length === 0
                    ? null
                    : REGEX.CARD_NUMBER.test(formData.cardNumber)
                        ? true
                        : false;
            newErrorMessages.cardNumber =
                formData.cardNumber.length === 0
                    ? ""
                    : REGEX.CARD_NUMBER.test(formData.cardNumber)
                        ? "유효한 카드번호입니다."
                        : "16자리 숫자만 입력해주세요.";

            newValidFields.cvc =
                formData.cvc.length === 0
                    ? null
                    : REGEX.CVC.test(formData.cvc)
                        ? true
                        : false;
            newErrorMessages.cvc =
                formData.cvc.length === 0
                    ? ""
                    : REGEX.CVC.test(formData.cvc)
                        ? "유효한 CVC입니다."
                        : "3자리 숫자만 입력해주세요.";

            newValidFields.expiry =
                formData.expiry.length === 0
                    ? null
                    : REGEX.EXPIRY.test(formData.expiry)
                        ? true
                        : false;
            newErrorMessages.expiry =
                formData.expiry.length === 0
                    ? ""
                    : REGEX.EXPIRY.test(formData.expiry)
                        ? "유효한 유효기간입니다."
                        : "MM/YY 형식으로 입력해주세요.";

            newValidFields.createdAt = true;

            setValidFields(newValidFields);
            setErrorMessages(newErrorMessages);
        };

        const timeoutId = setTimeout(validateFields, 500);
        return () => clearTimeout(timeoutId);
    }, [formData]);

    // 이벤트 핸들러들 (최상위에서 선언)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 16);
        setFormData({ ...formData, cardNumber: value });
    };

    const handleCvcChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 3);
        setFormData({ ...formData, cvc: value });
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4);
        }
        setFormData({ ...formData, expiry: value.slice(0, 5) });
    };

    const focusInvalidField = () => {
        if (!validFields.name) return refs.name.current.focus();
        if (!validFields.tel) return refs.tel.current.focus();
        if (!validFields.address) return refs.address.current.focus();
        if (!validFields.detailAddress) return refs.detailAddress.current.focus();
        if (!validFields.cardNumber) return refs.cardNumber.current.focus();
        if (!validFields.cvc) return refs.cvc.current.focus();
        if (!validFields.expiry) return refs.expiry.current.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid =
            Object.values(validFields).every((field) => field === true) &&
            formData.cardCompany !== "";

            if (!isValid) {
                Swal.fire({
                    icon: "error",
                    title: "다시 한 번 확인해주세요!",
                    text: "입력한 정보를 다시 확인해주세요.",
                }).then(() => {
                    focusInvalidField(); // Swal.fire 후에 focusInvalidField 호출
                });
                return;
            }

            const token = localStorage.getItem("accessToken");
            if (!token) {
                Swal.fire("로그인이 필요합니다!").then(() => {
                    navigate("/user/login");
                });
                return;
            }

        const today = new Date();
        const createdAt = `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const updatedFormData = { ...formData, createdAt };

        try {
            await axiosInstance.post("/api/membership", updatedFormData);
            // 멤버십 가입 성공 시 알림
            Swal.fire({
                title: "멤버십 가입 완료!",
                icon: "success",
                draggable: true, // 드래그 가능
            }).then(() => {
                navigate("/mypage/membership");
            });
        } catch (error) {
            console.error("멤버십 가입 오류:", error);
            // 멤버십 가입 실패 시 알림
            Swal.fire({
                icon: "error",
                title: "다시 한 번 확인해주세요!",
                text: "멤버십 가입에 실패했습니다. 다시 시도해주세요.",
            });
        }
    };

    // 조건부 렌더링 (모든 훅 호출 후 반환)
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mbd-membership-detail-container">
            <h1 className="mbd-title">JUVO 멤버십 가입</h1>
            <form onSubmit={handleSubmit} className="mbd-membership-form">
                {/* 주소 입력 */}
                <div className="mbd-form-group">
                    <label className="mbd-label">카드 배송 받을 주소</label>
                    <input
                        type="text"
                        name="address"
                        ref={refs.address}
                        value={formData.address}
                        className={`mbd-input ${formData.address.length > 0
                                ? validFields.address
                                    ? "valid"
                                    : "invalid"
                                : ""
                            }`}
                        onChange={handleChange}
                    />
                    <span className={`validation-msg ${validFields.address ? "valid" : "invalid"}`}>
                        {errorMessages.address || "주소를 입력해주세요."}
                    </span>
                </div>

                {/* 상세 주소 입력 */}
                <div className="mbd-form-group">
                    <label className="mbd-label">상세 주소</label>
                    <input
                        type="text"
                        name="detailAddress"
                        ref={refs.detailAddress}
                        value={formData.detailAddress}
                        className={`mbd-input ${formData.detailAddress.length > 0
                                ? validFields.detailAddress
                                    ? "valid"
                                    : "invalid"
                                : ""
                            }`}
                        onChange={handleChange}
                    />
                    <span className={`validation-msg ${validFields.detailAddress ? "valid" : "invalid"}`}>
                        {errorMessages.detailAddress || "상세 주소를 입력해주세요."}
                    </span>
                </div>

                {/* 카드사 선택 */}
                <div className="mbd-form-group">
                    <label className="mbd-label">카드사 선택</label>
                    <select
                        name="cardCompany"
                        className="mbd-select"
                        value={formData.cardCompany}
                        onChange={handleChange}
                    >
                        <option value="">카드사를 선택하세요</option>
                        <option value="KB국민카드">KB국민카드</option>
                        <option value="신한카드">신한카드</option>
                        <option value="삼성카드">삼성카드</option>
                        <option value="현대카드">현대카드</option>
                        <option value="롯데카드">롯데카드</option>
                        <option value="우리카드">우리카드</option>
                        <option value="하나카드">하나카드</option>
                        <option value="BC카드">BC카드</option>
                    </select>
                </div>

                {/* 카드번호 입력 */}
                <div className="mbd-form-group">
                    <label className="mbd-label">카드번호</label>
                    <input
                        type="text"
                        name="cardNumber"
                        ref={refs.cardNumber}
                        value={formData.cardNumber}
                        className={`mbd-input ${formData.cardNumber.length > 0
                                ? validFields.cardNumber
                                    ? "valid"
                                    : "invalid"
                                : ""
                            }`}
                        onChange={handleCardNumberChange}
                        maxLength="16"
                    />
                    <span className={`validation-msg ${validFields.cardNumber ? "valid" : "invalid"}`}>
                        {errorMessages.cardNumber}
                    </span>
                </div>

                {/* CVC와 유효기간 입력 */}
                <div className="mbd-form-row">
                    <div className="mbd-form-group mbd-small-input">
                        <label className="mbd-label">CVC</label>
                        <input
                            type="text"
                            name="cvc"
                            ref={refs.cvc}
                            value={formData.cvc}
                            className={`mbd-input ${formData.cvc.length > 0
                                    ? validFields.cvc
                                        ? "valid"
                                        : "invalid"
                                    : ""
                                }`}
                            onChange={handleCvcChange}
                            maxLength="3"
                        />
                        <span className={`validation-msg ${validFields.cvc ? "valid" : "invalid"}`}>
                            {errorMessages.cvc}
                        </span>
                    </div>
                    <div className="mbd-form-group mbd-small-input">
                        <label className="mbd-label">유효기간 (MM/YY)</label>
                        <input
                            type="text"
                            name="expiry"
                            ref={refs.expiry}
                            value={formData.expiry}
                            className={`mbd-input ${formData.expiry.length > 0
                                    ? validFields.expiry
                                        ? "valid"
                                        : "invalid"
                                    : ""
                                }`}
                            onChange={handleExpiryChange}
                            maxLength="5"
                        />
                        <span className={`validation-msg ${validFields.expiry ? "valid" : "invalid"}`}>
                            {errorMessages.expiry}
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="mbd-submit-button"
                    disabled={
                        !Object.values(validFields).every((field) => field === true) ||
                        formData.cardCompany === ""
                    }
                >
                    가입하기
                </button>
            </form>
        </div>
    );
}

export default MembershipDetail;
