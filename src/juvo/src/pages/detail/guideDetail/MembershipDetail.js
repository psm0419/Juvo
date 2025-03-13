import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../assets/css/detail/MembershipDetail.css";

function MembershipDetail() {
    const navigate = useNavigate();

    // 상태 선언
    const [formData, setFormData] = useState({
        name: "",
        tel: "",
        address: "",
        detailAddress: "",
        cardCompany: "",
        cardNumber: "",
        cvc: "",
        expiry: "",
        createdAt: "", // createdAt 초기값 추가
    });
    const [validFields, setValidFields] = useState({
        name: null,
        tel: null,
        address: null,
        detailAddress: null,
        cardNumber: null,
        cvc: null,
        expiry: null,
        createdAt: true, // createdAt은 자동 설정되므로 항상 유효
    });
    const [errorMessages, setErrorMessages] = useState({});

    // 유효하지 않은 필드에 포커스를 위한 참조
    const refs = {
        name: useRef(null),
        tel: useRef(null),
        address: useRef(null),
        detailAddress: useRef(null),
        cardNumber: useRef(null),
        cvc: useRef(null),
        expiry: useRef(null),
    };

    // 유효성 검사를 위한 정규 표현식
    const REGEX = {
        NAME: /^[가-힣]{2,15}$/,
        TEL: /^01(0|1|2|6|9)[-\s]?\d{3,4}[-\s]?\d{4}$/,
        CARD_NUMBER: /^\d{16}$/,
        CVC: /^\d{3}$/,
        EXPIRY: /^(0[1-9]|1[0-2])\/\d{2}$/,
    };

    // 실시간 유효성 검사
    useEffect(() => {
        const validateFields = () => {
            const newValidFields = {};
            const newErrorMessages = {};

            if (formData.name.length === 0) {
                newValidFields.name = null;
                newErrorMessages.name = "";
            } else if (REGEX.NAME.test(formData.name)) {
                newValidFields.name = true;
                newErrorMessages.name = "사용 가능한 이름입니다.";
            } else {
                newValidFields.name = false;
                newErrorMessages.name = "2~15자 이내의 한글 이름만 가능합니다.";
            }

            if (formData.tel.length === 0) {
                newValidFields.tel = null;
                newErrorMessages.tel = "";
            } else if (REGEX.TEL.test(formData.tel)) {
                newValidFields.tel = true;
                newErrorMessages.tel = "사용 가능한 전화번호입니다.";
            } else {
                newValidFields.tel = false;
                newErrorMessages.tel = "유효한 전화번호 형식이 아닙니다. (예: 01012345678)";
            }

            if (formData.address.length === 0) {
                newValidFields.address = null;
                newErrorMessages.address = "";
            } else {
                newValidFields.address = true;
                newErrorMessages.address = "";
            }

            if (formData.detailAddress.length === 0) {
                newValidFields.detailAddress = null;
                newErrorMessages.detailAddress = "";
            } else {
                newValidFields.detailAddress = true;
                newErrorMessages.detailAddress = "";
            }

            if (formData.cardNumber.length === 0) {
                newValidFields.cardNumber = null;
                newErrorMessages.cardNumber = "";
            } else if (REGEX.CARD_NUMBER.test(formData.cardNumber)) {
                newValidFields.cardNumber = true;
                newErrorMessages.cardNumber = "유효한 카드번호입니다.";
            } else {
                newValidFields.cardNumber = false;
                newErrorMessages.cardNumber = "16자리 숫자만 입력해주세요.";
            }

            if (formData.cvc.length === 0) {
                newValidFields.cvc = null;
                newErrorMessages.cvc = "";
            } else if (REGEX.CVC.test(formData.cvc)) {
                newValidFields.cvc = true;
                newErrorMessages.cvc = "유효한 CVC입니다.";
            } else {
                newValidFields.cvc = false;
                newErrorMessages.cvc = "3자리 숫자만 입력해주세요.";
            }

            if (formData.expiry.length === 0) {
                newValidFields.expiry = null;
                newErrorMessages.expiry = "";
            } else if (REGEX.EXPIRY.test(formData.expiry)) {
                newValidFields.expiry = true;
                newErrorMessages.expiry = "유효한 유효기간입니다.";
            } else {
                newValidFields.expiry = false;
                newErrorMessages.expiry = "MM/YY 형식으로 입력해주세요.";
            }

            // createdAt은 자동 설정되므로 항상 유효
            newValidFields.createdAt = true;

            setValidFields(newValidFields);
            setErrorMessages(newErrorMessages);
        };

        const timeoutId = setTimeout(validateFields, 500);
        return () => clearTimeout(timeoutId);
    }, [formData]);

    // 입력값 변경 핸들러
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

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = Object.values(validFields).every(
            (field) => field === true
        ) && formData.cardCompany !== "";

        if (!isValid) {
            alert("입력한 정보를 다시 확인해주세요.");
            focusInvalidField();
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/user/login");
            return;
        }

        // 현재 날짜를 연월일만 포함하도록 설정 (예: "2025-03-13")
        const today = new Date();
        const createdAt = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const updatedFormData = { ...formData, createdAt }; // formData에 createdAt 추가

        try {
            await axios.post("/api/membership", updatedFormData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("멤버십 가입이 완료되었습니다!");
            navigate("/mypage/membership");
        } catch (error) {
            console.error("멤버십 가입 오류:", error);
            alert("멤버십 가입에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 유효하지 않은 필드에 포커스 이동
    const focusInvalidField = () => {
        if (!validFields.name) return refs.name.current.focus();
        if (!validFields.tel) return refs.tel.current.focus();
        if (!validFields.address) return refs.address.current.focus();
        if (!validFields.detailAddress) return refs.detailAddress.current.focus();
        if (!validFields.cardNumber) return refs.cardNumber.current.focus();
        if (!validFields.cvc) return refs.cvc.current.focus();
        if (!validFields.expiry) return refs.expiry.current.focus();
    };

    return (
        <div className="mbd-membership-detail-container">
            <h1 className="mbd-title">JUVO 멤버십 가입</h1>
            <form onSubmit={handleSubmit} className="mbd-membership-form">
                <div className="mbd-form-group">
                    <label className="mbd-label">이름</label>
                    <input
                        type="text"
                        name="name"
                        ref={refs.name}
                        value={formData.name}
                        className={`mbd-input ${formData.name.length > 0
                            ? validFields.name
                                ? "valid"
                                : "invalid"
                            : ""
                            }`}
                        onChange={handleChange}
                    />
                    <span
                        className={`validation-msg ${validFields.name ? "valid" : "invalid"}`}
                    >
                        {errorMessages.name}
                    </span>
                </div>

                <div className="mbd-form-group">
                    <label className="mbd-label">전화번호</label>
                    <input
                        type="tel"
                        name="tel"
                        ref={refs.tel}
                        value={formData.tel}
                        className={`mbd-input ${formData.tel.length > 0
                            ? validFields.tel
                                ? "valid"
                                : "invalid"
                            : ""
                            }`}
                        onChange={handleChange}
                    />
                    <span
                        className={`validation-msg ${validFields.tel ? "valid" : "invalid"}`}
                    >
                        {errorMessages.tel}
                    </span>
                </div>

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
                    <span
                        className={`validation-msg ${validFields.address ? "valid" : "invalid"}`}
                    >
                        {errorMessages.address || "주소를 입력해주세요."}
                    </span>
                </div>

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
                    <span
                        className={`validation-msg ${validFields.detailAddress ? "valid" : "invalid"}`}
                    >
                        {errorMessages.detailAddress || "상세 주소를 입력해주세요."}
                    </span>
                </div>

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
                    <span
                        className={`validation-msg ${validFields.cardNumber ? "valid" : "invalid"}`}
                    >
                        {errorMessages.cardNumber}
                    </span>
                </div>

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
                        <span
                            className={`validation-msg ${validFields.cvc ? "valid" : "invalid"}`}
                        >
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
                        <span
                            className={`validation-msg ${validFields.expiry ? "valid" : "invalid"}`}
                        >
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