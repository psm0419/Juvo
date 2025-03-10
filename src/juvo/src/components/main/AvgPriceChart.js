import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function AvgPriceChart({ selectedProduct, selectedArea, productCodes, areaCodes }) {
    const [priceData, setPriceData] = useState([]);

    const minPrice = Math.min(...priceData.map(d => d.price));
    const maxPrice = Math.max(...priceData.map(d => d.price));

    useEffect(() => {
        const prodcd = productCodes[selectedProduct] || "B027";
        const areaCode = selectedArea ? areaCodes[selectedArea] : "";
        
        if (!selectedArea) return; 

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
    }, [selectedProduct, selectedArea]);

    if (!selectedArea) {
        return <div className="text" style={{ textAlign: "center", padding: "20px", fontSize: "18px" }}>지역을 선택해주세요</div>;
    }

    return (
        <ResponsiveContainer width="90%" height={300}>
            <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[minPrice, maxPrice]}/> {/* y축 1500 - 1900 */}
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#4682B4" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default AvgPriceChart;
