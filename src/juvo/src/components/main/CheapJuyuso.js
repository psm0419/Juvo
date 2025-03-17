// CheapJuyuso.js
import React from 'react';

function CheapJuyuso({cheapJuyusoList}) {

    return (
        <div>
            {cheapJuyusoList.length > 0 ? (
                <ul>
                    {cheapJuyusoList.map((juyuso, index) => (
                        
                        <li key={index}>
                            <p className="juyuso-item">
                                <span className="juyuso-name"><strong>{juyuso.osNm}</strong></span>
                                <span className="juyuso-price">{juyuso.price.toLocaleString('ko-KR')}원</span>
                            </p>
                        </li>
                        
                    ))}
                </ul>
            ) : (
                <p>주유소 정보를 불러오는 중...</p>
            )}
        </div>
    )
}

export default CheapJuyuso;
