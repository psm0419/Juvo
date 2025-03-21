import React, { useEffect, useRef, useState } from "react";
import FuelStationList from "../../components/map/FuelStationList";
import "../../assets/css/map/Map.css";
import startMarkerImg from "../../assets/image/StartMarker.png";
import FuelStationDetail from "../../components/map/FuelStationDetail";
import HdoImage from "../../assets/image/MarkerHdo.png";
import GscImage from "../../assets/image/MarkerGsc.png";
import SkeImage from "../../assets/image/MarkerSke.png";
import SolImage from "../../assets/image/MarkerSol.png";
import RtxImage from "../../assets/image/MarkerRtx.png";
import NhoImage from "../../assets/image/MarkerNho.png";
import EvImage from "../../assets/image/MarkerEv.png";
import Swal from "sweetalert2";

const Map = ({ fetchFuelStations, stations, loading }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [lat, setLat] = useState(36.807317819607775);
    const [lng, setLng] = useState(127.14715449120254);
    const [marker, setMarker] = useState(null);
    const [fuelMarkers, setFuelMarkers] = useState([]);
    const [chargingMarkers, setChargingMarkers] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [routeLine, setRouteLine] = useState(null);
    const [currentInfoWindow, setCurrentInfoWindow] = useState(null);
    const [filteredStations, setFilteredStations] = useState([]);
    const [chargingStations, setChargingStations] = useState([]);
    const [selectedDetailStation, setSelectedDetailStation] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState("주유소");
    const [sidoList, setSidoList] = useState([]);
    const [routeInfo, setRouteInfo] = useState({ distance: null, time: null });
    const [originalChargingStations, setOriginalChargingStations] = useState([]);
    const [filteredChargingStations, setFilteredChargingStations] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportUniId, setReportUniId] = useState(null);
    const [selectedBlackType, setSelectedBlackType] = useState(null);
    const [favoriteStations, setFavoriteStations] = useState([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [searchOption, setSearchOption] = useState("0");
    const [isMarkerLoading, setIsMarkerLoading] = useState(false);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true); // 기본값 false로 설정 (닫힌 상태)

    const openReportModal = (uniId) => {
        setReportUniId(uniId);
        setShowReportModal(true);
    };

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

    const [regions, setRegions] = useState({});

    const stationsToShow = showFavoritesOnly
        ? filteredStations.filter((station) => favoriteStations.includes(station.uniId))
        : filteredStations;
    const chargingStationsToShow = filteredChargingStations;

    const getMarkerImage = (pollDivCd, isChargingStation = false) => {
        const kakao = window.kakao;

        if (isChargingStation) {
            return new kakao.maps.MarkerImage(
                EvImage,
                new kakao.maps.Size(40, 40),
                { offset: new kakao.maps.Point(15, 30) }
            );
        }
        const logos = {
            GSC: GscImage,
            SKE: SkeImage,
            HDO: HdoImage,
            SOL: SolImage,
            RTX: RtxImage,
            NHO: NhoImage,
        };
        const imageSrc = logos[pollDivCd] || RtxImage;
        return new kakao.maps.MarkerImage(
            imageSrc,
            new kakao.maps.Size(35, 35),
            { offset: new kakao.maps.Point(15, 30) }
        );
    };

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const fetchFavoriteStations = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setFavoriteStations([]);
            return;
        }

        try {
            console.log("Fetching favorites from /api/favorite/juyuso");
            const response = await fetch("/api/favorite/juyuso", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Response status:", response.status);
            if (!response.ok) throw new Error("Failed to fetch favorites");
            const data = await response.json();
            if (data.status === "success") {
                setFavoriteStations(data.favorites || []);
            } else {
                console.error("Error in response:", data.message);
                setFavoriteStations([]);
            }
        } catch (error) {
            console.error("Error fetching favorite stations:", error);
            setFavoriteStations([]);
        }
    };

    useEffect(() => {
        fetchFavoriteStations();
    }, []);

    const handleReportSubmit = () => {
        if (!selectedBlackType) {
            Swal.fire({
                icon: "warning",
                title: "경고",
                text: "신고 유형을 선택해주세요.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            });
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "경고",
                text: "로그인이 필요합니다.",
                confirmButtonText: "확인",
                confirmButtonColor: "#f89400",
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.setItem("redirectUrl", window.location.pathname);
                    window.location.href = "/user/login";
                }
            });
            return;
        }

        fetch("/registerblack", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ uniId: reportUniId, blackType: selectedBlackType }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("신고 실패");
                return response.json();
            })
            .then((data) => {
                alert(data.message);
                setShowReportModal(false);
                setSelectedBlackType(null);
            })
            .catch((error) => {
                console.error("Error:", error);
                Swal.fire({
                    icon: "warning",
                    title: "경고",
                    text: "이미 신고된 주유소 입니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                });
            });
    };

    useEffect(() => {
        const fetchSidoList = async () => {
            try {
                const response = await fetch("/chargingStationList");
                if (!response.ok) throw new Error("Failed to fetch SIDO list");
                const data = await response.json();
                setSidoList(data);
                const initialRegions = data.reduce((acc, sido) => {
                    acc[sido] = false;
                    return acc;
                }, {});
                setRegions(initialRegions);
            } catch (error) {
                console.error("Error fetching SIDO list:", error);
            }
        };
        fetchSidoList();
    }, []);

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
                { offset: new kakao.maps.Point(20, 20) }
            );

            const userMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
                map: map,
                draggable: true,
                image: markerImage,
            });
            setMarker(userMarker);

            if (window.innerWidth <= 540) {
                mapContainer.current.style.height = "100%";
            }
        });
    }, []);

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
            }
            setSelectedStation(null);
            if (currentInfoWindow) {
                currentInfoWindow.close();
                setCurrentInfoWindow(null);
            }
            setRouteInfo({ distance: null, time: null });
            setLat(newLat);
            setLng(newLng);
        };

        const debounceHandleMarkerMove = debounce(handleMarkerMove, 100);

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
    }, [marker, routeLine]);

    const filterStations = (stationsData) => {
        console.log("Filtering stations, stations data:", stationsData);
        if (!stationsData || !stationsData.RESULT || !stationsData.RESULT.OIL || stationsData.RESULT.OIL.length === 0) return [];
        return stationsData.RESULT.OIL.filter((station) => {
            const brandMatches =
                (brands.cheap && (station.pollDivCd === "RTO" || station.pollDivCd === "RTX")) ||
                (brands.skEnergy && station.pollDivCd === "SKE") ||
                (brands.gsCaltex && station.pollDivCd === "GSC") ||
                (brands.hyundaiOilbank && station.pollDivCd === "HDO") ||
                (brands.sOil && station.pollDivCd === "SOL") ||
                (brands.nOil && station.pollDivCd === "NHO") ||
                (!brands.cheap && !brands.skEnergy && !brands.gsCaltex && !brands.hyundaiOilbank && !brands.sOil && !brands.nOil);

            const additionalMatches =
                (!additionalInfo.carWash || station.carWashYn === "Y") &&
                (!additionalInfo.maintenance || station.maintYn === "Y") &&
                (!additionalInfo.convenience || station.cvsYn === "Y") &&
                (!additionalInfo.self || station.selfYn === "Y" || (station.OS_NM && station.OS_NM.includes("셀프")));

            return brandMatches && additionalMatches;
        });
    };

    useEffect(() => {
        if (activeTab === "주유소" && stations && stations.RESULT && stations.RESULT.OIL && isDataLoaded) {
            const filtered = filterStations(stations);
            setFilteredStations(filtered);
            console.log("Filtered stations:", filtered);
        }
    }, [stations, brands, additionalInfo, activeTab, isDataLoaded]);

    useEffect(() => {
        if (activeTab !== "주유소" || !mapRef.current) {
            console.log("Not updating fuel markers: Wrong tab or map not ready");
            return;
        }
        setIsMarkerLoading(true);
        console.log("Filtered stations:", filteredStations);
        console.log("Favorite stations:", favoriteStations);
        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();

        fuelMarkers.forEach((marker) => {
            if (marker) {
                marker.setMap(null);
                if (marker.infoWindow) marker.infoWindow.close();
            }
        });
        setFuelMarkers([]);
        console.log("Fuel markers cleared");

        if (!filteredStations.length) {
            setIsMarkerLoading(false);
            console.log("No filtered stations to display, exiting.");
            return;
        }

        const stationsToShow = showFavoritesOnly
            ? filteredStations.filter((station) => favoriteStations.includes(station.uniId))
            : filteredStations;

        if (!stationsToShow.length) {
            setIsMarkerLoading(false);
            return;
        }

        console.log("Stations to show:", stationsToShow.length);

        const promises = stationsToShow.map((station) => {
            const address = station.NEW_ADR || station.newAdr || station.VAN_ADR || station.vanAdr;
            if (!address) return Promise.resolve(null);

            return new Promise((resolve) => {
                geocoder.addressSearch(address, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        if (getDistance(lat, lng, coords.getLat(), coords.getLng()) > 10000) {
                            resolve(null);
                            return;
                        }

                        const markerImage = getMarkerImage(station.pollDivCd);
                        const marker = new kakao.maps.Marker({
                            position: coords,
                            map: mapRef.current,
                            title: station.OS_NM || station.osNm,
                            image: markerImage,
                        });

                        const infoWindowContent = `
                            <div class="info-window">
                                <div class="info-window-title" onclick="console.log('Name clicked for uniId: ${station.uniId}'); window.showDetail('${station.uniId}', ${coords.getLat()}, ${coords.getLng()})">
                                    ${station.OS_NM || "이름 없음"} <span>(${station.pollDivCd || "이름 없음"})</span>
                                </div>
                                <div class="info-window-button-container">
                                    <button onclick="console.log('Name clicked for uniId: ${station.uniId}'); window.showDetail('${station.uniId}', ${coords.getLat()}, ${coords.getLng()})" class="info-window-button">
                                        상세정보
                                    </button>
                                    <button onclick="registerFavoriteStation('${station.uniId}')" class="info-window-button">
                                        즐겨찾기
                                    </button>
                                    <button onclick="registerBlack('${station.uniId}')" class="info-window-button2">
                                        신고
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
                                <div class="info-window-route-options">
                                    <label><input type="radio" name="routeOption" value="0" onchange="window.setSearchOption('0')" ${searchOption === "0" ? "checked" : ""}> 추천</label>
                                    <label><input type="radio" name="routeOption" value="1" onchange="window.setSearchOption('1')" ${searchOption === "1" ? "checked" : ""}> 최단</label>
                                    <label><input type="radio" name="routeOption" value="2" onchange="window.setSearchOption('2')" ${searchOption === "2" ? "checked" : ""}> 최적</label>
                                </div>
                                <button class="info-window-route-button" onclick="window.handleFindRoute(${coords.getLat()}, ${coords.getLng()})">
                                    경로찾기
                                </button>
                            </div>
                        `;

                        const infoWindow = new kakao.maps.InfoWindow({
                            content: infoWindowContent,
                        });

                        kakao.maps.event.addListener(marker, "click", () => {
                            if (!window.activeInfoWindows) window.activeInfoWindows = [];
                            window.activeInfoWindows.forEach((activeWindow) => activeWindow?.close());
                            window.activeInfoWindows = [];
                            if (currentInfoWindow) currentInfoWindow.close();

                            infoWindow.open(mapRef.current, marker);
                            setCurrentInfoWindow(infoWindow);
                            window.activeInfoWindows.push(infoWindow);
                            setSelectedStation({ lat: coords.getLat(), lng: coords.getLng() });
                        });

                        marker.infoWindow = infoWindow;
                        resolve(marker);
                    } else {
                        resolve(null);
                    }
                });
            });
        });

        Promise.all(promises).then((markers) => {
            const validMarkers = markers.filter((m) => m);
            console.log("Fuel markers updated:", validMarkers.length);
            setFuelMarkers(validMarkers);
            setIsMarkerLoading(false);
        });

        window.showDetail = (uniId, lat, lng) => {
            console.log("Showing detail for uniId:", uniId);
            const station = filteredStations.find((s) => s.uniId === uniId);
            if (!station) return;
            setSelectedDetailStation({ ...station, lat, lng });
            if (currentInfoWindow) {
                currentInfoWindow.close();
                setCurrentInfoWindow(null);
            }
        };

        window.registerFavoriteStation = async (uniId) => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                Swal.fire({
                    icon: "warning",
                    title: "경고",
                    text: "로그인이 필요합니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                }).then((result) => {
                    if (result.isConfirmed) {
                        sessionStorage.setItem("redirectUrl", window.location.pathname);
                        window.location.href = "/user/login";
                    }
                });
                return;
            }

            try {
                const response = await fetch("/api/favorite/juyuso", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ uniId: uniId }),
                });
                if (!response.ok) throw new Error("등록 실패");
                const data = await response.json();
                Swal.fire({
                    icon: "success",
                    title: "성공",
                    text: "즐겨찾기로 등록 되었습니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                });
                if (data.status === "success") {
                    setFavoriteStations((prev) => [...prev, uniId]);
                }
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    icon: "warning",
                    title: "경고",
                    text: "이미 등록된 주유소 입니다.",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                });
            }
        };

        window.registerBlack = function (uniId) {
            console.log("Opening report modal for uniId:", uniId);
            openReportModal(uniId);
        };

        return () => {
            console.log("Cleanup: Removing fuel markers");
            fuelMarkers.forEach((marker) => {
                if (marker && kakao.maps.event) {
                    kakao.maps.event.removeListener(marker, "click");
                }
                if (marker) marker.setMap(null);
            });
            if (window.activeInfoWindows?.length > 0) {
                window.activeInfoWindows.forEach((activeWindow) => activeWindow?.close());
            }
            if (currentInfoWindow) currentInfoWindow.close();
        };
    }, [filteredStations, lat, lng, activeTab, isDataLoaded, showFavoritesOnly, favoriteStations]);

    useEffect(() => {
        if (activeTab !== "충전소" || !mapRef.current || !originalChargingStations.length) return;

        setIsMarkerLoading(true);

        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();

        chargingMarkers.forEach((marker) => marker?.setMap(null));

        const filterStationsByDistance = async () => {
            const maxDistance = 5000;
            const limitedStations = originalChargingStations.slice(0, 200);

            const filteredPromises = limitedStations.map((station) => {
                const address = station.address;
                if (!address) return Promise.resolve(null);

                return new Promise((resolve) => {
                    geocoder.addressSearch(address, (result, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            const stationLat = result[0].y;
                            const stationLng = result[0].x;
                            const distance = getDistance(lat, lng, stationLat, stationLng);
                            if (distance <= maxDistance) {
                                return resolve({ station, lat: stationLat, lng: stationLng });
                            }
                        }
                        resolve(null);
                    });
                });
            });

            const filteredResults = await Promise.all(filteredPromises);
            const validStations = filteredResults.filter((result) => result !== null);

            const markers = validStations.map(({ station, lat: stationLat, lng: stationLng }) => {
                const coords = new kakao.maps.LatLng(stationLat, stationLng);
                const markerImage = getMarkerImage(null, true);
                const marker = new kakao.maps.Marker({
                    position: coords,
                    map: mapRef.current,
                    title: station.stationName,
                    image: markerImage,
                });

                const infoWindowContent = `
                    <div class="info-window">
                        <div class="info-window-title">${station.stationName}</div>
                        <div class="info-window-details">
                            <div><span>📍</span> ${station.address}</div>
                            <div><span>운영기관 : </span> ${station.operatorLarge || "정보 없음"}</div>
                            <div><span>시설 타입 : </span> ${station.facilityTypeSmall || "정보 없음"}</div>
                            <div><span>충전기 타입 : </span> ${station.chargerType || "정보 없음"}</div>
                            <div><span>세부 타입 : </span> ${station.modelSmall || "정보 없음"}</div>
                            <div><span>이용 가능 여부 : </span> ${station.userRestriction || "정보 없음"}</div>
                        </div>
                        <div class="info-window-route-options">
                            <label><input type="radio" name="routeOption" value="0" onchange="window.setSearchOption('0')" ${searchOption === "0" ? "checked" : ""}> 추천</label>
                            <label><input type="radio" name="routeOption" value="1" onchange="window.setSearchOption('1')" ${searchOption === "1" ? "checked" : ""}> 최단</label>
                            <label><input type="radio" name="routeOption" value="2" onchange="window.setSearchOption('2')" ${searchOption === "2" ? "checked" : ""}> 최적</label>
                        </div>
                        <button class="info-window-route-button" onclick="window.handleFindRoute(${coords.getLat()}, ${coords.getLng()})">
                            경로찾기
                        </button>
                    </div>
                `;

                const infoWindow = new kakao.maps.InfoWindow({
                    content: infoWindowContent,
                });

                kakao.maps.event.addListener(marker, "click", () => {
                    if (!window.activeInfoWindows) window.activeInfoWindows = [];
                    if (window.activeInfoWindows.length > 0) {
                        window.activeInfoWindows.forEach((activeWindow) => activeWindow?.close());
                        window.activeInfoWindows = [];
                    }
                    if (currentInfoWindow) currentInfoWindow.close();

                    infoWindow.open(mapRef.current, marker);
                    setCurrentInfoWindow(infoWindow);
                    window.activeInfoWindows.push(infoWindow);
                    setSelectedStation({ lat: coords.getLat(), lng: coords.getLng() });
                });

                marker.infoWindow = infoWindow;
                return marker;
            });

            const filteredStationsData = validStations.map((item) => item.station);
            setFilteredChargingStations(filteredStationsData);
            setChargingMarkers(markers);
            setIsMarkerLoading(false);
            console.log("Charging markers updated:", markers.length);
        };

        filterStationsByDistance();

        return () => {
            chargingMarkers.forEach((marker) => {
                if (marker && kakao.maps.event) {
                    kakao.maps.event.removeListener(marker, "click");
                }
            });
            if (window.activeInfoWindows?.length > 0) {
                window.activeInfoWindows.forEach((activeWindow) => activeWindow?.close());
            }
            if (currentInfoWindow) currentInfoWindow.close();
        };
    }, [originalChargingStations, activeTab, lat, lng]);

    useEffect(() => {
        if (activeTab === "충전소" && currentInfoWindow) {
            currentInfoWindow.close();
            setCurrentInfoWindow(null);
            if (window.activeInfoWindows?.length > 0) {
                window.activeInfoWindows.forEach((activeWindow) => activeWindow?.close());
                window.activeInfoWindows = [];
            }
        }
    }, [lat, lng, activeTab]);

    const handleFetchStations = async () => {
        setIsApiLoading(true);
        setIsDataLoaded(false);
        if (activeTab === "주유소") {
            try {
                await fetchFuelStations(lat, lng);
                setIsDataLoaded(true);
            } catch (error) {
                console.error("Error fetching fuel stations:", error);
                setFilteredStations([]);
                setIsDataLoaded(true);
            }
        } else {
            const selectedRegions = Object.keys(regions).filter((key) => regions[key]);
            if (selectedRegions.length === 0) {
                Swal.fire({
                    icon: "warning",
                    title: "경고",
                    text: "지역을 선택해 주세요",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#f89400",
                });
                setIsDataLoaded(true);
                setIsApiLoading(false);
                return;
            }
            try {
                const response = await fetch("/getChargingStation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ regions: selectedRegions }),
                });
                if (!response.ok) throw new Error("Failed to fetch charging stations");
                const data = await response.json();
                console.log("Fetched charging stations:", data);
                setOriginalChargingStations(data);
                setIsDataLoaded(true);
            } catch (error) {
                console.error("Error fetching charging stations:", error);
                setIsDataLoaded(true);
            }
        }
        setIsApiLoading(false);
    };

    window.showDetail = (uniId, lat, lng) => {
        console.log("Showing detail for uniId:", uniId);
        const station = filteredStations.find((s) => s.uniId === uniId);
        if (!station) return;
        setSelectedDetailStation({ ...station, lat, lng });
        if (currentInfoWindow) {
            currentInfoWindow.close();
            setCurrentInfoWindow(null);
        }
    };

    window.setSearchOption = (option) => {
        setSearchOption(option);
    };

    const handleCloseDetail = () => {
        setSelectedDetailStation(null);
    };

    const handleStationClick = (station) => {
        if (!mapRef.current) return;

        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();
        const address =
            activeTab === "주유소"
                ? station.NEW_ADR || station.newAdr || station.VAN_ADR || station.vanAdr
                : station.address;

        geocoder.addressSearch(address, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                mapRef.current.setCenter(coords);
                mapRef.current.setLevel(3);

                if (window.activeInfoWindows?.length > 0) {
                    window.activeInfoWindows.forEach((activeWindow) => activeWindow?.close());
                    window.activeInfoWindows = [];
                }

                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }

                const markers = activeTab === "주유소" ? fuelMarkers : chargingMarkers;
                const title = activeTab === "주유소" ? station.OS_NM || station.osNm : station.stationName;
                const selectedMarker = markers.find((marker) => marker.getTitle() === title);

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
        const url = "https://apis.openapi.sk.com/tmap/routes?version=1&format=json";

        const headers = {
            "Content-Type": "application/json",
            appKey: apiKey,
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
            searchOption: searchOption,
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
        if (window.activeInfoWindows?.length > 0) {
            window.activeInfoWindows.forEach((infoWindow) => infoWindow?.close());
            window.activeInfoWindows = [];
        }

        const routeData = await fetchRouteFromTmap(startLat, startLng, destLat, destLng);

        if (!routeData) {
            console.error("경로 데이터를 가져올 수 없습니다.");
            return;
        }

        const totalDistance = routeData[0]?.properties?.totalDistance || 0;
        const totalTime = routeData[0]?.properties?.totalTime || 0;

        const distanceInKm = (totalDistance / 1000).toFixed(2);
        const timeInMinutes = Math.ceil(totalTime / 60);

        setRouteInfo({
            distance: distanceInKm,
            time: timeInMinutes,
        });

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
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleBrandChange = (key) => {
        setIsMarkerLoading(true);
        setBrands((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAdditionalInfoChange = (key) => {
        setIsMarkerLoading(true);
        setAdditionalInfo((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleRegionChange = (key) => {
        setRegions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsDataLoaded(false);
        setFilteredStations([]);
        setOriginalChargingStations([]);
        setFilteredChargingStations([]);
        setChargingStations([]);

        console.log("Removing fuel markers:", fuelMarkers.length);
        fuelMarkers.forEach((marker) => {
            if (marker && marker.setMap) {
                marker.setMap(null);
            }
        });
        setFuelMarkers([]);

        console.log("Removing charging markers:", chargingMarkers.length);
        chargingMarkers.forEach((marker) => {
            if (marker && marker.setMap) {
                marker.setMap(null);
            }
        });
        setChargingMarkers([]);

        setBrands({
            cheap: false,
            skEnergy: false,
            gsCaltex: false,
            hyundaiOilbank: false,
            sOil: false,
            nOil: false,
        });
        setAdditionalInfo({ carWash: false, maintenance: false, convenience: false, self: false });
        setRegions(
            (prev) =>
                Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {})
        );
    };

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    return (
        <div className="map-container">
            <div ref={mapContainer} className="map">
                {routeInfo.distance && routeInfo.time && (
                    <div className="route-info">
                        <span>거리: {routeInfo.distance} km | </span>
                        <span>소요 시간: {routeInfo.time} 분</span>
                    </div>
                )}
                {(isMarkerLoading || isApiLoading) && (
                    <div className="loading-overlay">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <div className="loading-text">로딩 중...</div>
                        </div>
                    </div>
                )}
            </div>
            {selectedDetailStation && <FuelStationDetail station={selectedDetailStation} onClose={handleCloseDetail} />}
            <div className={`map-sidebar ${isSidebarVisible ? "" : "hidden"}`}>
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
                    {activeTab === "주유소" && (
                        <button
                            className={`favorite-toggle-btn ${showFavoritesOnly ? "active" : ""}`}
                            onClick={() => setShowFavoritesOnly((prev) => !prev)}
                            disabled={!localStorage.getItem("accessToken")}
                        >
                            ★
                        </button>
                    )}
                </div>

                {activeTab === "주유소" ? (
                    <>
                        <div className="map-section">
                            <div className="map-section-title">주유소 브랜드</div>
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
                                            disabled={isMarkerLoading}
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
                                            disabled={isMarkerLoading}
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="map-section">
                        <div className="map-section-title">지역</div>
                        <div className="map-options">
                            {sidoList.map((sido) => (
                                <label key={sido} className="map-option-label">
                                    <input
                                        type="checkbox"
                                        checked={regions[sido]}
                                        onChange={() => handleRegionChange(sido)}
                                    />
                                    <span>{sido}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="map-button-container">
                    <button onClick={handleFetchStations} className="map-search-button">
                        조회
                    </button>
                </div>

                <div className="map-station-list">
                    <FuelStationList
                        stations={activeTab === "주유소" ? stationsToShow : chargingStationsToShow}
                        loading={loading || !isDataLoaded}
                        onStationClick={handleStationClick}
                        isChargingStation={activeTab === "충전소"}
                    />
                </div>
            </div>
            <button
                className={`map-sidebar-toggle ${isSidebarVisible ? "open" : "closed"}`}
                onClick={toggleSidebar}
            >
                {isSidebarVisible ? "<" : ">"}
            </button>
            {showReportModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>불법 주유소 신고</h3>
                        <div className="report-options">
                            <label>
                                <input
                                    type="radio"
                                    name="blackType"
                                    value="1"
                                    checked
                                    onChange={(e) => setSelectedBlackType(parseInt(e.target.value))}
                                />
                                용도 외 판매
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="blackType"
                                    value="2"
                                    onChange={(e) => setSelectedBlackType(parseInt(e.target.value))}
                                />
                                품질 기준 부적합
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="blackType"
                                    value="3"
                                    onChange={(e) => setSelectedBlackType(parseInt(e.target.value))}
                                />
                                가짜 석유 취급
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="blackType"
                                    value="4"
                                    onChange={(e) => setSelectedBlackType(parseInt(e.target.value))}
                                />
                                정량 미달 판매
                            </label>
                        </div>
                        <div className="modal-report-buttons">
                            <button onClick={handleReportSubmit}>신고 제출</button>
                            <button onClick={() => setShowReportModal(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Map;