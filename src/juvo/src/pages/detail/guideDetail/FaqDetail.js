import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../../assets/css/detail/FaqDetail.css';

export default function FaqDetail() {
    const { id } = useParams();

    // 샘플 데이터 (실제 데이터 소스로 대체 필요)
    const faqDetails = {
        1: {
            title: "JUVO 이용안내",
            content: "자세한 내용은 오른쪽 상단에 이용안내 안에 있는\nJUVO이용안내 탭을 눌러 확인해주시면 감사하겠습니다.",
            date: "2025.03.20"
        },
        2: {
            title: "불법 주유소에 대해 알고싶어요",
            content: "불법 주유소는 오피넷에서 제공하는 정보를 기반으로 보여드립니다. \n지역과 업종,업체명을 검색하여 확인하실 수 있고,\n위반유형 및 주소를 확인 하실 수 있습니다.",
            date: "2025.03.19"
        },
        3: { 
            title: "멤버십 가입 어떻게 하나요?",
            content: "멤버십 가입은 메인페이지 최하단 오른쪽에 위치한 배너를 클릭하셔서 가입을 하시거나 \n오른쪽 상단 이용안내 안에 있는 JUVO멤버십을 눌러 가입하실 수 있습니다.\n자세한 혜택은 JUVO멤버십 안에서 확인해주세요.",
            date: "2025.03.19"
        },
        4: {
            title: "API 어디서 가지고 오시나요?",
            content: "기본적인 API는 오피넷 에서 제공하는 API를 사용합니다. \n그 외 에는 카카오톡,구글,TMAP 등등 다양한 API를 사용합니다.",
            date: "2025.03.19"
        },
        5: {
            title: "주유소 찾기 하는 방법이 궁금해요",
            content: "왼쪽 상단에 '주유소찾기'를 누르신 후 주유소/충전소를 클릭 해 주세요.\n그 후 주유소 또는 충전소를 선택 해 주시고 \n우측에 보이는 맵에 본인의 위치를 클릭한 후 조회를 하면 몇 초 후 \n선택한 위치에 인근 주유소가 보이게됩니다.",
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