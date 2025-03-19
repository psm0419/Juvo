import { useState, useEffect } from "react";
import '../../../assets/css/detail/Conversion.css';
import Swal from "sweetalert2";


export default function ConversionForm() {
    const [inputValue, setInputValue] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("일반석유제품($/배럴) → (원/리터)");
    const [result, setResult] = useState("");
    const [activeTab, setActiveTab] = useState('volume'); // 기본 탭: 부피
    const [exchangeRate, setExchangeRate] = useState(1455); //원달러 환율
    const [barrelToLiter, setBarrelToLiter] = useState(158.987);    //
    const [literToKg, setLiterToKg] = useState(0.5);

    useEffect(() => {
        fetch("https://api.exchangerate-api.com/v4/latest/USD")
            .then(response => response.json())
            .then(data => {
                if (data.rates && data.rates.KRW) {
                    setExchangeRate(data.rates.KRW);
                } else {
                    console.error("환율 정보가 올바르게 제공되지 않음");
                }
            })
            .catch(error => {
                console.error("환율 정보를 가져오는 중 오류 발생:", error);
            });
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const convertUnit = (e) => {
        e.preventDefault();

        let output = "";
        const value = parseFloat(inputValue.trim());

        if (isNaN(value) || inputValue.trim() === "") {
            Swal.fire("숫자를 입력하세요!"); // SweetAlert2로 알림을 표시
            return;
        }

        switch (selectedUnit) {
            case "일반석유제품($/배럴) → (원/리터)":
                output = `${(value * exchangeRate / barrelToLiter).toFixed(2)} 원/리터`;
                break;
            case "일반석유제품(원/리터) → ($/배럴)":
                output = `${(value * barrelToLiter / exchangeRate).toFixed(2)} $/배럴`;
                break;
            case "자동차용부탄(원/리터) → (원/kg)":
                output = `${(value / literToKg).toFixed(2)} 원/kg`;
                break;
            case "자동차용부탄(원/kg) → (원/리터)":
                output = `${(value * literToKg).toFixed(2)} 원/리터`;
                break;
            default:
                output = "잘못된 단위 선택";
        }

        setResult(output);
    };

    return (
        <div className="conversion-container">
            {/* 최상단 제목 영역 */}
            <div className="header-container">
                <h3>단위환산표</h3>
                <h4>석유관련 부피, 중량 단위 환산표</h4>
            </div>

            {/* 변환 폼 */}
            <form className="conversion-form" onSubmit={convertUnit}>
                <label htmlFor="unit">단위환산</label>
                <input
                    type="text"
                    id="unit"
                    placeholder="값을 입력하세요"
                    value={inputValue}
                    onChange={(e) => {
                        const input = e.target.value;
                        if (/^\d*\.?\d*$/.test(input)) {
                            setInputValue(input);
                        }
                    }}
                />
                <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                    <option>일반석유제품($/배럴) → (원/리터)</option>
                    <option>일반석유제품(원/리터) → ($/배럴)</option>
                    <option>자동차용부탄(원/리터) → (원/kg)</option>
                    <option>자동차용부탄(원/kg) → (원/리터)</option>
                </select>
                <button type="submit">변환하기</button>

            {/* 결과 출력 영역 */}
            {result && (
                <div className="result-container">
                    <div className="divider"></div>
                    <p> {result}</p>
                    <div className="divider"></div>
                </div>
            )}
            </form>
            {/* 탭 버튼 */}
            <div className="tabs">
                <button className={activeTab === 'volume' ? 'active' : ''} onClick={() => handleTabClick('volume')}>부피</button>
                <button className={activeTab === 'crude' ? 'active' : ''} onClick={() => handleTabClick('crude')}>원유 환산표</button>
                <button className={activeTab === 'petroleum' ? 'active' : ''} onClick={() => handleTabClick('petroleum')}>석유제품 환산표</button>
            </div>

            {/* 탭별 변환표 */}
            {activeTab === 'volume' && (
                <table className="conversion-table">
                    <thead>
                        <tr>
                            <th>단위</th>
                            <th>리터</th>
                            <th>입방피트</th>
                            <th>kl(㎥)</th>
                            <th>갤론(US)</th>
                            <th>갤론(UK)</th>
                            <th>배럴</th>
                            <th>드럼</th>
                            <th>입방인치</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>리터</td>
                            <td>1</td>
                            <td>0.03531</td>
                            <td>0.001</td>
                            <td>0.26418</td>
                            <td>0.21997</td>
                            <td>0.00629</td>
                            <td>0.005</td>
                            <td>61.027</td>
                        </tr>
                        <tr>
                            <td>입방 피트</td>
                            <td>28.3169</td>
                            <td>1</td>
                            <td>0.0283</td>
                            <td>7.4805</td>
                            <td>6.2321</td>
                            <td>0.178</td>
                            <td>0.1416</td>
                            <td>1.728</td>
                        </tr>
                        <tr>
                            <td>kl(㎥)</td>
                            <td>1,000</td>
                            <td>35.315</td>
                            <td>1</td>
                            <td>264.18</td>
                            <td>219.9</td>
                            <td>6.2889</td>
                            <td>5</td>
                            <td>61,027</td>
                        </tr>
                        <tr>
                            <td>갤론(US)</td>
                            <td>3.78543</td>
                            <td>0.1337</td>
                            <td>0.00379</td>
                            <td>1</td>
                            <td>0.8327</td>
                            <td>0.0238</td>
                            <td>0.0189</td>
                            <td>231</td>
                        </tr>
                        <tr>
                            <td>갤론(UK)</td>
                            <td>4.5459</td>
                            <td>0.1605</td>
                            <td>0.00455</td>
                            <td>1.2009</td>
                            <td>1</td>
                            <td>0.0286</td>
                            <td>0.0227</td>
                            <td>277.4</td>
                        </tr>
                        <tr>
                            <td>배럴</td>
                            <td>158.984</td>
                            <td>5.6146</td>
                            <td>0.1589</td>
                            <td>42</td>
                            <td>34.97</td>
                            <td>1</td>
                            <td>0.795</td>
                            <td>9,702</td>
                        </tr>
                        <tr>
                            <td>드럼</td>
                            <td>200</td>
                            <td>7.062</td>
                            <td>0.2</td>
                            <td>52.834</td>
                            <td>43.994</td>
                            <td>1.258</td>
                            <td>1</td>
                            <td>12,205.4</td>
                        </tr>
                        <tr>
                            <td>입방인치</td>
                            <td>0.01638</td>
                            <td>0.00057</td>
                            <td>16.387 × 10<sup>-6</sup></td>
                            <td>4.32 × 10<sup>-3</sup></td>
                            <td>3.598 × 10<sup>-3</sup></td>
                            <td>1.0286 × 10<sup>-4</sup></td>
                            <td>8.16 × 10<sup>-5</sup></td>
                            <td>1</td>
                        </tr>
                    </tbody>
                </table>
            )}

            {activeTab === 'crude' && (
                <table className="conversion-table">
                    <thead>
                        <tr>
                            <th>단위</th>
                            <th>톤(매트릭톤)</th>
                            <th>롱톤</th>
                            <th>숏톤</th>
                            <th>배럴</th>
                            <th>kl(㎥)</th>
                            <th>1천갤론(UK)</th>
                            <th>1천갤론(US)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>톤(매트릭톤)</td>
                            <td>1</td>
                            <td>0.984</td>
                            <td>1.102</td>
                            <td>7.33</td>
                            <td>1.16</td>
                            <td>0.256</td>
                            <td>0.308</td>
                        </tr>
                        <tr>
                            <td>롱톤</td>
                            <td>1.016</td>
                            <td>1</td>
                            <td>1.120</td>
                            <td>7.45</td>
                            <td>1.18</td>
                            <td>0.261</td>
                            <td>0.313</td>
                        </tr>
                        <tr>
                            <td>숏톤</td>
                            <td>0.907</td>
                            <td>0.893</td>
                            <td>1</td>
                            <td>6.65</td>
                            <td>1.05</td>
                            <td>0.233</td>
                            <td>0.279</td>
                        </tr>
                        <tr>
                            <td>배럴</td>
                            <td>0.136</td>
                            <td>0.134</td>
                            <td>0.150</td>
                            <td>1</td>
                            <td>0.159</td>
                            <td>0.035</td>
                            <td>0.042</td>
                        </tr>
                        <tr>
                            <td>kl(m<sup>3</sup>)</td>
                            <td>0.863</td>
                            <td>0.849</td>
                            <td>0.951</td>
                            <td>6.29</td>
                            <td>1</td>
                            <td>0.220</td>
                            <td>0.264</td>
                        </tr>
                        <tr>
                            <td>1천갤론(UK)</td>
                            <td>3.91</td>
                            <td>3.83</td>
                            <td>4.29</td>
                            <td>28.6</td>
                            <td>4.55</td>
                            <td>1</td>
                            <td>1.201</td>
                        </tr>
                        <tr>
                            <td>1천갤론(US)</td>
                            <td>3.25</td>
                            <td>3.19</td>
                            <td>3.58</td>
                            <td>23.8</td>
                            <td>3.79</td>
                            <td>0.833</td>
                            <td>1</td>
                        </tr>
                    </tbody>
                </table>
            )}

            {activeTab === 'petroleum' && (
                <table className="conversion-table">
                    <thead>
                        <tr>
                            <th>구분</th>
                            <th>배럴→톤</th>
                            <th>톤→배럴</th>
                            <th>배럴/일→톤/년</th>
                            <th>톤/년→배럴/일</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>원유</td>
                            <td>0.136</td>
                            <td>7.33</td>
                            <td>49.8</td>
                            <td>0.0201</td>
                        </tr>
                        <tr>
                            <td>휘발유</td>
                            <td>0.118</td>
                            <td>8.45</td>
                            <td>43.2</td>
                            <td>0.0232</td>
                        </tr>
                        <tr>
                            <td>등유</td>
                            <td>0.128</td>
                            <td>7.80</td>
                            <td>46.8</td>
                            <td>0.0214</td>
                        </tr>
                        <tr>
                            <td>경유</td>
                            <td>0.133</td>
                            <td>7.50</td>
                            <td>48.7</td>
                            <td>0.0205</td>
                        </tr>
                        <tr>
                            <td>중유</td>
                            <td>0.149</td>
                            <td>6.70</td>
                            <td>54.5</td>
                            <td>0.0184</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
}
