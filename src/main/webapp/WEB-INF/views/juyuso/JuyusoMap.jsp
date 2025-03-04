<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>주유소 찾기</title>
<script type="text/javascript"
	src="//dapi.kakao.com/v2/maps/sdk.js?appkey=07d2faa0d2999cbe5c196e0b7f2d35bf&libraries=services"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.7.2/proj4.js"></script>
<style>
/* 플라이박스 스타일 */
#fly-box {
	position: absolute;
	top: 50px;
	left: 10px;
	background: #fff;
	border: 1px solid #ccc;
	padding: 15px;
	width: 250px;
	z-index: 1000;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#fly-box input, #fly-box button {
	width: 100%;
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

#fly-box button {
	background-color: #4CAF50;
	color: white;
	cursor: pointer;
}

#fly-box button:hover {
	background-color: #45a049;
}
/* 주유소 목록 스타일 */
#station-list {
	margin-top: 10px;
	max-height: 300px;
	overflow-y: auto;
}

.station-item {
	padding: 8px;
	border-bottom: 1px solid #eee;
	cursor: pointer;
}

.station-item:hover {
	background-color: #f5f5f5;
}
/* 로딩 표시 */
#loading {
	display: none;
	margin: 10px 0;
	text-align: center;
	color: #666;
}
/* 마커 정보창 스타일 */
.info-window {
	padding: 5px;
	font-size: 12px;
	max-width: 200px;
}

.info-window h4 {
	margin: 5px 0;
}

