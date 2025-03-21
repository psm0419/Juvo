import React, { useState } from 'react';
import '../../assets/css/user/PrivacyConsent.css';

const PrivacyConsent = ({ onConsentChange }) => {
    const [allChecked, setAllChecked] = useState(false);
    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const [consents, setConsents] = useState([
        { id: 'privacyConsent1', label: '개인정보 수집 및 이용에 동의합니다.', detail: '상세 내용: 개인정보 수집 목적 및 항목', checked: false, expanded: false },
        { id: 'privacyConsent2', label: '서비스 이용 약관에 동의합니다.', detail: '상세 내용: 서비스 이용 관련 약관', checked: false, expanded: false },
        { id: 'privacyConsent3', label: '마케팅 수신에 동의합니다.', detail: '상세 내용: 마케팅 정보 수신 동의', checked: false, expanded: false },
    ]);

    const handleAllChange = (e) => {
        const isChecked = e.target.checked;
        setAllChecked(isChecked);
        const updatedConsents = consents.map(consent => ({ ...consent, checked: isChecked }));
        setConsents(updatedConsents);
        onConsentChange(updatedConsents.every(consent => consent.checked));
    };

    const toggleAllExpand = () => {
        setIsAllExpanded(!isAllExpanded);
    };

    const handleIndividualChange = (id) => {
        const updatedConsents = consents.map(consent =>
            consent.id === id ? { ...consent, checked: !consent.checked } : consent
        );
        setConsents(updatedConsents);
        setAllChecked(updatedConsents.every(consent => consent.checked));
        onConsentChange(updatedConsents.every(consent => consent.checked));
    };

    const toggleExpand = (id) => {
        const updatedConsents = consents.map(consent =>
            consent.id === id ? { ...consent, expanded: !consent.expanded } : consent
        );
        setConsents(updatedConsents);
    };

    return (
        <div className="privacy-agree-container">
            <div className={`privacy-agree-all ${isAllExpanded ? 'privacy-agree-all--expanded' : ''}`}>
                <div className="privacy-agree-all__header" onClick={toggleAllExpand}>
                    <input
                        type="checkbox"
                        name="allConsent"
                        id="allConsent"
                        checked={allChecked}
                        onChange={handleAllChange}
                        onClick={e => e.stopPropagation()}
                    />
                    <label htmlFor="allConsent">전체 동의</label>
                    <span className="arrow"></span> {/* 화살표 추가 */}
                </div>
                <div className="privacy-agree-all__content">
                    {consents.map(consent => (
                        <div
                            key={consent.id}
                            className={`privacy-agree ${consent.expanded ? 'privacy-agree--expanded' : ''}`}
                        >
                            <div
                                className="privacy-agree__header"
                                onClick={() => toggleExpand(consent.id)}
                            >
                                <input
                                    type="checkbox"
                                    name={consent.id}
                                    id={consent.id}
                                    checked={consent.checked}
                                    onChange={() => handleIndividualChange(consent.id)}
                                    onClick={e => e.stopPropagation()}
                                />
                                <label htmlFor={consent.id}>{consent.label}</label>
                                <span className="arrow"></span> {/* 화살표 추가 */}
                            </div>
                            <div className="privacy-agree__content">
                                <p>{consent.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrivacyConsent;