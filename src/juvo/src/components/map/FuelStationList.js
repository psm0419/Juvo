import React from "react";

const FuelStationList = ({ stations, loading }) => {
    console.log("FuelStationList stations:", stations);

    if (!stations || stations.length === 0) {
        return <p>{loading ? "데이터를 불러오는 중..." : "주변에 주유소가 없습니다."}</p>;
    }

    return (
        <div>
            {loading ? (
                <p>데이터를 불러오는 중...</p>
            ) : (
                <ul>
                    {stations.map((station, index) => (
                        <li key={index}>
                            <strong>{station.OS_NM || station.osNm || "이름 없음"}</strong>
                            <p>가격: {station.PRICE || station.hOilPrice || "정보 없음"}</p>
                            <p>주소: {station.NEW_ADR || station.newAdr || station.VAN_ADR || station.vanAdr || "정보 없음"}</p>
                            <p>거리: {station.DISTANCE ? `${station.DISTANCE.toFixed(1)}m` : "정보 없음"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FuelStationList;