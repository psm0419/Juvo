import React from "react";
import HdoImage from "../../assets/image/Hdo.gif";
import GscImage from "../../assets/image/Gsc.gif";
import SkeImage from "../../assets/image/Ske.gif";
import SolImage from "../../assets/image/Sol.gif";
import RtxImage from "../../assets/image/Rtx.gif";
import NhoImage from "../../assets/image/Nho.gif";
import "../../assets/css/map/FuelStationList.css";

const FuelStationList = ({ stations, loading, onStationClick, isChargingStation = false }) => {
    if (loading) {
        return <div className="loading-text">검색 결과가 없습니다.</div>;
    }

    if (!stations || stations.length === 0) {
        return (
            <div className="no-stations-text">
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
        return logos[pollDivCd] || RtxImage;
    };

    return (
        <div className="fuel-station-list-container">
            {isChargingStation ? (
                <>
                    <div className="header-row">
                        <span>충전소명</span>
                        <span>모델</span>
                        <div className="header-prices">
                            
                            <span>사용 제한</span>
                        </div>
                    </div>

                    {stations.map((station, index) => (
                        <div
                            key={`${station.stationName || "unknown"}-${index}`}
                            className="station-item"
                        >
                            <div className="station-name-container">
                                <span
                                    className="station-name"
                                    onClick={() => onStationClick(station)}
                                >
                                    {station.stationName || "이름 없음"}
                                </span>
                            </div>
                            <div className="station-prices">
                                <span>{station.modelSmall || "-"}</span>
                                <span>{station.userRestriction || "-"}</span>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <div className="header-row">
                        <span>주유소명</span>
                        <div className="header-prices">
                            <span>휘발유</span>
                            <span>경유</span>
                        </div>
                    </div>

                    {stations.map((station, index) => (
                        <div key={station.uniId || index} className="station-item">
                            <div className="station-name-container">
                                <img
                                    src={getBrandLogo(station.pollDivCd)}
                                    alt={`${station.pollDivCd} logo`}
                                    className="brand-logo"
                                />
                                <span
                                    className="station-name"
                                    onClick={() => onStationClick(station)}
                                >
                                    {station.OS_NM || "이름 없음"}
                                </span>
                            </div>
                            <div className="station-prices">
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