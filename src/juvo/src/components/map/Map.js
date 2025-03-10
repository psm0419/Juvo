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
    const [selectedStation, setSelectedStation] = useState(null);
    const [routeLine, setRouteLine] = useState(null);
    const [currentInfoWindow, setCurrentInfoWindow] = useState(null);
    const [activeInfoWindows, setActiveInfoWindows] = useState([]);
    const [filteredStations, setFilteredStations] = useState([]);

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

    // 필터링 로직
    const filterStations = () => {
        if (!stations || stations.length === 0) return [];

        let filtered = [...stations];

        const activeBrands = Object.keys(brands).filter(key => brands[key]);
        if (activeBrands.length > 0) {
            filtered = filtered.filter(station => {
                const brandCode = station.pollDivCd?.toUpperCase();
                return activeBrands.some(brand => {
                    switch (brand) {
                        case "cheap": return brandCode === "RTX";
                        case "skEnergy": return brandCode === "SKE";
                        case "gsCaltex": return brandCode === "GSC";
                        case "hyundaiOilbank": return brandCode === "HDO";
                        case "sOil": return brandCode === "SOL";
                        case "nOil": return brandCode === "NHO";
                        default: return false;
                    }
                });
            });
        }

        const activeInfo = Object.keys(additionalInfo).filter(key => additionalInfo[key]);
        if (activeInfo.length > 0) {
            filtered = filtered.filter(station => {
                return activeInfo.every(info => {
                    switch (info) {
                        case "carWash": return station.carWashYn === "Y";
                        case "maintenance": return station.maintYn === "Y";
                        case "convenience": return station.cvsYn === "Y";
                        case "self": return station.selfYn === "Y" || (station.osNm && station.osNm.includes("셀프"));
                        default: return false;
                    }
                });
            });
        }

        console.log("Filtered stations:", filtered); // 필터링 결과 디버깅
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

            return () => {
                kakao.maps.event.removeListener(userMarker, "dragend");
                kakao.maps.event.removeListener(map, "click");
            };
        });
    }, []);

    // 마커 이동 및 경로 초기화
    useEffect(() => {
        if (!marker || !mapRef.current) return;

        const kakao = window.kakao;

        const handleMarkerMove = () => {
            const position = marker.getPosition();
            setLat(position.getLat());
            setLng(position.getLng());

            if (routeLine) {
                routeLine.setMap(null);
                setRouteLine(null);
            }
            setSelectedStation(null);
            if (currentInfoWindow) {
                currentInfoWindow.close();
                setCurrentInfoWindow(null);
            }
        };

        kakao.maps.event.addListener(marker, "dragend", handleMarkerMove);
        kakao.maps.event.addListener(mapRef.current, "click", (mouseEvent) => {
            const latLng = mouseEvent.latLng;
            marker.setPosition(latLng);
            handleMarkerMove();
        });

        return () => {
            kakao.maps.event.removeListener(marker, "dragend", handleMarkerMove);
            kakao.maps.event.removeListener(mapRef.current, "click");
        };
    }, [marker, routeLine, currentInfoWindow]);

    // 필터링 및 주유소 마커 업데이트
    useEffect(() => {
        const filtered = filterStations();
        setFilteredStations(filtered);

        if (!mapRef.current || !filtered) {
            setFuelMarkers([]);
            return;
        }

        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();

        // 기존 마커 완전 제거
        fuelMarkers.forEach(marker => {
            marker?.setMap(null);
            if (marker.infoWindow) marker.infoWindow.close();
        });
        setFuelMarkers([]); // 상태 초기화

        if (currentInfoWindow) {
            currentInfoWindow.close();
            setCurrentInfoWindow(null);
        }
        window.activeInfoWindows = [];

        const newFuelMarkers = [];
        if (filtered.length === 0) {
            setFuelMarkers([]);
            console.log("No markers to display after filtering");
            return;
        }

        Promise.all(
            filtered.map((station) => {
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
                                <div class="info-window-title">
                                    ${station.OS_NM || "이름 없음"} <span>(${station.pollDivCd || "이름 없음"})</span>
                                </div>
                                <div class="info-window-button-container">
                                    <button onclick="registerFavoriteStation('${station.uniId}')" class="info-window-button">
                                        관심 주유소 등록
                                    </button>
                                </div>
                                <div class="info-window-divider"></div>
                                <div class="info-window-details">
                                    <div>
                                        <span>📞</span> ${station.tel || "전화번호 없음"}
                                    </div>
                                    <div>
                                        <span>📍</span> ${station.newAdr || station.vanAdr || "주소 없음"}
                                    </div>
                                </div>
                                <div class="info-window-table-container">
                                    <table class="info-window-table">
                                        <thead>
                                            <tr>
                                                <th>유종</th>
                                                <th>가격</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>휘발유</td>
                                                <td class="info-window-price">${station.hoilPrice ? station.hoilPrice + '원' : '정보 없음'}</td>
                                            </tr>
                                            <tr>
                                                <td>경유</td>
                                                <td class="info-window-price">${station.doilPrice ? station.doilPrice + '원' : '정보 없음'}</td>
                                            </tr>
                                            <tr>
                                                <td>고급 휘발유</td>
                                                <td class="info-window-price">${station.goilPrice ? station.goilPrice + '원' : '정보 없음'}</td>
                                            </tr>
                                            <tr>
                                                <td>실내 등유</td>
                                                <td class="info-window-price">${station.ioilPrice ? station.ioilPrice + '원' : '정보 없음'}</td>
                                            </tr>
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
                                <button class="info-window-route-button"
                                    onclick="window.handleFindRoute(${coords.getLat()}, ${coords.getLng()})">
                                    경로찾기
                                </button>
                            </div>
                        `;

                            // 관심 주유소 등록 함수 (글로벌 스코프에 정의)
                            window.registerFavoriteStation = function (uniId) {
                                const token = localStorage.getItem('accessToken'); // 로그인 시 저장된 토큰 가져오기
                                if (!token) {
                                    alert('로그인이 필요합니다.');
                                    return;
                                }
                            
                                fetch('/api/favorite/juyuso', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}` // JWT 토큰을 헤더에 포함
                                    },
                                    body: JSON.stringify({
                                        uniId: uniId // userId는 백엔드에서 추출
                                    })
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('등록 실패');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    if (data.status === 'success') {
                                        alert(data.message);
                                    } else {
                                        alert(data.message);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    alert('등록에 실패했습니다.');
                                });
                            };


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
            })
        ).then(newMarkers => {
            const validMarkers = newMarkers.filter(marker => marker !== null);
            setFuelMarkers(validMarkers);
            console.log("Updated fuel markers:", validMarkers); // 마커 업데이트 확인
        });

        return () => {
            fuelMarkers.forEach(marker => {
                if (marker) kakao.maps.event.removeListener(marker, "click");
            });
            if (window.activeInfoWindows?.length > 0) {
                window.activeInfoWindows.forEach(activeWindow => activeWindow?.close());
            }
            if (currentInfoWindow) currentInfoWindow.close();
        };
    }, [stations, lat, lng, brands, additionalInfo]);

    // 주유소 클릭 시 지도 이동 함수
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
        setAdditionalInfo({ carWash: false, maintenance: false, convenience: false, self: false });
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