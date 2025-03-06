import '../../assets/css/main/Main.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import CheapJuyuso from "../../components/main/CheapJuyuso";

function Main() {	

	const [cheapJuyusoList, setCheapJuyusoList] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState("휘발유");
	const [selectedArea, setSelectedArea] = useState("");

	const productCodes = {
		"휘발유": "B027",
		"경유": "D047",
		"고급휘발유": "B034",
		"실내등유": "C004"
	};

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

	const handleProductChange = (event) => {
		setSelectedProduct(event.target.value); // 제품 선택 시 상태 업데이트
	};

	const handleAreaChange = (event) => {
        setSelectedArea(event.target.value); // 지역 선택 시 상태 업데이트
    };
    
    useEffect(() => {
		axios.get('/api/cheapJuyuso')
			.then(response => {
				console.log(response.data);
				// 배열인지 확인하고 배열로 변환
				if (Array.isArray(response.data)) {
					setCheapJuyusoList(response.data);
				} else {
					console.error('응답 데이터는 배열이 아닙니다.');
				}
			})
			.catch(error => {
				console.error('API 호출 중 오류 발생:', error);
			});
	}, []);

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
	

	return (
		<>
			<div className='containerM'>
				<div className='mainTop'>
					<div className="textOverlay">
						<p style={{ fontSize: "2.3rem", fontWeight: "bold" }}> 기름값 아끼는 지름길 </p>
						<p style={{ fontSize: "1.6rem", fontWeight: "500" }}> 휴먼교육센터 JUVO 에 있습니다. </p>
						<p style={{ fontSize: "0.9rem", fontWeight: "400" }}> 국내유가 안정과 국민 경제 체험에 앞장서겠습니다. </p>
					</div>
					<img src ="https://www.opinet.co.kr/images/user/main/main_visual2.jpg"></img>
                </div>
                <div className='mainMiddle'>
					<div className="middleContainer">
						<div className="lmiddle middle">
							<div className="lmiddlet">
								<div className="todaySelect">
									<p className="point_text2">오늘의 유가 <span>(평균)</span> </p>
									<select className="region" onChange={handleProductChange} value={selectedProduct}>
										<option value="휘발유">휘발유</option>
										<option value="경유">경유</option>
										<option value="고급휘발유">고급휘발유</option>
										<option value="실내등유">실내등유</option>
									</select>
								</div>
								<div className="todayContrainer">
									<div className="box">
										<h4>휘발유</h4>
										<p>12.34</p>
									</div>
									<div className="box">
										<h4>경유</h4>
										<p>56.78</p>
									</div>
									<div className="box">
										<h4>고급휘발유</h4>
										<p>99.10</p>
									</div>
									<div className="box noBorder">
										<h4>등유</h4>
										<p>11.12</p>
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
								</div>
								<div className="cheapList">
									<CheapJuyuso cheapJuyusoList={cheapJuyusoList} />
								</div>
							</div>
						</div>
						<div className="mmiddle middle">
							<p className="point_text">시도별 평균</p>
							<div>

							</div>
						</div>
						<div className="rmiddle middle noBorder">
							<p className="point_text">유가추이</p>
							<div>
								
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
						<p className="point_text">멤버십 유도 베너</p>
						<div className="membership">

						</div>
					</div>
                </div>
            </div>
		</>
	);
}

export default Main;