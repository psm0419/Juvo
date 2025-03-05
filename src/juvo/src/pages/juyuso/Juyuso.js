import React, { useState } from "react";
import Map from "../../components/map/Map";
import FuelStationList from "../../components/map/FuelStationList";

const Juyuso = () => {
    const [stations, setStations] = useState([]);  // 기본값을 빈 배열로 설정
    const [loading, setLoading] = useState(false);

    const fetchFuelStations = (lat, lng) => {
        setLoading(true);
        fetch(`/getJuyuso?lat=${lat}&lng=${lng}`)
            .then((response) => response.json())
            .then((data) => {
                setStations(data.RESULT.OIL || []);  // 데이터가 없을 경우 빈 배열로 설정
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching fuel stations:", error);
                setLoading(false);
            });
    };

    return (
        <div>
            <h1>주변 주유소 찾기</h1>
            <Map fetchFuelStations={fetchFuelStations} stations={stations} loading={loading}/>
        </div>
    );
};

export default Juyuso;
