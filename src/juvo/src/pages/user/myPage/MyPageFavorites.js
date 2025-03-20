import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../assets/css/user/myPage/MyPageFavorites.css';
import axiosInstance from '../../../util/AxiosConfig';
import Swal from 'sweetalert2'; // SweetAlert2 임포트

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
            Swal.fire("로그인이 필요합니다.");
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
                Swal.fire("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate("/user/login");
            } else {
                Swal.fire("즐겨찾기 목록을 불러오는데 실패했습니다.");
            }
            setIsLoading(false);
        }
    };

    const handleRemoveFavorite = async (uniId) => {
        Swal.fire({
            title: "해제 하실건가요?",
            text: "해당 주유소는 즐겨찾기 목록에서 삭제됩니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "네, 삭제할래요!",
            cancelButtonText: "취소"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = getToken();
                if (!token) {
                    Swal.fire("로그인이 필요합니다.");
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
                        Swal.fire("즐겨찾기 해제되었습니다.");
                        fetchFavorites(); // 목록 새로고침
                    }
                } catch (error) {
                    console.error("즐겨찾기 해제 오류:", error);
                    if (error.response?.status === 401) {
                        Swal.fire("세션이 만료되었습니다. 다시 로그인해주세요.");
                        navigate("/user/login");
                    } else {
                        Swal.fire(error.response?.data || "즐겨찾기 해제에 실패했습니다.");
                    }
                }
            }
        });
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
