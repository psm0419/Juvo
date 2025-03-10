import '../../assets/css/main/Main.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import CheapJuyuso from "../../components/main/CheapJuyuso";
import AvgByRegion from '../../components/main/AvgByRegion';
import AvgPriceChart from '../../components/main/AvgPriceChart';
import Membership from '../../assets/image/Membership.jpg';
import mainbackground from '../../assets/image/mainbackground.mp4';


function Main() {

	//저렴한 주유소, 시도별평균
	const [cheapJuyusoList, setCheapJuyusoList] = useState([]);
	const [avgList, setAvgList] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState("휘발유");
	const [selectedArea, setSelectedArea] = useState("");

	//오늘의 유가
	const [todayPrices, setTodayPrices] = useState({
		"휘발유": 0,
		"경유": 0,
		"고급휘발유": 0,
		"실내등유": 0
	});


	//제품코드
	const productCodes = {
		"휘발유": "B027",
		"경유": "D047",
		"고급휘발유": "B034",
		"실내등유": "C004"
	};

	//지역코드
	const areaCodes = {
		"서울": "01",
		"경기": "02",
		"강원": "03",
		"충북": "04",
		"충남": "05",
		"전북": "06",
		"전남": "07",
		"경북": "08",
		"경남": "09",
		"부산": "10",
		"제주": "11",
		"대구": "14",
		"인천": "15",
		"광주": "16",
		"대전": "17",
		"울산": "18",
		"세종": "19"
	};

	// 제품 선택 시 상태 업데이트
	const handleProductChange = (event) => {
		setSelectedProduct(event.target.value);
	};

	// 지역 선택 시 상태 업데이트
	const handleAreaChange = (event) => {
		setSelectedArea(event.target.value);
	};

	//전국평균값
	useEffect(() => {
		const fetchNationwidePrices = async () => {
			const productKeys = Object.keys(productCodes); // ["휘발유", "경유", "고급휘발유", "실내등유"]
			const prices = { "휘발유": 0, "경유": 0, "고급휘발유": 0, "실내등유": 0 };

			try {
				for (const product of productKeys) {
					const prodcd = productCodes[product];
					const response = await axios.get(`/api/avgByRegion?prodcd=${prodcd}`);
					const nationwideData = response.data.find(item => item.sidocd === "00");
					if (nationwideData) {
						prices[product] = nationwideData.price || 0;
					}
				}
				setTodayPrices(prices);
			} catch (error) {
				console.error('전국 평균 유가 가져오기 실패:', error);
			}
		};

		fetchNationwidePrices();
	}, []); // 한 번만 실행되도록 빈 배열 사용

	//저렴한 주유소
	useEffect(() => {
		const areaCode = selectedArea ? areaCodes[selectedArea] : "";
		const prodcd = productCodes[selectedProduct] || "B027";

		axios.get(`/api/cheapJuyuso?prodcd=${prodcd}&area=${areaCode}`)
			.then(response => {
				if (Array.isArray(response.data)) {
					setCheapJuyusoList(response.data);
				} else {
					console.error('응답 데이터는 배열이 아닙니다.');
				}
			})
			.catch(error => {
				console.error('API 호출 중 오류 발생:', error);
			});
	}, [selectedProduct, selectedArea]);

	//시도별 평균
	useEffect(() => {
		const prodcd = productCodes[selectedProduct] || "B027";

		axios.get(`/api/avgByRegion?prodcd=${prodcd}`)
			.then(response => {
				if (Array.isArray(response.data)) {
					setAvgList(response.data);
				} else {
					console.error('응답 데이터가 배열이 아닙니다.');
				}
			})
			.catch(error => {
				console.error('API 호출 중 오류 발생:', error);
			});
	}, [selectedProduct]);


	return (
		<>
			<div className='containerM'>
				<div className='mainTop'>
					<div className="textOverlay">
						<p style={{ fontSize: "2.3rem", fontWeight: "bold" }}> JUVO </p>
						<p style={{ fontSize: "1.6rem", fontWeight: "500" }}> 최저가 주유, 최적 경로를 JUVO와 함께! </p>
						<p style={{ fontSize: "0.9rem", fontWeight: "400" }}> 지금 시작하고 연료비를 절약하세요.</p>
					</div>
					{/* <img src ="https://www.opinet.co.kr/images/user/main/main_visual2.jpg"></img> */}
					<video autoPlay muted loop className="bg-video">
						<source src={mainbackground} type="video/mp4" />
					</video>
				</div>
				<div className='mainMiddle'>
					<div className="middleContainer">
						<div className="lmiddle middle">
							<div className="lmiddlet">
								<div className="todaySelect">
									<p className="point_text2">오늘의 유가 <span>(전국평균)</span> </p>
								</div>
								<div className="todayContrainer">
									<div className="box">
										<h4>휘발유</h4>
										<p>{todayPrices["휘발유"]}</p>
									</div>
									<div className="box">
										<h4>경유</h4>
										<p>{todayPrices["경유"]}</p>
									</div>
									<div className="box">
										<h4>고급휘발유</h4>
										<p>{todayPrices["고급휘발유"]}</p>
									</div>
									<div className="box noBorder">
										<h4>등유</h4>
										<p>{todayPrices["실내등유"]}</p>
									</div>
								</div>
							</div>
							<div className="lmiddleb">
								<div className="cheapSelect">
									<p className="point_text">저렴한 주유소 Top 5</p>
									<select className="region" onChange={handleAreaChange} value={selectedArea}>
										<option value="">지역 선택</option>
										<option value="서울">서울</option>
										<option value="경기">경기</option>
										<option value="강원">강원</option>
										<option value="충북">충북</option>
										<option value="충남">충남</option>
										<option value="전북">전북</option>
										<option value="전남">전남</option>
										<option value="경북">경북</option>
										<option value="경남">경남</option>
										<option value="부산">부산</option>
										<option value="제주">제주</option>
										<option value="대구">대구</option>
										<option value="인천">인천</option>
										<option value="광주">광주</option>
										<option value="대전">대전</option>
										<option value="울산">울산</option>
										<option value="세종">세종</option>
									</select>
									<select className="region" onChange={handleProductChange} value={selectedProduct}>
										<option value="휘발유">휘발유</option>
										<option value="경유">경유</option>
										<option value="고급휘발유">고급휘발유</option>
										<option value="실내등유">실내등유</option>
									</select>
								</div>
								<div className="cheapList">
									<CheapJuyuso cheapJuyusoList={cheapJuyusoList} />
								</div>
							</div>
						</div>
						<div className="mmiddle middle">
							<p className="point_text">유가추이</p>
							<div className='chart'>
								<AvgPriceChart selectedProduct={selectedProduct} selectedArea={selectedArea} />
							</div>
						</div>
						<div className="rmiddle middle noBorder">
							<p className="point_text">시도별 평균</p>
							<div className="avgList">
								<AvgByRegion avgList={avgList} />
							</div>
						</div>
					</div>
				</div>
				<div className='mainBottom'>
					<div className="lbottom bottom">
						<p className="point_text">공지사항</p>
						<div className="notice">

						</div>
					</div>
					<div className="rbottom bottom cursor">
						<div className="membership">
							<img src={Membership}></img>

						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Main;