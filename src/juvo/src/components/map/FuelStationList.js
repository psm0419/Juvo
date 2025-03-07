import React from "react";

const FuelStationList = ({ stations, loading, onStationClick }) => { // onStationClick prop 추가
    if (loading) {
        return <div style={{ padding: "10px", textAlign: "center" }}>로딩 중...</div>;
    }

    if (!stations || stations.length === 0) {
        return <div style={{ padding: "10px", textAlign: "center" }}>주유소가 없습니다.</div>;
    }

    const getBrandLogo = (pollDivCd) => {
        const logos = {
            GSC: "🟢", // GS칼텍스
            SKE: "🟡", // SK에너지
            HDO: "🔵", // 현대오일뱅크
            SOL: "🟠", // S-OIL
            RTX: "⚪", // 기타
            NHO: "⚫", // 농협
        };
        return logos[pollDivCd] || "⚪";
    };

    return (
        <div style={{ marginTop: "10px" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px 10px",
                borderBottom: "1px solid #e0e0e0",
                fontWeight: "bold",
                fontSize: "14px",
            }}>
                <span>주유소명</span>
                <div style={{ display: "flex", gap: "20px" }}>
                    <span>휘발유</span>
                    <span>경유</span>
                </div>
            </div>

            {stations.map((station, index) => (
                <div
                    key={station.uniId || index}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px",
                        borderBottom: "1px solid #e0e0e0",
                        alignItems: "center",
                        fontSize: "14px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{getBrandLogo(station.pollDivCd)}</span>
                        <span
                            style={{ cursor: "pointer", color: "#007bff" }} // 클릭 가능하도록 스타일 추가
                            onClick={() => onStationClick(station)} // 클릭 시 부모로 데이터 전달
                        >
                            {station.osNm || "이름 없음"}
                        </span>
                    </div>
                    <div style={{ display: "flex", gap: "20px", fontWeight: "bold" }}>
                        <span>{station.hoilPrice || station.PRICE || "-"}</span>
                        <span>{station.doilPrice || "-"}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FuelStationList;