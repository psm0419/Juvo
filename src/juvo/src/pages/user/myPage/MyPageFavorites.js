import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/user/myPage/MyPageFavorites.css';

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
            const response = await axios.get("/api/favorites", {
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

    const handleRemoveFavorite = async (juyusoId) => {
        const token = getToken();
        if (!token) return;

        try {
            await axios.delete(`/api/favorites/${juyusoId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            // 삭제 후 목록 다시 불러오기
            fetchFavorites();
            alert("즐겨찾기가 해제되었습니다.");
        } catch (error) {
            console.error("즐겨찾기 해제 오류:", error);
            alert("즐겨찾기 해제에 실패했습니다.");
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
                        <div key={juyuso.id} className="favorites-item">
                            <h3>{juyuso.name}</h3>
                            <p>주소: {juyuso.address}</p>
                            <div className="price-info">
                                <p>휘발유: {juyuso.gasolinePrice}원/L</p>
                                <p>경유: {juyuso.dieselPrice}원/L</p>
                            </div>
                            <div className="last-updated">
                                마지막 업데이트: {new Date(juyuso.lastUpdated).toLocaleString()}
                            </div>
                            <button 
                                className="remove-favorite"
                                onClick={() => handleRemoveFavorite(juyuso.id)}
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