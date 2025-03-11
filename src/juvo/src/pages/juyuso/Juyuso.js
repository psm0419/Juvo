import React, { useState } from "react";
import Map from "../../components/map/Map";

const Juyuso = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lat, setLat] = useState(36.807317819607775);
    const [lng, setLng] = useState(127.14715449120254);

    const fetchFuelStations = async (lat, lng) => {
        setLoading(true);
        try {
            const response = await fetch(`/getJuyuso?lat=${lat}&lng=${lng}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched stations:", data);
            const stationList = data.RESULT?.OIL || [];
            setStations(stationList);
        } catch (error) {
            console.error("Error fetching fuel stations:", error);
            setStations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchStations = () => {
        fetchFuelStations(lat, lng); // 조회 버튼 클릭 시에만 호출
    };

    return (
        <div>
            <Map 
                fetchFuelStations={fetchFuelStations} 
                stations={stations} 
                loading={loading} 
                lat={lat} 
                lng={lng} 
                setLat={setLat} 
                setLng={setLng} // 부모 상태 업데이트용
            />
        </div>
    );
};

export default Juyuso;