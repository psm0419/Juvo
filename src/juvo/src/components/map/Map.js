import React, { useEffect, useRef, useState } from "react";
import FuelStationList from "../../components/map/FuelStationList";
import "../../assets/css/map/Map.css";
import startMarkerImg from "../../assets/image/StartMarker.png";
import FuelStationDetail from "../../components/map/FuelStationDetail";

const Map = ({ fetchFuelStations, stations, loading }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [lat, setLat] = useState(36.807317819607775);
    const [lng, setLng] = useState(127.14715449120254);
    const [marker, setMarker] = useState(null);
    const [fuelMarkers, setFuelMarkers] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [routeLine, setRouteLine] = useState(null);
    const [currentInfoWindow, setCurrentInfoWindow] = useState(null);
    const [activeInfoWindows, setActiveInfoWindows] = useState([]);
    const [filteredStations, setFilteredStations] = useState([]);
    const [selectedDetailStation, setSelectedDetailStation] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
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
    });
    const [activeTab, setActiveTab] = useState("주유소");

    const filterStations = () => {
        if (!stations || stations.length === 0) {
            console.log("Stations not available for filtering");
            return [];
        }
    
        const filtered = stations.filter(station => {
            const brandMatches = brands.cheap && station.pollDivCd === "알뜰주유소" ||
                brands.skEnergy && station.pollDivCd === "SK에너지" ||
                brands.gsCaltex && station.pollDivCd === "GS칼텍스" ||
                brands.hyundaiOilbank && station.pollDivCd === "현대오일뱅크" ||
                brands.sOil && station.pollDivCd === "S-OIL" ||
                brands.nOil && station.pollDivCd === "농협주유소" ||
                (!brands.cheap && !brands.skEnergy && !brands.gsCaltex && !brands.hyundaiOilbank && !brands.sOil && !brands.nOil);
    
            const additionalMatches = (!additionalInfo.carWash || station.carWashYn === "Y") &&
                (!additionalInfo.maintenance || station.maintYn === "Y") &&
                (!additionalInfo.convenience || station.cvsYn === "Y") &&
                (!additionalInfo.self || station.selfYn === "Y");
    
            // 거리 필터링 추가
            const address = station.NEW_ADR || station.newAdr || station.VAN_ADR || station.vanAdr;
            if (!address) return false;
    
            // 비동기 처리를 여기서 하지 않고, stations에 좌표가 이미 포함되어 있다고 가정
            // 실제로는 fetchFuelStations에서 좌표를 포함하도록 수정 필요
            const coordsLat = station.lat; // 예시, 실제 데이터 구조에 맞게 수정
            const coordsLng = station.lng;
            if (coordsLat && coordsLng) {
                const distance = getDistance(lat, lng, coordsLat, coordsLng);
                return brandMatches && additionalMatches && distance <= 5000;
            }
            return brandMatches && additionalMatches; // 좌표 없으면 거리 필터링 생략
        });
    
        console.log("Filtered stations:", filtered);
        return filtered;
    };

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

            // 경로와 정보창 초기화
            if (routeLine) {
                routeLine.setMap(null);
                setRouteLine(null);
            }
            setSelectedStation(null);
            if (currentInfoWindow) {
                currentInfoWindow.close();
                setCurrentInfoWindow(null);
            }

            // 부모 상태 업데이트
            setLat(newLat);
            setLng(newLng);
            console.log("Marker moved to lat:", newLat, "lng:", newLng);
            // fetchFuelStations 호출 제거
        };
    
        // 단일 디바운싱 핸들러
        const debounceHandleMarkerMove = debounce(handleMarkerMove, 500);

        kakao.maps.event.addListener(marker, "dragend", debounceHandleMarkerMove);
        kakao.maps.event.addListener(mapRef.current, "click", (mouseEvent) => {
            const latLng = mouseEvent.latLng;
            marker.setPosition(latLng);
            debounceHandleMarkerMove();
        });

        return () => {
            kakao.maps.event.removeListener(marker, "dragend", debounceHandleMarkerMove);
            kakao.maps.event.removeListener(mapRef.current, "click");
        };
    }, [marker, mapRef.current, setLat, setLng]);

    // stations가 변경될 때 filteredStations 업데이트
    useEffect(() => {
        if (stations && stations.length > 0) {
            const filtered = filterStations();
            console.log("Updated filteredStations after stations change:", filtered);
            setFilteredStations(filtered);
            setIsDataLoaded(true); // 데이터 로드 완료
            console.log("isDataLoaded set to true");
        } else {
            console.log("Stations is empty or not loaded yet");
            setFilteredStations([]);
            setIsDataLoaded(false);
        }
    }, [stations, brands, additionalInfo]);

    // 주유소 마커 업데이트
    useEffect(() => {
        if (!mapRef.current || !filteredStations || filteredStations.length === 0) {
            console.log("No filtered stations to display");
            fuelMarkers.forEach(marker => marker?.setMap(null));
            setFuelMarkers([]);
            return;
        }

        console.log("Fuel markers effect triggered with filteredStations:", filteredStations.length);

        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();

        fuelMarkers.forEach(marker => {
            marker?.setMap(null);
            if (marker.infoWindow) marker.infoWindow.close();
        });
        if (currentInfoWindow) {
            currentInfoWindow.close();
            setCurrentInfoWindow(null);
        }
        window.activeInfoWindows = [];
    
        const newFuelMarkers = [];
        const promises = filteredStations.map((station) => {
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
                        <div class="info-window">
                            <div class="info-window-title" onclick="console.log('Name clicked for uniId: ${station.uniId}'); window.showDetail('${station.uniId}', ${coords.getLat()}, ${coords.getLng()})" style="cursor: pointer;">
                                ${station.OS_NM || "이름 없음"} <span>(${station.pollDivCd || "이름 없음"})</span>
                            </div>
                            <div class="info-window-button-container">
                                <button onclick="registerFavoriteStation('${station.uniId}')" class="info-window-button">
                                    관심 주유소 등록
                                </button>
                            </div>
                            <div class="info-window-divider"></div>
                            <div class="info-window-details">
                                <div><span>📞</span> ${station.tel || "전화번호 없음"}</div>
                                <div><span>📍</span> ${station.newAdr || station.vanAdr || "주소 없음"}</div>
                            </div>
                            <div class="info-window-table-container">
                                <table class="info-window-table">
                                    <thead><tr><th>유종</th><th>가격</th></tr></thead>
                                    <tbody>
                                        <tr><td>휘발유</td><td class="info-window-price">${station.hoilPrice ? station.hoilPrice + '원' : '정보 없음'}</td></tr>
                                        <tr><td>경유</td><td class="info-window-price">${station.doilPrice ? station.doilPrice + '원' : '정보 없음'}</td></tr>
                                        <tr><td>고급 휘발유</td><td class="info-window-price">${station.goilPrice ? station.goilPrice + '원' : '정보 없음'}</td></tr>
                                        <tr><td>실내 등유</td><td class="info-window-price">${station.ioilPrice ? station.ioilPrice + '원' : '정보 없음'}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="info-window-icons">
                                <img src="https://www.opinet.co.kr/images/user/gis/oil_station_service1_01_off.gif" alt="세차장" 
                                    style="display: ${station.carWashYn === 'Y' ? 'inline-block' : 'none'};">
                                <img src="https://www.opinet.co.kr/images/user/gis/oil_station_service1_02_01_off.gif" alt="충전소" 
                                    style="display: ${station.lpgYn === 'Y' ? 'inline-block' : 'none'};">
                                <img src="https://www.opinet.co.kr/images/user/gis/oil_station_service1_03_off.gif" alt="경정비" 
                                    style="display: ${station.maintYn === 'Y' ? 'inline-block' : 'none'};">
                                <img src="https://www.opinet.co.kr/images/user/gis/oil_station_service1_04_off.gif" alt="편의점" 
                                    style="display: ${station.cvsYn === 'Y' ? 'inline-block' : 'none'};">
                            </div>
                            <div class="info-window-quality">
                                ${station.kpetroYn === "Y" ? "품질인증 주유소 ✅" : "품질인증 주유소 ❌"}
                            </div>
                            <button class="info-window-route-button" onclick="window.handleFindRoute(${coords.getLat()}, ${coords.getLng()})">
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
                    newFuelMarkers.push(stationMarker);
                    resolve(stationMarker);
                } else {
                    resolve(null);
                }
            });
        });
    });

    Promise.all(promises).then(newMarkers => {
        const validMarkers = newMarkers.filter(marker => marker !== null);
        setFuelMarkers(validMarkers);
        console.log("Fuel markers updated:", validMarkers.length);
    });

    window.showDetail = (uniId, lat, lng) => {
        console.log("Showing detail for uniId:", uniId);
        const station = filteredStations.find(s => s.uniId === uniId);
        console.log("Found station:", station);
        if (!station) {
            console.log("Station not found for uniId:", uniId);
            return;
        }
        setSelectedDetailStation({ ...station, lat, lng });
        if (currentInfoWindow) {
            currentInfoWindow.close();
            setCurrentInfoWindow(null);
        }
    };

    window.registerFavoriteStation = function (uniId) {
        console.log("Registering favorite station:", uniId);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        fetch('/api/favorite/juyuso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ uniId: uniId })
        })
            .then(response => {
                if (!response.ok) throw new Error('등록 실패');
                return response.json();
            })
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('로그인이 필요 합니다.');
            });
    };

    return () => {
        fuelMarkers.forEach(marker => {
            if (marker) kakao.maps.event.removeListener(marker, "click");
        });
        if (window.activeInfoWindows?.length > 0) {
            window.activeInfoWindows.forEach(activeWindow => activeWindow?.close());
        }
        if (currentInfoWindow) currentInfoWindow.close();
    };
}, [filteredStations, mapRef.current, lat, lng]); // lat, lng 추가

    const handleFetchStations = async () => {
        setIsDataLoaded(false);
        setFilteredStations([]); // 조회 전 초기화
        console.log("Fetching fuel stations for lat:", lat, "lng:", lng);
        await fetchFuelStations(lat, lng);
        console.log("Stations fetched:", stations);
    };

    const handleCloseDetail = () => {
        setSelectedDetailStation(null);
    };

    const handleStationClick = (station) => {
        if (!mapRef.current) return;

        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();
        const address = station.NEW_ADR || station.newAdr || station.VAN_ADR || station.vanAdr;

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

                const selectedMarker = fuelMarkers.find(marker =>
                    marker.getTitle() === (station.OS_NM || station.osNm)
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
        setAdditionalInfo({ carWash: false, maintenance: false, convenience: false, self: false });
    };

    return (
        <div className="map-container">
            <div ref={mapContainer} className="map"></div>
            {selectedDetailStation && (
                <FuelStationDetail station={selectedDetailStation} onClose={handleCloseDetail} />
            )}
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
                        stations={filteredStations}
                        loading={loading}
                        onStationClick={handleStationClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default Map;