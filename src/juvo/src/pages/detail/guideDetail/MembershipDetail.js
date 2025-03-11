import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import '../../../assets/css/detail/MembershipDetail.css';

class MembershipDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            address: '',
            detailAddress: '',
            cardCompany: '',
            cardNumber: '',
            cvc: '',
            expiry: '',
            errors: {},
            redirect: false
        };
    }

    validateForm = () => {
        const { name, phone, address, detailAddress, cardNumber, cvc, expiry } = this.state;
        let errors = {};
        let formIsValid = true;

        if (!name.trim()) errors.name = "이름을 입력해주세요.";
        if (!phone.trim()) errors.phone = "전화번호를 입력해주세요.";
        if (!address.trim()) errors.address = "주소를 입력해주세요.";
        if (!detailAddress.trim()) errors.detailAddress = "상세 주소를 입력해주세요.";
        if (!cardNumber.match(/^\d{16}$/)) errors.cardNumber = "유효한 카드번호(16자리)를 입력해주세요.";
        if (!cvc.match(/^\d{3}$/)) errors.cvc = "유효한 CVC(3자리)를 입력해주세요.";
        if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) errors.expiry = "유효기간을 MM/YY 형식으로 입력해주세요.";

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        this.setState({ cardNumber: value.slice(0, 16) });
    };

    handleCvcChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        this.setState({ cvc: value.slice(0, 3) });
    };

    handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        this.setState({ expiry: value.slice(0, 5) });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.validateForm()) {
            alert("멤버십 가입이 완료되었습니다!");
            this.setState({ redirect: true });
        }
    };

    render() {
        if (this.state.redirect) {
            return <Navigate to="/" />;
        }

        return (
            <div className="membership-detail-container">
                <h1 className="title">JUVO 멤버십 가입</h1>
                <form onSubmit={this.handleSubmit} className="membership-form">
                    <div className="form-group">
                        <label>이름</label>
                        <input type="text" name="name" onChange={this.handleChange} />
                        {this.state.errors.name && <p className="error">{this.state.errors.name}</p>}
                    </div>

                    <div className="form-group">
                        <label>전화번호</label>
                        <input type="tel" name="phone" onChange={this.handleChange} />
                        {this.state.errors.phone && <p className="error">{this.state.errors.phone}</p>}
                    </div>

                    <div className="form-group">
                        <label>카드 배송 받을 주소</label>
                        <input type="text" name="address" onChange={this.handleChange} />
                        {this.state.errors.address && <p className="error">{this.state.errors.address}</p>}
                    </div>

                    <div className="form-group">
                        <label>상세 주소</label>
                        <input type="text" name="detailAddress" onChange={this.handleChange} />
                        {this.state.errors.detailAddress && <p className="error">{this.state.errors.detailAddress}</p>}
                    </div>

                    <div className="form-group">
                        <label>카드사 선택</label>
                        <select name="cardCompany" onChange={this.handleChange}>
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

                    <div className="form-group">
                        <label>카드번호</label>
                        <input type="text" name="cardNumber" value={this.state.cardNumber} onChange={this.handleCardNumberChange} maxLength="16" />
                        {this.state.errors.cardNumber && <p className="error">{this.state.errors.cardNumber}</p>}
                    </div>

                    <div className="form-row">
                        <div className="form-group small-input">
                            <label>CVC</label>
                            <input type="text" name="cvc" value={this.state.cvc} onChange={this.handleCvcChange} maxLength="3" />
                            {this.state.errors.cvc && <p className="error">{this.state.errors.cvc}</p>}
                        </div>

                        <div className="form-group small-input">
                            <label>유효기간 (MM/YY)</label>
                            <input type="text" name="expiry" value={this.state.expiry} onChange={this.handleExpiryChange} maxLength="5" />
                            {this.state.errors.expiry && <p className="error">{this.state.errors.expiry}</p>}
                        </div>
                    </div>

                    <button type="submit" className="submit-button">가입 완료</button>
                </form>
            </div>
        );
    }
}

export default MembershipDetail;
