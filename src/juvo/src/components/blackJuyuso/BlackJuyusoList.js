import React from 'react';

function BlackJuyusoList({ data, BLACK_TYPE_MAP, INDUSTRY_MAP }) {
    return (
        <tbody>
            {data.length > 0 ? (
                data.map((item) => (
                    <tr key={item.uniId} className="bj-table-row">
                        <td className="bj-table-cell">{BLACK_TYPE_MAP[item.blackType] || '알 수 없음'}</td>
                        <td className="bj-table-cell">{INDUSTRY_MAP[item.lpgYn] || '주유소'}</td>
                        <td className="bj-table-cell">{item.osNm || '없음'}</td>
                        <td className="bj-table-cell">{item.newAdr || '없음'}</td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="4" className="bj-table-cell bj-no-data">검색 결과가 없습니다.</td>
                </tr>
            )}
        </tbody>
    );
}

export default BlackJuyusoList;