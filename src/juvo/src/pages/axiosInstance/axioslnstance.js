// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/", // 기본 URL 설정 (필요에 따라 변경)
});

// 요청 인터셉터: 모든 요청에 토큰 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 공통 오류 처리 (예: 401 에러 처리)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // 필요에 따라 로그인 페이지로 리다이렉트 처리 등 수행
            // 예: window.location.href = "/user/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
