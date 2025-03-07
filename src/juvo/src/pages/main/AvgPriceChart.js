import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function AvgPriceChart({ selectedProduct }) {
    const [priceData, setPriceData] = useState([]);

    const productCodes = {
        "휘발유": "B027",
        "경유": "D047",
        "고급휘발유": "B034",
        "실내등유": "C004"
    };

    useEffect(() => {
        const prodcd = productCodes[selectedProduct] || "B027";

        axios.get(`/api/avgByDay?prodcd=${prodcd}`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    const formattedData = response.data.map(item => ({
                        date: item.date, 
                        price: item.price
                    }));
                    setPriceData(formattedData);
                } else {
                    console.error("응답 데이터가 배열이 아닙니다.");
                }
            })
            .catch(error => {
                console.error("API 호출 중 오류 발생:", error);
            });
    }, [selectedProduct]);

    return (
        <div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default AvgPriceChart;
