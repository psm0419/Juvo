// AvgByRegion.js
import React from 'react';

function AvgByRegion({avgList}) {

    return (
        <div>
            {avgList.length > 0 ? (
									avgList.map((item, index) => (
										<div key={index} className="avgItem">
											<h4>{item.sidonm}</h4>
											<p>{item.price}원</p>
										</div>
									))
								) : (
									<p>데이터를 불러오는 중...</p>
								)}
        </div>
    )
}

export default AvgByRegion;
