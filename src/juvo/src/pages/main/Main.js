import '../../assets/css/main/Main.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import CheapJuyuso from "../../components/main/CheapJuyuso";
import AvgByRegion from '../../components/main/AvgByRegion';
import AvgPriceChart from '../../components/main/AvgPriceChart';
import Sale from '../../assets/image/Sale.png';
import Membership from '../../assets/image/Membership.jpg';
import mainbackground from '../../assets/image/mainbackground.mp4';
import { Link } from 'react-router-dom';

function Main() {
	//저렴한 주유소, 시도별평균
	const [cheapJuyusoList, setCheapJuyusoList] = useState([]);
	const [avgList, setAvgList] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState("휘발유");
	const [selectedArea, setSelectedArea] = useState("");
	const [todayPrices, setTodayPrices] = useState({
		//오늘의 유가
		"휘발유": 0,
		"경유": 0,
		"고급휘발유": 0,
		"실내등유": 0
	});

	// 공지사항 상태 추가
	const [notices, setNotices] = useState([]);

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
			const productKeys = Object.keys(productCodes);
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
	}, []); //한 번만 실행되도록 빈 배열 사용 

	// 저렴한 주유소 데이터 가져오기
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

	// 공지사항 데이터 가져오기
	useEffect(() => {
		const fetchNotices = async () => {
			try {
				const response = await axios.get('http://localhost:3000/notice/list');
				setNotices(response.data);
			} catch (error) {
				console.error('공지사항을 불러오는 중 오류 발생:', error);
			}
		};
		fetchNotices();
	}, []);

	return (
		<>
			<div className='containerM'>
				<div className='mainTop'>
					<div className="textOverlay">
						<p style={{ fontSize: "2.3rem", fontWeight: "bold" }}> J U V O </p>
						<p style={{ fontSize: "1.6rem", fontWeight: "500" }}> 최저가 주유, 최적 경로를 JUVO와 함께! </p>
						<p style={{ fontSize: "0.9rem", fontWeight: "400" }}> 지금 시작하고 연료비를 절약하세요.</p>
					</div>
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
										<h5>휘발유</h5>
										<p>{todayPrices["휘발유"].toLocaleString('ko-KR')}원</p>
									</div>
									<div className="box">
										<h5>경유</h5>
										<p>{todayPrices["경유"].toLocaleString('ko-KR')}원</p>
									</div>
									<div className="box">
										<h5>고급휘발유</h5>
										<p>{todayPrices["고급휘발유"].toLocaleString('ko-KR')}원</p>
									</div>
									<div className="box noBorder">
										<h5>등유</h5>
										<p>{todayPrices["실내등유"].toLocaleString('ko-KR')}원</p>
									</div>
								</div>
							</div>
							<div className="lmiddleb">
								<div className="cheapSelect">
									<p className="point_text">저렴한 주유소 Top 5</p>
									<select className="region" onChange={handleAreaChange} value={selectedArea}>
                                    <option value="">지역 선택</option>
                                    {Object.keys(areaCodes).map(area => <option key={area} value={area}>{area}</option>)}
                                </select>
                                <select className="region" onChange={handleProductChange} value={selectedProduct}>
                                    {Object.keys(productCodes).map(product => <option key={product} value={product}>{product}</option>)}
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
								<AvgPriceChart selectedProduct={selectedProduct} selectedArea={selectedArea} productCodes={productCodes} areaCodes={areaCodes} />
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
						<div className='mainotice_title'>
							<p className="point_text">공지사항</p>
							<Link to={`/detail/guideDetail/Notice`} className="more"> 더보기 </Link>
						</div>
						<div className="mainotice">
							{notices.length > 0 ? (
								notices
									.slice(0, 3) // 최근 3개의 공지사항만 표시
									.map((notice) => (
										<Link
											to={`/detail/guideDetail/Notice/detail/${notice.noticeId}`}
											key={notice.noticeId}
											className="notice_box"
										>
											<div className="notice_text">
												{notice.title}
											</div>
										</Link>
									))
							) : (
								<p>현재 공지사항이 없습니다.</p>
							)}
						</div>
					</div>
					<div className="mbottom bottom">
						<div className="sale">
							<img src={Sale} alt="Sale" />
						</div>
					</div>
					<div className="rbottom bottom cursor">
						<div className="membership">
							<Link to="/detail/guideDetail/Membership">
								<img src={Membership} alt="Membership" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Main;