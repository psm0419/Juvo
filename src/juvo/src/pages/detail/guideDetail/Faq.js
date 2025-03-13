// src/pages/detail/guideDetail/Faq.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../../assets/css/detail/Faq.css';

export default function Faq() {
    const faqData = [
        { id: 1, title: "JUVO 이용안내", date: "2025.03.20" },
        { id: 2, title: "불법주유소에 대해 알고 싶어요", date: "2025.03.19" },
        { id: 3, title: "취업 하고 싶어요", date: "2025.03.18" },
        { id: 4, title: "돈 벌고 싶어요", date: "2025.03.17" },
        { id: 5, title: "취업시켜 주세요 멘토님", date: "2025.03.16" },
    ];

    return (
        <div className="faq-container">
            <h1 className="faq-title">자주 묻는 질문 (FAQ)</h1>

            <table className="faq-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {faqData.map((item) => (
                        <tr key={item.id} className="faq-row">
                            <td>{item.id}</td>
                            <td className="faq-title">
                                <Link to={`/detail/guideDetail/faq/${item.id}`}>
                                    {item.title}
                                </Link>
                            </td>
                            <td>{item.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="faq-pagination">
                <button>1</button>
            </div>
        </div>
    );
}