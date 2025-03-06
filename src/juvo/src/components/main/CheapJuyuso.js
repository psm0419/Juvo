// CheapJuyuso.js
import React from 'react';

function CheapJuyuso({cheapJuyusoList}) {

    return (
        <div>
            {cheapJuyusoList.length > 0 ? (
                <ul>
                    {cheapJuyusoList.map((juyuso, index) => (
                        <li key={index}>
                            <p><strong>{juyuso.osNm}</strong> {juyuso.price}원</p>
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