.info-window p {
	margin: 3px 0;
}
</style>
</head>
<body>
	<h1 style="text-align: center;">주변 주유소 찾기</h1>

	<!-- 디버그 정보 표시 영역 -->
	<div id="debug-info"
		style="position: fixed; bottom: 10px; right: 10px; background: rgba(0, 0, 0, 0.7); color: white; padding: 10px; border-radius: 5px; max-width: 300px; z-index: 9999;"></div>

	<!-- 플라이박스 -->
	<div id="fly-box">
		<h3>주유소 조회</h3>
		<button id="fetch-fuel-stations">조회</button>
		<div id="loading">데이터를 불러오는 중...</div>
		<div id="station-list"></div>
	</div>

	<!-- 지도 -->
	<div id="map" style="width: 100%; height: 500px;"></div>

	<script>
		// 디버그 함수
		function debug(message) {
			console.log(message);
			var debugInfo = document.getElementById('debug-info');
			debugInfo.innerHTML += message + '<br>';
			// 5초 후 메시지 삭제
			setTimeout(function() {
				var messages = debugInfo.innerHTML.split('<br>');
				if (messages.length > 1) {
					messages.shift();
					debugInfo.innerHTML = messages.join('<br>');
				} else {
					debugInfo.innerHTML = '';
				}
			}, 5000);
		}

		var mapContainer = document.getElementById('map');
		var mapOption = {
			center : new kakao.maps.LatLng(37.5665, 126.9780), // 서울
			level : 5
		};

		var map = new kakao.maps.Map(mapContainer, mapOption);
		debug("지도 초기화 완료");

		var marker = new kakao.maps.Marker({
			position : map.getCenter(),
			map : map,
			draggable : true
		// 마커 드래그 가능하게 설정
		});
		debug("마커 생성 완료");

		// 주유소 마커를 저장할 배열
		var stationMarkers = [];

		// 정보창 객체 생성
		var infowindow = new kakao.maps.InfoWindow({
			zIndex : 1
		});

		// 마커 드래그 종료 시 좌표 가져오기
		kakao.maps.event.addListener(marker, 'dragend', function() {
			var position = marker.getPosition();
			var lat = position.getLat();
			var lng = position.getLng();
			debug("마커 드래그 종료: " + lat.toFixed(6) + ", " + lng.toFixed(6));
		});

		// 지도 클릭 시 마커 이동
		kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
			var latlng = mouseEvent.latLng;
			marker.setPosition(latlng);
			debug("마커 이동: " + latlng.getLat().toFixed(6) + ", "
					+ latlng.getLng().toFixed(6));
		});

		// "조회" 버튼 클릭 시 주유소 정보 가져오기
		$(document).ready(
				function() {
					$('#fetch-fuel-stations').click(
							function() {
								try {
									// 마커 위치 가져오기
									var position = marker.getPosition();
									var lat = position.getLat();
									var lng = position.getLng();
									debug("조회 버튼 클릭! 마커 위치: " + lat.toFixed(6)
											+ ", " + lng.toFixed(6));

									// 주유소 데이터 요청
									fetchJuyusoData(lat, lng);
								} catch (error) {
									debug("조회 버튼 클릭 오류: " + error.message);
								}
							});
				});

		// 주유소 정보 가져오기
		function fetchJuyusoData(lat, lng) {
			

			// 로딩 표시 보이기
			$('#loading').show();
			$('#station-list').empty();

			debug("API 요청 시작: " + lat.toFixed(6) + ", " + lng.toFixed(6));

			$.ajax({
				url : '/getJuyuso', // 실제 API 엔드포인트
				type : 'GET',
				data : {
					lat : lat,
					lng : lng
				},
				success : function(response) {
					debug("API 응답 수신: "
							+ (response ? response.substring(0, 50) + "..."
									: "빈 응답"));

					// 로딩 표시 숨기기
					$('#loading').hide();

					// JSON 문자열을 객체로 파싱
					try {
						var data = JSON.parse(response);
						debug("JSON 파싱 성공, 데이터: " + (data ? "있음" : "없음"));

						// 주유소 데이터 출력 및 마커 표시
						if (data && data.RESULT && data.RESULT.OIL) {
							debug("주유소 데이터 개수: " + data.RESULT.OIL.length);
							displayJuyusoMarkers(data.RESULT.OIL);
						} else {
							debug("주유소 데이터 없음");
							$('#station-list').html('<div>검색 결과가 없습니다.</div>');
						}
					} catch (e) {
						debug("JSON 파싱 오류: " + e.message);
						$('#station-list').html(
								'<div>데이터 처리 중 오류가 발생했습니다.</div>');
					}
				},
				error : function(xhr, status, error) {
					debug("API 요청 실패: " + status + " - " + error);
					$('#loading').hide();
					$('#station-list').html(
							'<div>데이터를 가져오는 중 오류가 발생했습니다.</div>');
				}
			});
		}

		// 주유소 마커 표시 함수
		function displayJuyusoMarkers(stations) {
			$('#station-list').empty();
			if (!stations || stations.length === 0) {
				$('#station-list').html('<div>주변에 주유소가 없습니다.</div>');
				return;
			}

			var markerImage = new kakao.maps.MarkerImage(
					'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
					new kakao.maps.Size(24, 35));

			stations
					.forEach(function(station, index) {
						var name = station.OS_NM || '이름 없음';
						var price = station.PRICE ? station.PRICE + '원'
								: '가격 정보 없음';
						var distance = station.DISTANCE ? station.DISTANCE
								+ 'm' : '거리 정보 없음';
						var brand = getBrandName(station.POLL_DIV_CD);

						var katecX = parseFloat(station.GIS_X_COOR);
						var katecY = parseFloat(station.GIS_Y_COOR);
						var wgs84Coords = convertKATECtoWGS84(katecX, katecY);
						var lat = wgs84Coords[1];
						var lng = wgs84Coords[0];

						var coords = new kakao.maps.LatLng(lat, lng);
						var stationMarker = new kakao.maps.Marker({
							position : coords,
							map : map,
							title : name,
							image : markerImage
						});
						stationMarkers.push(stationMarker);

						var content = '<div class="info-window">' + '<h4>'
								+ name + '</h4>' + '<p><strong>브랜드:</strong> '
								+ brand + '</p>' + '<p><strong>가격:</strong> '
								+ price + '</p>' + '<p><strong>거리:</strong> '
								+ distance + '</p>' + '</div>';

						kakao.maps.event.addListener(stationMarker, 'click',
								function() {
									infowindow.setContent(content);
									infowindow.open(map, stationMarker);
								});

						var stationItem = '<div class="station-item" data-index="' + index + '">'
								+ '<strong>'
								+ name
								+ '</strong><br>'
								+ '브랜드: '
								+ brand
								+ '<br>'
								+ '가격: '
								+ price
								+ '<br>'
								+ '거리: ' + distance + '</div>';
						$('#station-list').append(stationItem);
					});
		}

		function getBrandName(code) {
			var brands = {
				'SKE' : 'SK에너지',
				'GSC' : 'GS칼텍스',
				'HDO' : '현대오일뱅크',
				'SOL' : 'S-OIL',
				'RTE' : '자영알뜰',
				'RTX' : '고속도로알뜰',
				'NHO' : '농협알뜰',
				'ETC' : '자가상표',
				'E1G' : 'E1',
				'SKG' : 'SK가스'
			};
			return brands[code] || '알 수 없음';
		}

		// KATEC -> WGS84 변환 함수 (수정된 버전)
		function convertKATECtoWGS84(katecX, katecY) {
			// Opinet API에서 받은 KATEC 좌표를 WGS84로 변환
			// 앞서 Java에서 사용한 변환의 역변환

			// 조정 계수 적용 (Java의 변환과 일치하도록 조정)
			katecX = katecX / 100 + 4571;
			katecY = katecY / 100 + 1352;

			// WGS84 좌표로 변환
			var lng = katecX / 36;
			var lat = katecY / 36;

			return [ lng, lat ];
		}
	</script>
</body>
</html>