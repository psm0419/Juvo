// FuelStationList.js
import React from "react";

const FuelStationList = ({ stations, loading }) => {
    if (!stations) {
        stations = [];
    }
    
    return (
        <div>
            {loading ? (
                <p>데이터를 불러오는 중...</p>
            ) : (
                <ul>
                    {stations.length === 0 ? (
                        <p>주변에 주유소가 없습니다.</p>
                    ) : (
                        stations.map((station, index) => (
                            <li key={index}>
                                <strong>{station.OS_NM}</strong>
                                <p>가격: {station.PRICE || "정보 없음"}</p>
                                <p>거리: {station.DISTANCE || "정보 없음"}</p>
                                <p>브랜드: {station.POLL_DIV_CD}</p>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default FuelStationList;
