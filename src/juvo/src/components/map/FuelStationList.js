import React from "react";
import HdoImage from "../../assets/image/Hdo.gif";
import GscImage from "../../assets/image/Gsc.gif";
import SkeImage from "../../assets/image/Ske.gif";
import SolImage from "../../assets/image/Sol.gif";
import RtxImage from "../../assets/image/Rtx.gif";
import NhoImage from "../../assets/image/Nho.gif";

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
            GSC: GscImage, // GS칼텍스 이미지
            SKE: SkeImage, // SK에너지 이미지
            HDO: HdoImage, // 현대오일뱅크 이미지
            SOL: SolImage, // S-OIL 이미지
            RTX: RtxImage, // 기타 이미지
            NHO: NhoImage, // 농협 이미지
        };
        // 해당 pollDivCd에 맞는 로고가 없으면 RtxImage(기타)를 기본값으로 사용
        return logos[pollDivCd] || RtxImage;
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
                                <span>{station.modelSmall || "-"}</span>
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
                                <img
                                    src={getBrandLogo(station.pollDivCd)}
                                    alt={`${station.pollDivCd} logo`}
                                    style={{ width: "20px", height: "16px" }}
                                />
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