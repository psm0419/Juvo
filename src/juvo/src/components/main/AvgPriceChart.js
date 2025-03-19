import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function AvgPriceChart({ selectedProduct, selectedArea, productCodes, areaCodes }) {
    const [priceData, setPriceData] = useState([]);

    const minPrice = Math.min(...priceData.map(d => d.price));
    const maxPrice = Math.max(...priceData.map(d => d.price));

    useEffect(() => {
        const prodcd = productCodes[selectedProduct] || "B027"; // 선택된 제품 코드, 기본값은 휘발유(B027)
        const areaCode = selectedArea ? areaCodes[selectedArea] : ""; // 선택된 지역 코드

        // 지역이 선택되지 않았을 때 전국 데이터를 가져옴
        if (!selectedArea) {
            axios.get(`/api/avgByDayAll?prodcd=${prodcd}`)
                .then(response => {
                    if (Array.isArray(response.data)) {
                        setPriceData(response.data.map(item => ({
                            date: item.date, // 날짜 필드
                            price: item.price // 가격 필드
                        })));
                    } else {
                        console.error("응답 데이터가 배열이 아닙니다.");
                    }
                })
                .catch(error => {
                    console.error("API 호출 중 오류 발생:", error);
                });
        } else {
            // 지역이 선택되었을 때 지역별 데이터를 가져옴
            axios.get(`/api/avgByDay?prodcd=${prodcd}&area=${areaCode}`)
                .then(response => {
                    if (Array.isArray(response.data)) {
                        setPriceData(response.data.map(item => ({
                            date: item.date,
                            price: item.price
                        })));
                    } else {
                        console.error("응답 데이터가 배열이 아닙니다.");
                    }
                })
                .catch(error => {
                    console.error("API 호출 중 오류 발생:", error);
                });
        }
    }, [selectedProduct, selectedArea, productCodes, areaCodes]);

    // 데이터가 아직 없는 경우 로딩 메시지 표시
    if (priceData.length === 0) {
        return <div style={{ textAlign: "center", padding: "20px", fontSize: "18px" }}>데이터를 불러오는 중...</div>;
    }

    return (
        <ResponsiveContainer width="90%" height={300}>
            <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" /> {/* X축은 날짜 */}
                <YAxis domain={[minPrice, maxPrice]} /> {/* Y축은 가격 범위 */}
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#4682B4" strokeWidth={2} /> {/* 가격 선 그래프 */}
            </LineChart>
        </ResponsiveContainer>
    );
}

export default AvgPriceChart;