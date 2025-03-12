import React from 'react';

function GasStationTable({ currentItems, modifyBlack, removeBlack }) {
    const getBlackTypeLabel = (blackType) => {
        switch (blackType) {
            case 0: return '용도외판매';
            case 1: return '품질기준부적합';
            case 2: return '가짜석유취급';
            case 3: return '정량미달판매';
            default: return '알 수 없음';
        }
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>주유소 코드</th>
                    <th>위반 유형</th>
                    <th>업종 구분</th>
                    <th>상호</th>
                    <th>도로명 주소</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {currentItems.length > 0 ? (
                    currentItems.map((station) => (
                        <tr key={station.uniId}>
                            <td>{station.uniId}</td>
                            <td>{getBlackTypeLabel(station.blackType)}</td>
                            <td>{station.lpgYn === 'Y' ? 'LPG' : '주유소'}</td>
                            <td>{station.osNm}</td>
                            <td>{station.newAdr}</td>
                            <td>
                                <button onClick={() => modifyBlack(station.uniId)}>추가</button>
                                <button onClick={() => removeBlack(station.uniId)}>삭제</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">불법 주유소 목록이 없습니다.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default GasStationTable;