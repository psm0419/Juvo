import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/user/myPage/MyPageFavorites.css';
import axiosInstance from '../../../util/AxiosConfig';

function MyPageFavorites() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const getToken = () => localStorage.getItem("accessToken");

    const fetchFavorites = async () => {
        const token = getToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/user/login");
            return;
        }

        try {
            const response = await axiosInstance.get("/favorites/station", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setFavorites(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("즐겨찾기 목록 조회 오류:", error);
            if (error.response?.status === 401) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate("/user/login");
            } else {
                alert("즐겨찾기 목록을 불러오는데 실패했습니다.");
            }
            setIsLoading(false);
        }
    };

    const handleRemoveFavorite = async (uniId) => {
        if (!window.confirm("즐겨찾기를 해제하시겠습니까?")) {
            return;
        }

        const token = getToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/user/login");
            return;
        }

        try {
            const response = await axios.post(
                "/favorites/station/remove",
                { uniId: uniId },
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            
            if (response.data) {
                alert("즐겨찾기가 해제되었습니다.");
                fetchFavorites(); // 목록 새로고침
            }
        } catch (error) {
            console.error("즐겨찾기 해제 오류:", error);
            if (error.response?.status === 401) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate("/user/login");
            } else {
                alert(error.response?.data || "즐겨찾기 해제에 실패했습니다.");
            }
        }
    };

    if (isLoading) return <div className="favorites-container">로딩 중...</div>;

    return (
        <div className="favorites-container">
            <h1 className="favorites-title">즐겨찾기한 주유소</h1>
            {favorites.length === 0 ? (
                <div className="no-favorites">
                    즐겨찾기한 주유소가 없습니다.
                </div>
            ) : (
                <div className="favorites-list">
                    {favorites.map((juyuso) => (
                        <div key={juyuso.uniId} className="favorites-item">
                            <h3>{juyuso.osNm}</h3>
                            <p>주소: {juyuso.vanAdr}</p>
                            <p>신주소: {juyuso.newAdr}</p>
                            <div className="price-info">
                                <p>휘발유: {juyuso.hoilPrice}원/L</p>
                                <p>경유: {juyuso.doilPrice}원/L</p>
                            </div>
                            <button 
                                className="remove-favorite"
                                onClick={() => handleRemoveFavorite(juyuso.uniId)}
                            >
                                즐겨찾기 해제
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyPageFavorites; 