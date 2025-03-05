// Map.js
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import FuelStationList from "../../components/map/FuelStationList";

const Map = ({ fetchFuelStations, stations, loading }) => {
    const mapContainer = useRef(null);
    const [lat, setLat] = useState(37.5665); // Default coordinates (Seoul)
    const [lng, setLng] = useState(126.9780);
    const [marker, setMarker] = useState(null);

    useEffect(() => {
        // KakaoMap SDK가 로드되었을 때 실행되는 코드
        const kakao = window.kakao;

        kakao.maps.load(() => {
            const mapOptions = {
                center: new kakao.maps.LatLng(lat, lng),
                level: 5,
            };

            const map = new kakao.maps.Map(mapContainer.current, mapOptions);

            const newMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
                map: map,
                draggable: true,
            });

            setMarker(newMarker);

            // 마커 드래그 종료 시 좌표 가져오기
            kakao.maps.event.addListener(newMarker, "dragend", function () {
                const position = newMarker.getPosition();
                const newLat = position.getLat();
                const newLng = position.getLng();
                setLat(newLat);
                setLng(newLng);
            });

            // 지도 클릭 시 마커 이동
            kakao.maps.event.addListener(map, "click", function (mouseEvent) {
                const latLng = mouseEvent.latLng;
                newMarker.setPosition(latLng);
                setLat(latLng.getLat());
                setLng(latLng.getLng());
            });
        });
    }, [lat, lng]);

    const handleFetchStations = () => {
        fetchFuelStations(lat, lng);
    };

    return (
        <div style={{ position: "relative" }}>
        <div
            ref={mapContainer}
            style={{ width: "100%", height: "760px", marginBottom: "20px" }}
        ></div>

        {/* Flybox containing the fuel station list and button */}
        <div
            style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
                zIndex: "10",
                width: "250px",
                height: "fit-content",
                maxHeight: "90vh",
                overflowY: "auto",
            }}
        >
            <button onClick={handleFetchStations} style={{ marginTop: "10px" }}>
                조회
            </button>
            <FuelStationList stations={stations} loading={loading} />
        </div>
    </div>
    );
};

export default Map;
