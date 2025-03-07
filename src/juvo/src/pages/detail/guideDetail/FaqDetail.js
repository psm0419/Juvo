import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../../assets/css/detail/FaqDetail.css';

export default function FaqDetail() {
    const { id } = useParams();

    // 샘플 데이터 (실제 데이터 소스로 대체 필요)
    const faqDetails = {
        1: {
            title: "JUVO 이용안내",
            content: "궁금해?",
            date: "2025.03.20"
        },
        2: {
            title: "불법 주유소에 대해 알고싶어요",
            content: "그게 왜 궁금해",
            date: "2025.03.19"
        },
        3: { 
            title: "취업 하고 싶어요",
            content: "취업 시켜주시면 열심히 챗 GPT 돌리겠습니다.",
            date: "2025.03.19"
        },
        4: {
            title: "돈 벌고싶어요",
            content: "근데 월급 200만원만 줘도 지금 만족해요",
            date: "2025.03.19"
        },
        5: {
            title: "취업 시켜주세요 멘토님",
            content: "제발 취업 시켜주세요 멘토님",
            date: "2025.03.19"
        },
    };

    const faq = faqDetails[id] || {
        title: "FAQ를 찾을 수 없습니다",
        content: "해당 FAQ가 존재하지 않습니다.",
        date: ""
    };

    return (
        <div className="faq-detail-container">
            <div className="faq-header">
                <h1 className="faq-title">{faq.title}</h1>
                <p className="faq-date">작성일: {faq.date}</p>
            </div>
            <div className="faq-content">
                {faq.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
            <div className="faq-footer">
                <Link to="/detail/guideDetail/faq" className="back-link">목록보기</Link>
            </div>
        </div>
    );
}