import React, { useEffect, useRef, useState } from "react";
import FuelStationList from "../../components/map/FuelStationList";

const Map = ({ fetchFuelStations, stations, loading }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [lat, setLat] = useState(36.807317819607775);
    const [lng, setLng] = useState(127.14715449120254);
    const [marker, setMarker] = useState(null);
    const [fuelMarkers, setFuelMarkers] = useState([]);

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
                                content: `<div style="padding:5px;">${station.OS_NM || station.osNm}<br>가격: ${station.PRICE || station.hOilPrice || "정보 없음"}</div>`,
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

    return (
        <div style={{ position: "relative" }}>
            <div ref={mapContainer} style={{ width: "100%", height: "700px", marginBottom: "20px" }}></div>
            <div style={{
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
            }}>
                <button onClick={handleFetchStations} style={{ marginTop: "10px" }}>조회</button>
                <FuelStationList stations={stations} loading={loading} />
            </div>
        </div>
    );
};

export default Map;