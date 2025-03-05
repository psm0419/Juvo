import '../../assets/css/main/Main.css';

function Main() {
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
									<select className="region">
											<option value="option1">휘발유</option>
											<option value="option2">경유</option>
											<option value="option3">전기차</option>
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
									<div className="box noBorder">
										<h4>전기차</h4>
										<p>91.01</p>
									</div>
								</div>
							</div>
							<div className="lmiddleb">
								<div className="cheapSelect">
									<p className="point_text">저렴한 주유소 Top 5</p>
									<select className="region">
										<option value="option1">천안</option>
										<option value="option2">서울</option>
										<option value="option3">경기</option>
									</select>
								</div>
								<div className="chedapList">

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