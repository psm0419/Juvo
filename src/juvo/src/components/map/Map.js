import React, { useEffect, useRef, useState } from "react";
import proj4 from 'proj4';
import FuelStationList from "../../components/map/FuelStationList";

const Map = ({ fetchFuelStations, stations, loading }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null); // 맵 객체를 저장하기 위한 ref 추가
    const [lat, setLat] = useState(37.5665);
    const [lng, setLng] = useState(126.9780);
    const [marker, setMarker] = useState(null);
    const [fuelMarkers, setFuelMarkers] = useState([]); // 주유소 마커들을 별도로 관리

    useEffect(() => {
        // EPSG:5186 정의
        proj4.defs("EPSG:5186", "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=0.9999 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

        const kakao = window.kakao;
        kakao.maps.load(() => {
            const mapOptions = {
                center: new kakao.maps.LatLng(lat, lng),
                level: 5,
            };

            const map = new kakao.maps.Map(mapContainer.current, mapOptions);
            mapRef.current = map; // 맵 객체 저장

            // 사용자 마커
            const userMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
                map: map,
                draggable: true,
            });
            setMarker(userMarker);

            // 드래그 종료 이벤트
            kakao.maps.event.addListener(userMarker, "dragend", function () {
                const position = userMarker.getPosition();
                setLat(position.getLat());
                setLng(position.getLng());
            });

            // 맵 클릭 이벤트
            kakao.maps.event.addListener(map, "click", function (mouseEvent) {
                const latLng = mouseEvent.latLng;
                userMarker.setPosition(latLng);
                setLat(latLng.getLat());
                setLng(latLng.getLng());
            });
        });
    }, []); // 초기 렌더링 시에만 실행

    // 주유소 마커를 위한 별도의 useEffect
    useEffect(() => {
        if (!mapRef.current || !stations?.length) return;

        const kakao = window.kakao;
        // 기존 주유소 마커 제거
        fuelMarkers.forEach(marker => marker?.setMap(null));

        const newMarkers = stations.map((station) => {
            const stationX = parseFloat(station.GIS_X_COOR);
            const stationY = parseFloat(station.GIS_Y_COOR);

            if (!isNaN(stationX) && !isNaN(stationY)) {
                try {
                    // KATEC -> WGS84 변환
                    const wgs84Coords = proj4('EPSG:5186', 'EPSG:4326', [stationX, stationY]);
                    const stationLat = wgs84Coords[1];
                    const stationLng = wgs84Coords[0];

                    if (isNaN(stationLat) || isNaN(stationLng)) {
                        console.error('Invalid coordinates after conversion:', station);
                        return null;
                    }

                    // 주유소 마커 생성
                    const stationMarker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(stationLat, stationLng),
                        map: mapRef.current,
                        title: station.OS_NM
                    });

                    // 인포윈도우
                    const infoWindow = new kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;">${station.OS_NM}</div>`,
                    });

                    kakao.maps.event.addListener(stationMarker, "click", () => {
                        infoWindow.open(mapRef.current, stationMarker);
                    });

                    return stationMarker;
                } catch (error) {
                    console.error('Error converting coordinates:', error, station);
                    return null;
                }
            }
            return null;
        }).filter(marker => marker !== null);

        setFuelMarkers(newMarkers);
    }, [stations]); // stations 변경 시에만 실행

    const handleFetchStations = () => {
        fetchFuelStations(lat, lng);
    };

    return (
        <div style={{ position: "relative" }}>
            <div
                ref={mapContainer}
                style={{ width: "100%", height: "700px", marginBottom: "20px" }}
            ></div>            
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
                    height: "650px",
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
