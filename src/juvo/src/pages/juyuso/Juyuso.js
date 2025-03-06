import React, { useState } from "react";
import Map from "../../components/map/Map";

const Juyuso = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lat, setLat] = useState(36.807317819607775);
    const [lng, setLng] = useState(127.14715449120254);

    const fetchFuelStations = (lat, lng) => {
        setLoading(true);
        fetch(`/getJuyuso?lat=${lat}&lng=${lng}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched stations:", data);
                const stationList = data.RESULT?.OIL || [];
                setStations(stationList);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching fuel stations:", error);
                setStations([]);
                setLoading(false);
            });
    };

    const handleFetchStations = () => {
        fetchFuelStations(lat, lng);
    };

    return (
        <div>
            <Map fetchFuelStations={fetchFuelStations} stations={stations} loading={loading} />
            <button onClick={handleFetchStations} style={{ marginTop: "10px" }}>조회</button>
        </div>
    );
};

export default Juyuso;