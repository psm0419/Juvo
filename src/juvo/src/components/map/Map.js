import React, { useEffect, useRef, useState } from "react";
import FuelStationList from "../../components/map/FuelStationList";
import "../../assets/css/map/Map.css";
import startMarkerImg from "../../assets/image/StartMarker.png";

const Map = ({ fetchFuelStations, stations, loading }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [lat, setLat] = useState(36.807317819607775);
    const [lng, setLng] = useState(127.14715449120254);
    const [marker, setMarker] = useState(null);
    const [fuelMarkers, setFuelMarkers] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null); //선택한 주유소
    const [routeLine, setRouteLine] = useState(null); //경로 표시 라인
    const [currentInfoWindow, setCurrentInfoWindow] = useState(null); //현재 열려있는 정보창

    // 필터링 상태 관리

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
    const [activeTab, setActiveTab] = useState("주유소");

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
        if (!mapRef.current || !stations || stations.length === 0) return;

        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();

        // 기존 마커 및 정보 창 제거
        fuelMarkers.forEach(marker => {
            marker?.setMap(null);
            if (marker.infoWindow) {
                marker.infoWindow.close();
            }
        });

        if (currentInfoWindow) {
            currentInfoWindow.close();
            setCurrentInfoWindow(null);
        }
        // 전역 변수로 활성화된 정보창 저장
        window.activeInfoWindows = [];

        const newFuelMarkers = [];
        Promise.all(
            stations.map((station, index) => {
                return new Promise((resolve) => {
                    const address = station.NEW_ADR || station.newAdr || station.VAN_ADR || station.vanAdr;
                    if (!address) {
                        resolve(null);
                        return;
                    }

                    geocoder.addressSearch(address, (result, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                            const distance = getDistance(lat, lng, coords.getLat(), coords.getLng());

                            if (distance > 5000) {
                                resolve(null);
                                return;
                            }

                            const stationMarker = new kakao.maps.Marker({
                                position: coords,
                                map: mapRef.current,
                                title: station.OS_NM || station.osNm,
                            });

                            const infoWindowContent = `
                                <div style="width: 250px; padding: 10px; background-color: white; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                                    <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">
                                        ${station.osNm || "이름 없음"} <span style="color: green;">(${station.pollDivCd || "이름 없음"})</span>
                                    </div>
                                    <div style="font-size: 12px; margin-bottom: 5px;">
                                        <span>📞 ${station.tel || "전화번호 없음"}</span><br />
                                        <span>📍 ${station.newAdr || station.vanAdr || "주소 없음"}</span>
                                    </div>
                                    <div style="margin-bottom: 5px;">
                                        <span style="font-weight: bold;">휘발유: </span>
                                        <span style="color: #ff4500;">${station.hoilPrice || "정보 없음"}원</span><br />
                                        <span style="font-weight: bold;">경유: </span>
                                        <span style="color: #ff4500;">${station.doilPrice || "정보 없음"}원</span>
                                    </div>
                                    <div style="font-size: 12px; color: #555;">
                                        <span>${station.carWashYn === "Y" ? "세차장 O" : "세차장 X"}</span> | 
                                        <span>${station.maintYn === "Y" ? "경정비 O" : "경정비 X"}</span> | 
                                        <span>${station.cvsYn === "Y" ? "편의점 O" : "편의점 X"}</span> | 
                                        <span>${station.kpetroYn === "Y" ? "품질인증 주유소 O" : "품질인증 주유소 X"}</span>
                                    </div>
                                    <button 
                                        style="margin-top: 5px; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;"
                                        onclick="window.handleFindRoute(${coords.getLat()}, ${coords.getLng()})"
                                    >
                                        경로찾기
                                    </button>
                                </div>
                            `;

                            const infoWindow = new kakao.maps.InfoWindow({
                                content: infoWindowContent,
                            });

                            // 마커 클릭 이벤트
                            kakao.maps.event.addListener(stationMarker, "click", () => {
                                // 현재 클릭한 마커의 정보창이 이미 열려있는지 확인
                                const isInfoWindowOpen = currentInfoWindow === infoWindow;

                                // 전역 변수에 저장된 모든 활성 정보창 닫기
                                if (window.activeInfoWindows && window.activeInfoWindows.length > 0) {
                                    window.activeInfoWindows.forEach(activeWindow => {
                                        if (activeWindow) {
                                            activeWindow.close();
                                        }
                                    });
                                    window.activeInfoWindows = [];
                                }

                                // 현재 정보창 닫기
                                if (currentInfoWindow) {
                                    currentInfoWindow.close();
                                }
                                // 이미 열려있던 정보창이면 닫은 상태로 두고 상태 초기화
                                if (isInfoWindowOpen) {
                                    setCurrentInfoWindow(null);
                                    setSelectedStation(null);
                                    return;
                                }
                                // 새 정보창 열기
                                infoWindow.open(mapRef.current, stationMarker);

                                // 상태 업데이트
                                setCurrentInfoWindow(infoWindow);
                                window.activeInfoWindows.push(infoWindow);

                                setSelectedStation({ lat: coords.getLat(), lng: coords.getLng() });
                            });

                            // 마커에 infoWindow 연결
                            stationMarker.infoWindow = infoWindow;

                            newFuelMarkers.push(stationMarker);
                            resolve(stationMarker);
                        } else {
                            resolve(null);
                        }
                    });
                });
            })
        ).then(newMarkers => {
            const validMarkers = newMarkers.filter(marker => marker !== null);
            setFuelMarkers(validMarkers.length > 0 ? validMarkers : newFuelMarkers);
        });

        // 클린업 함수
        return () => {
            fuelMarkers.forEach(marker => {
                if (marker) {
                    kakao.maps.event.removeListener(marker, "click");
                }
            });

            // 모든 활성 정보창 닫기
            if (window.activeInfoWindows && window.activeInfoWindows.length > 0) {
                window.activeInfoWindows.forEach(activeWindow => {
                    if (activeWindow) {
                        activeWindow.close();
                    }
                });
            }

            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
        };
    }, [stations]);

    // 주유소 클릭 시 지도 이동 함수
    const handleStationClick = (station) => {
        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();
        const address = station.NEW_ADR || station.newAdr || station.VAN_ADR || station.vanAdr;

        geocoder.addressSearch(address, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                mapRef.current.setCenter(coords);
                mapRef.current.setLevel(3);

                // 전역 변수에 저장된 모든 활성 정보창 닫기
                if (window.activeInfoWindows && window.activeInfoWindows.length > 0) {
                    window.activeInfoWindows.forEach(activeWindow => {
                        if (activeWindow) {
                            activeWindow.close();
                        }
                    });
                    window.activeInfoWindows = [];
                }

                // 현재 정보창 닫기
                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }

                // 선택된 마커 찾아서 정보 창 열기
                const selectedMarker = fuelMarkers.find(marker =>
                    marker.getTitle() === (station.OS_NM || station.osNm)
                );

                if (selectedMarker && selectedMarker.infoWindow) {
                    selectedMarker.infoWindow.open(mapRef.current, selectedMarker);
                    setCurrentInfoWindow(selectedMarker.infoWindow);

                    // 전역 변수에 활성 정보창 추가
                    if (!window.activeInfoWindows) {
                        window.activeInfoWindows = [];
                    }
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
        if (!marker) return;

        const startLat = lat;
        const startLng = lng;

        const routeData = await fetchRouteFromTmap(startLat, startLng, destLat, destLng);

        if (!routeData) {
            console.error("경로 데이터를 가져올 수 없습니다.");
            return;
        }

        if (routeLine) {
            routeLine.setMap(null); // 기존 경로 제거
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
    };

    // 전역 함수로 등록 (InfoWindow에서 호출 가능하도록)
    window.handleFindRoute = handleFindRoute;

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
        setBrands({ cheap: false, skEnergy: false, gsCaltex: false, hyundaiOilbank: false, sOil: false, nOil: false });
        setAdditionalInfo({ carWash: false, maintenance: false, convenience: false, self: false, alwaysOpen: false });
    };

    return (
        <div className="map-container">
            <div ref={mapContainer} className="map"></div>
            <div className="map-sidebar">
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

                <div className="map-button-container">
                    <button onClick={handleFetchStations} className="map-search-button">
                        조회
                    </button>
                </div>

                <div className="map-station-list">
                    <FuelStationList
                        stations={stations}
                        loading={loading}
                        onStationClick={handleStationClick} // prop 전달
                    />
                </div>
            </div>
        </div>
    );
};

export default Map;