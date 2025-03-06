import React, { useEffect, useRef, useState } from "react";
import proj4 from 'proj4';
import FuelStationList from "../../components/map/FuelStationList";

const Map = ({ fetchFuelStations, stations, loading }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [lat, setLat] = useState(36.807317819607775); // 초기 좌표 고정
    const [lng, setLng] = useState(127.14715449120254);
    const [marker, setMarker] = useState(null);
    const [fuelMarkers, setFuelMarkers] = useState([]);

    // 맵 초기화
    useEffect(() => {
        // 천안용 변환식
        proj4.defs("CHEONAN", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=310960 +y_0=600050 +ellps=GRS80 +units=m +no_defs");
        // 서울용 변환식 (서울 데이터 기준으로 조정)
        proj4.defs("SEOUL", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=313500 +y_0=597000 +ellps=GRS80 +units=m +no_defs");

        const kakao = window.kakao;
        kakao.maps.load(() => {
            const mapOptions = {
                center: new kakao.maps.LatLng(lat, lng),
                level: 3,
            };

            const map = new kakao.maps.Map(mapContainer.current, mapOptions);
            mapRef.current = map;

            const userMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
                map: map,
                draggable: true,
            });
            setMarker(userMarker);

            kakao.maps.event.addListener(userMarker, "dragend", function () {
                const position = userMarker.getPosition();
                setLat(position.getLat());
                setLng(position.getLng());
            });

            kakao.maps.event.addListener(map, "click", function (mouseEvent) {
                const latLng = mouseEvent.latLng;
                userMarker.setPosition(latLng);
                setLat(latLng.getLat());
                setLng(latLng.getLng());
            });
        });
    }, []);

    // 주유소 마커 업데이트
    useEffect(() => {
        if (!mapRef.current || !stations?.length) return;

        const kakao = window.kakao;
        fuelMarkers.forEach(marker => marker?.setMap(null));

        const newMarkers = stations.map((station, index) => {
            const stationX = parseFloat(station.GIS_X_COOR);
            const stationY = parseFloat(station.GIS_Y_COOR);

            console.log(`Station ${index} Raw:`, { stationX, stationY });

            if (!isNaN(stationX) && !isNaN(stationY)) {
                try {
                    // Y 값에 따라 변환식 선택
                    let wgs84Coords;
                    if (stationY < 500000) { // 천안 범위 (Y < 500000)
                        wgs84Coords = proj4('CHEONAN', 'EPSG:4326', [stationX, stationY]);
                    } else { // 서울 범위 (Y >= 500000)
                        wgs84Coords = proj4('SEOUL', 'EPSG:4326', [stationX, stationY]);
                    }
                    let stationLat = wgs84Coords[1];
                    let stationLng = wgs84Coords[0];

                    // 천안 지역 경도 보정 (북쪽 치우침 보정)
                    if (stationY < 500000) {
                        const yIncrease = stationY - 467170.43937;
                        const maxYIncrease = 5000;
                        const longitudeCorrection = (yIncrease / maxYIncrease) * -0.00114;
                        stationLng += longitudeCorrection;
                    }

                    console.log(`Station ${index} Converted:`, { stationLat, stationLng });

                    const distance = getDistance(lat, lng, stationLat, stationLng);
                    if (distance > 5000) {
                        console.log(`Station ${index} out of 5km range: ${distance}m`);
                        return null;
                    }

                    if (stationLat < 33 || stationLat > 43 || stationLng < 124 || stationLng > 132) {
                        console.error(`Out of range for station ${index}:`, { stationLat, stationLng });
                        return null;
                    }

                    const stationMarker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(stationLat, stationLng),
                        map: mapRef.current,
                        title: station.OS_NM,
                    });

                    const infoWindow = new kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;">${station.OS_NM}</div>`,
                    });

                    kakao.maps.event.addListener(stationMarker, "click", () => {
                        infoWindow.open(mapRef.current, stationMarker);
                    });

                    return stationMarker;
                } catch (error) {
                    console.error(`Conversion error for station ${index}:`, error);
                    return null;
                }
            }
            return null;
        }).filter(marker => marker !== null);

        setFuelMarkers(newMarkers);
        console.log(`Total markers created: ${newMarkers.length}`);
    }, [stations]);

    // 거리 계산 함수 (단위: 미터)
    const getDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371000; // 지구 반지름 (미터)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // 거리 (미터)
    };

    const handleFetchStations = () => {
        fetchFuelStations(lat, lng, 5000); // 반경 5000m 명시
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