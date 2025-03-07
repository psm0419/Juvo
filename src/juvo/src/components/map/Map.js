import React, { useEffect, useRef, useState } from "react";
import FuelStationList from "../../components/map/FuelStationList";
import "../../assets/css/map/Map.css";

const Map = ({ fetchFuelStations, stations, loading }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [lat, setLat] = useState(36.807317819607775);
    const [lng, setLng] = useState(127.14715449120254);
    const [marker, setMarker] = useState(null);
    const [fuelMarkers, setFuelMarkers] = useState([]);

    // 필터링 상태 관리
    const [searchMethod, setSearchMethod] = useState({
        subway: false,
        map: false,
        currentLocation: false,
        route: false,
    });
    const [brands, setBrands] = useState({
        cheap: false,
        skEnergy: false,
        gsCaltex: false,
        hyundaiOilbank: false,
        sOil: false,
        nOil: false,
    });
    const [additionalInfo, setAdditionalInfo] = useState({
        carWash: false,
        maintenance: false,
        convenience: false,
        self: false,
        alwaysOpen: false,
    });
    // 탭 선택 상태 관리
    const [activeTab, setActiveTab] = useState("주유소"); // 초기값을 "주유소"로 설정
    useEffect(() => {
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

    useEffect(() => {
        if (!mapRef.current || !stations || stations.length === 0) {
            console.log("No stations to display or map not ready", stations);
            return;
        }

        console.log("Stations received:", stations);

        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();

        fuelMarkers.forEach(marker => marker?.setMap(null));

        Promise.all(
            stations.map((station, index) => {
                return new Promise((resolve) => {
                    const address = station.NEW_ADR || station.newAdr || station.VAN_ADR || station.vanAdr;
                    if (!address) {
                        console.log(`Station ${index} has no address: ${station.UNI_ID || station.uniId}`);
                        resolve(null);
                        return;
                    }

                    console.log(`Geocoding address for ${station.OS_NM || station.osNm}: ${address}`);

                    geocoder.addressSearch(address, (result, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                            const distance = getDistance(lat, lng, coords.getLat(), coords.getLng());

                            if (distance > 5000) {
                                console.log(`Station ${index} out of 5km range: ${distance}m`);
                                resolve(null);
                                return;
                            }

                            const stationMarker = new kakao.maps.Marker({
                                position: coords,
                                map: mapRef.current,
                                title: station.OS_NM || station.osNm,
                            });

                            const infoWindow = new kakao.maps.InfoWindow({
                                content: `<div style="padding:5px;">${station.OS_NM || station.osNm}<br>가격: ${station.PRICE || station.hoilPrice || "정보 없음"}</div>`,
                            });

                            kakao.maps.event.addListener(stationMarker, "click", () => {
                                infoWindow.open(mapRef.current, stationMarker);
                            });

                            resolve(stationMarker);
                        } else {
                            console.error(`Geocoding failed for station ${index} (${station.OS_NM || station.osNm}): ${status}`);
                            resolve(null);
                        }
                    });
                });
            })
        ).then(newMarkers => {
            const validMarkers = newMarkers.filter(marker => marker !== null);
            setFuelMarkers(validMarkers);
            console.log(`Total markers created: ${validMarkers.length}`);
        }).catch(error => {
            console.error("Error creating markers:", error);
        });
    }, [stations]);

    const getDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleFetchStations = () => {
        fetchFuelStations(lat, lng);
    };

    const handleSearchMethodChange = (key) => {
        setSearchMethod((prev) => ({
            subway: key === "subway" ? !prev.subway : false,
            map: key === "map" ? !prev.map : false,
            currentLocation: key === "currentLocation" ? !prev.currentLocation : false,
            route: key === "route" ? !prev.route : false,
        }));
    };

    const handleBrandChange = (key) => {
        setBrands((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleAdditionalInfoChange = (key) => {
        setAdditionalInfo((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // 탭 변경 시 필터링 상태 초기화 (필요 시)
        setSearchMethod({ subway: false, map: false, currentLocation: false, route: false });
        setBrands({ cheap: false, skEnergy: false, gsCaltex: false, hyundaiOilbank: false, sOil: false, nOil: false });
        setAdditionalInfo({ carWash: false, maintenance: false, convenience: false, self: false, alwaysOpen: false });
    };
    return (
        <div className="map-container">
            <div ref={mapContainer} className="map"></div>
            <div className="map-sidebar">
                {/* 탭 영역 */}
                <div className="map-tabs">
                <div
                            className={`map-tab ${activeTab === "주유소" ? "map-tab-active" : "map-tab-inactive"}`}
                            onClick={() => handleTabChange("주유소")}
                        >
                            주유소
                        </div>
                        <div
                            className={`map-tab ${activeTab === "충전소" ? "map-tab-active" : "map-tab-inactive"}`}
                            onClick={() => handleTabChange("충전소")}
                        >
                            충전소
                        </div>
                </div>

                

                {/* 상표 선택 */}
                <div className="map-section">
                    <div className="map-section-title">상표</div>
                    <div className="map-options">
                        {[
                            { key: "cheap", label: "알뜰" },
                            { key: "skEnergy", label: "SK에너지" },
                            { key: "gsCaltex", label: "GS칼텍스" },
                            { key: "hyundaiOilbank", label: "현대오일뱅크" },
                            { key: "sOil", label: "S-OIL" },
                            { key: "nOil", label: "농협" },
                        ].map(({ key, label }) => (
                            <label key={key} className="map-option-label">
                                <input
                                    type="checkbox"
                                    checked={brands[key]}
                                    onChange={() => handleBrandChange(key)}
                                />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 부가정보 선택 */}
                <div className="map-section">
                    <div className="map-section-title">부가정보</div>
                    <div className="map-options">
                        {[
                            { key: "carWash", label: "세차장" },
                            { key: "maintenance", label: "경정비" },
                            { key: "convenience", label: "편의점" },
                            { key: "self", label: "셀프" },
                            { key: "alwaysOpen", label: "24시간" },
                        ].map(({ key, label }) => (
                            <label key={key} className="map-option-label">
                                <input
                                    type="checkbox"
                                    checked={additionalInfo[key]}
                                    onChange={() => handleAdditionalInfoChange(key)}
                                />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 조회 버튼 */}
                <div className="map-button-container">
                    <button
                        onClick={handleFetchStations}
                        className="map-search-button"
                    >
                        조회
                    </button>
                </div>

                {/* 주유소 목록 */}
                <div className="map-station-list">
                    <FuelStationList stations={stations} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default Map;