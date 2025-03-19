import React from 'react';

function AvgByRegion({ avgList }) {
	const areaCodes = {
		"서울": { code: "01", top: "18%", left: "35%" },   
		"경기": { code: "02", top: "25%", left: "10%" },
		"강원": { code: "03", top: "10%", left: "65%" },
		"충북": { code: "04", top: "30%", left: "55%" },
		"충남": { code: "05", top: "50%", left: "10%" },
		"전북": { code: "06", top: "60%", left: "25%" },
		"전남": { code: "07", top: "80%", left: "5%" },
		"경북": { code: "08", top: "40%", left: "75%" },
		"경남": { code: "09", top: "70%", left: "60%" },
		"부산": { code: "10", top: "75%", left: "85%" },
		"제주": { code: "11", top: "90%", left: "25%" },
		"대구": { code: "14", top: "50%", left: "70%" },
		"인천": { code: "15", top: "8%", left: "15%" },   
		"광주": { code: "16", top: "75%", left: "30%" },
		"대전": { code: "17", top: "45%", left: "40%" },
		"울산": { code: "18", top: "65%", left: "85%" },
		"세종": { code: "19", top: "35%", left: "20%" },
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
							className="avg-item"
							style={{
								top: areaCodes[item.sidonm]?.top,
								left: areaCodes[item.sidonm]?.left,
							}}
						>
							<p>{item.sidonm} 
								<br/> <span>{item.price}원</span></p>
						</div>
					))
			) : (
				<div className="loading">데이터를 불러오는 중...</div>
			)}
		</div>
	);
}

export default AvgByRegion;