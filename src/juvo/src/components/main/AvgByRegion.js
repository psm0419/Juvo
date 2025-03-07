// AvgByRegion.js
import React from 'react';

function AvgByRegion({ avgList }) {
	const areaCodes = {
	"서울": { code: "01", top: "10%", left: "25%" },   
    "경기": { code: "02", top: "20%", left: "5%" },
    "강원": { code: "03", top: "5%", left: "70%" },
    "충북": { code: "04", top: "25%", left: "60%" },
    "충남": { code: "05", top: "50%", left: "10%" },
    "전북": { code: "06", top: "60%", left: "20%" },
    "전남": { code: "07", top: "85%", left: "10%" },
    "경북": { code: "08", top: "35%", left: "80%" },
    "경남": { code: "09", top: "70%", left: "65%" },
    "부산": { code: "10", top: "80%", left: "85%" },
    "제주": { code: "11", top: "95%", left: "15%" },
    "대구": { code: "14", top: "50%", left: "75%" },
    "인천": { code: "15", top: "5%", left: "15%" },   
    "광주": { code: "16", top: "75%", left: "20%" },
    "대전": { code: "17", top: "45%", left: "40%" },
    "울산": { code: "18", top: "65%", left: "90%" },
    "세종": { code: "19", top: "35%", left: "30%" },
	};

	return (
		<div className="avg-by-region">
			<img
				src="https://www.opinet.co.kr/images/user/main/main_map.png"
				alt="Korea Map"
				className="map-image"
			/>
			{avgList.length > 0 ? (
				avgList
					.filter(item => areaCodes[item.sidonm])
					.map((item, index) => (
						<div
							key={index}
							className="avg-item item"
							style={{
								top: areaCodes[item.sidonm]?.top,
								left: areaCodes[item.sidonm]?.left,
							}}
						>
							<p>{item.sidonm} : {item.price}원</p>
						</div>
					))
			) : (
				<div className="loading">데이터를 불러오는 중...</div>
			)}
		</div>
	);
}

export default AvgByRegion;