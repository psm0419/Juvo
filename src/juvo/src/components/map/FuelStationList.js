import React from "react";


const FuelStationList = ({ stations, loading, onStationClick, isChargingStation = false }) => {
    if (loading) {
        return <div style={{ padding: "10px", textAlign: "center" }}>검색 결과가 없습니다.</div>;
    }

    if (!stations || stations.length === 0) {
        return (
            <div style={{ padding: "10px", textAlign: "center" }}>
                {isChargingStation ? "충전소가 없습니다." : "주유소가 없습니다."}
            </div>
        );
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
        <div
            style={{
                marginTop: "10px",
                maxHeight: "calc(100% - 60px)", // 플라이박스 높이에 맞게 조정 (하단 여백 고려)
                overflowY: "auto", // 스크롤바 항상 활성화
                paddingBottom: "20px", // 하단 패딩 추가로 마지막 항목이 잘 보이게
            }}
        >
            {isChargingStation ? (
                <>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "5px 10px",
                            borderBottom: "1px solid #e0e0e0",
                            fontWeight: "bold",
                            fontSize: "14px",
                        }}
                    >
                        <span>충전소명</span>
                        <div style={{ display: "flex", gap: "20px" }}>
                            <span>모델</span>
                            <span>사용 제한</span>
                        </div>
                    </div>

                    {stations.map((station, index) => (
                        <div
                            key={`${station.stationName || "unknown"}-${index}`}
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
                                <span
                                    style={{ cursor: "pointer", color: "#007bff" }}
                                    onClick={() => onStationClick(station)}
                                >
                                    {station.stationName || "이름 없음"}
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: "10px", fontWeight: "bold" }}>
                                <span>
                                    {station.modelSmall || "-"}
                                </span>
                                <span>{station.userRestriction || "-"}</span>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "5px 10px",
                            borderBottom: "1px solid #e0e0e0",
                            fontWeight: "bold",
                            fontSize: "14px",
                        }}
                    >
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
                                    style={{ cursor: "pointer", color: "#007bff" }}
                                    onClick={() => onStationClick(station)}
                                >
                                    {station.OS_NM || "이름 없음"}
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: "20px", fontWeight: "bold" }}>
                                <span>{station.hoilPrice || station.PRICE || "-"}</span>
                                <span>{station.doilPrice || "-"}</span>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default FuelStationList;