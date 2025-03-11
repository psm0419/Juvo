import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/map/ChargingStationMap.css"; // 새로운 CSS 파일
import startMarkerImg from "../../assets/image/StartMarker.png";
import FuelStationList from "../../components/map/FuelStationList";
import FuelStationDetail from "../../components/map/FuelStationDetail";

const ChargingStationMap = () => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [lat, setLat] = useState(36.807317819607775);
    const [lng, setLng] = useState(127.14715449120254);
    const [marker, setMarker] = useState(null);
    const [chargingMarkers, setChargingMarkers] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [routeLine, setRouteLine] = useState(null);
    const [currentInfoWindow, setCurrentInfoWindow] = useState(null);
    const [activeInfoWindows, setActiveInfoWindows] = useState([]);
    const [chargingStations, setChargingStations] = useState([]);
    const [selectedDetailStation, setSelectedDetailStation] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // 전국 지역 목록 (sido)
    const [regions, setRegions] = useState({
        "강원특별자치도": false,
        "경기도": false,
        "경상남도": false,
        "경상북도": false,
        "광주광역시": false,
        "대구광역시": false,
        "대전광역시": false,
        "부산광역시": false,
        "서울특별시": false,
        "세종특별자치시": false,
        "울산광역시": false,
        "인천광역시": false,
        "전라남도": false,
        "전라북도": false,
        "제주특별자치도": false,
        "충청남도": false,
        "충청북도": false,
    });

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 지도와 마커 초기화
    useEffect(() => {
        const kakao = window.kakao;
        kakao.maps.load(() => {
            const mapOptions = {
                center: new kakao.maps.LatLng(lat, lng),
                level: 5,
            };

            const map = new kakao.maps.Map(mapContainer.current, mapOptions);
            mapRef.current = map;

            const markerImage = new kakao.maps.MarkerImage(
                startMarkerImg,
                new kakao.maps.Size(40, 40),
                { offset: new kakao.maps.Point(20, 40) }
            );

            const userMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
                map: map,
                draggable: true,
                image: markerImage,
            });
            setMarker(userMarker);
        });
    }, []);

    // 마커 이동 및 경로 초기화
    useEffect(() => {
        if (!marker || !mapRef.current) return;

        const kakao = window.kakao;

        const handleMarkerMove = () => {
            const position = marker.getPosition();
            const newLat = position.getLat();
            const newLng = position.getLng();

            if (routeLine) {
                routeLine.setMap(null);
                setRouteLine(null);
                console.log("RouteLine cleared on marker move");
            }
            setSelectedStation(null);
            if (currentInfoWindow) {
                currentInfoWindow.close();
                setCurrentInfoWindow(null);
            }

            setLat(newLat);
            setLng(newLng);
            console.log("Marker moved to lat:", newLat, "lng:", newLng);
        };

        const debounceHandleMarkerMove = debounce(handleMarkerMove, 500);

        kakao.maps.event.addListener(marker, "dragend", debounceHandleMarkerMove);
        kakao.maps.event.addListener(mapRef.current, "click", (mouseEvent) => {
            const latLng = mouseEvent.latLng;
            marker.setPosition(latLng);
            debounceHandleMarkerMove();
        });

        return () => {
            kakao.maps.event.removeListener(marker, "dragend", debounceHandleMarkerMove);
            kakao.maps.event.removeListener(mapRef.current, "click", debounceHandleMarkerMove);
        };
    }, [marker, mapRef.current, routeLine, setRouteLine, currentInfoWindow, setCurrentInfoWindow, setSelectedStation]);

    // 충전소 마커 업데이트
    useEffect(() => {
        if (!mapRef.current || !chargingStations || chargingStations.length === 0) {
            console.log("No charging stations to display");
            chargingMarkers.forEach(marker => marker?.setMap(null));
            setChargingMarkers([]);
            return;
        }

        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();

        chargingMarkers.forEach(marker => {
            marker?.setMap(null);
            if (marker.infoWindow) marker.infoWindow.close();
        });
        if (currentInfoWindow) {
            currentInfoWindow.close();
            setCurrentInfoWindow(null);
        }
        window.activeInfoWindows = [];

        const newChargingMarkers = [];
        const promises = chargingStations.map(station => {
            return new Promise((resolve) => {
                const address = station.address;
                if (!address) {
                    resolve(null);
                    return;
                }

                geocoder.addressSearch(address, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        const stationMarker = new kakao.maps.Marker({
                            position: coords,
                            map: mapRef.current,
                            title: station.station_name,
                        });

                        const infoWindowContent = `
                            <div class="charging-info-window">
                                <div class="charging-info-title">${station.station_name}</div>
                                <div class="charging-info-details">
                                    <div><span>📍</span> ${station.address}</div>
                                    <div><span>충전기 타입</span> ${station.charger_type}</div>
                                    <div><span>운영기관</span> ${station.operator_large}</div>
                                    <div><span>급속 충전량</span> ${station.rapid_charge_amount}</div>
                                </div>
                                <button class="charging-info-route-button" onclick="window.handleFindRoute(${coords.getLat()}, ${coords.getLng()})">
                                    경로찾기
                                </button>
                            </div>
                        `;

                        const infoWindow = new kakao.maps.InfoWindow({
                            content: infoWindowContent,
                        });

                        kakao.maps.event.addListener(stationMarker, "click", () => {
                            if (window.activeInfoWindows.length > 0) {
                                window.activeInfoWindows.forEach(activeWindow => activeWindow?.close());
                                window.activeInfoWindows = [];
                            }
                            if (currentInfoWindow) currentInfoWindow.close();

                            infoWindow.open(mapRef.current, stationMarker);
                            setCurrentInfoWindow(infoWindow);
                            window.activeInfoWindows.push(infoWindow);
                            setSelectedStation({ lat: coords.getLat(), lng: coords.getLng() });
                        });

                        stationMarker.infoWindow = infoWindow;
                        newChargingMarkers.push(stationMarker);
                        resolve(stationMarker);
                    } else {
                        resolve(null);
                    }
                });
            });
        });

        Promise.all(promises).then(newMarkers => {
            const validMarkers = newMarkers.filter(marker => marker !== null);
            setChargingMarkers(validMarkers);
            console.log("Charging station markers updated:", validMarkers.length);
        });

        return () => {
            chargingMarkers.forEach(marker => {
                if (marker) kakao.maps.event.removeListener(marker, "click");
            });
            if (window.activeInfoWindows?.length > 0) {
                window.activeInfoWindows.forEach(activeWindow => activeWindow?.close());
            }
            if (currentInfoWindow) currentInfoWindow.close();
        };
    }, [chargingStations, mapRef.current]);

    const handleFetchChargingStations = async () => {
        setIsDataLoaded(false);
        setChargingStations([]);
        setChargingMarkers([]);

        const selectedRegions = Object.keys(regions).filter(key => regions[key]);
        if (selectedRegions.length === 0) {
            alert("최소 한 개의 지역을 선택해주세요.");
            setIsDataLoaded(true);
            return;
        }

        try {
            const response = await fetch("/api/charging-stations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ regions: selectedRegions }),
            });
            if (!response.ok) throw new Error("Failed to fetch charging stations");
            const data = await response.json();
            console.log("Charging stations fetched:", data);
            setChargingStations(data);
            setIsDataLoaded(true);
        } catch (error) {
            console.error("Error fetching charging stations:", error);
            setIsDataLoaded(true);
        }
    };

    const handleCloseDetail = () => {
        setSelectedDetailStation(null);
    };

    const handleStationClick = (station) => {
        if (!mapRef.current) return;

        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();
        const address = station.address;

        geocoder.addressSearch(address, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                mapRef.current.setCenter(coords);
                mapRef.current.setLevel(3);

                if (window.activeInfoWindows && window.activeInfoWindows.length > 0) {
                    window.activeInfoWindows.forEach(activeWindow => {
                        if (activeWindow) activeWindow.close();
                    });
                    window.activeInfoWindows = [];
                }

                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }

                const selectedMarker = chargingMarkers.find(marker =>
                    marker.getTitle() === station.station_name
                );

                if (selectedMarker && selectedMarker.infoWindow) {
                    selectedMarker.infoWindow.open(mapRef.current, selectedMarker);
                    setCurrentInfoWindow(selectedMarker.infoWindow);
                    if (!window.activeInfoWindows) window.activeInfoWindows = [];
                    window.activeInfoWindows.push(selectedMarker.infoWindow);
                    setSelectedStation({ lat: coords.getLat(), lng: coords.getLng() });
                }
            }
        });
    };

    const fetchRouteFromTmap = async (startLat, startLng, endLat, endLng) => {
        const apiKey = "QPrFw4mVJd3ZoUjdTvZQA6vU82HDgXSf5Pd2eyYH";
        const url = "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json";

        const headers = {
            "Content-Type": "application/json",
            "appKey": apiKey,
        };

        const body = {
            startX: startLng,
            startY: startLat,
            endX: endLng,
            endY: endLat,
            reqCoordType: "WGS84GEO",
            resCoordType: "WGS84GEO",
            startName: "출발지",
            endName: "도착지",
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            });

            const data = await response.json();
            return data.features;
        } catch (error) {
            console.error("경로 탐색 오류:", error);
            return null;
        }
    };

    const handleFindRoute = async (destLat, destLng) => {
        if (!mapRef.current || !marker) return;

        const startLat = lat;
        const startLng = lng;

        if (currentInfoWindow) {
            currentInfoWindow.close();
            setCurrentInfoWindow(null);
        }
        if (activeInfoWindows.length > 0) {
            activeInfoWindows.forEach(infoWindow => infoWindow.close());
            setActiveInfoWindows([]);
        }

        const routeData = await fetchRouteFromTmap(startLat, startLng, destLat, destLng);

        if (!routeData) {
            console.error("경로 데이터를 가져올 수 없습니다.");
            return;
        }

        if (routeLine) {
            routeLine.setMap(null);
        }

        const kakao = window.kakao;
        const path = routeData
            .filter((item) => item.geometry.type === "LineString")
            .flatMap((item) => item.geometry.coordinates)
            .map(([lng, lat]) => new kakao.maps.LatLng(lat, lng));

        const newRouteLine = new kakao.maps.Polyline({
            path: path,
            strokeWeight: 5,
            strokeColor: "#FF4500",
            strokeOpacity: 0.8,
            strokeStyle: "solid",
        });

        newRouteLine.setMap(mapRef.current);
        setRouteLine(newRouteLine);

        const bounds = new kakao.maps.LatLngBounds();
        bounds.extend(new kakao.maps.LatLng(startLat, startLng));
        bounds.extend(new kakao.maps.LatLng(destLat, destLng));
        mapRef.current.setBounds(bounds);

        setSelectedStation(null);
        console.log("Route drawn with Tmap data");
    };

    window.handleFindRoute = handleFindRoute;

    const handleRegionChange = (key) => {
        setRegions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="charging-map-container">
            <div ref={mapContainer} className="charging-map"></div>
            {selectedDetailStation && (
                <FuelStationDetail station={selectedDetailStation} onClose={handleCloseDetail} />
            )}
            <div className="charging-sidebar">
                <div className="charging-section">
                    <div className="charging-section-title">지역</div>
                    <div className="charging-options">
                        {Object.keys(regions).map((region) => (
                            <label key={region} className="charging-option-label">
                                <input
                                    type="checkbox"
                                    checked={regions[region]}
                                    onChange={() => handleRegionChange(region)}
                                />
                                <span>{region}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="charging-button-container">
                    <button onClick={handleFetchChargingStations} className="charging-search-button">
                        조회
                    </button>
                </div>

                <div className="charging-station-list">
                    <FuelStationList
                        stations={chargingStations}
                        loading={!isDataLoaded}
                        onStationClick={handleStationClick}
                        isChargingStation={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChargingStationMap;