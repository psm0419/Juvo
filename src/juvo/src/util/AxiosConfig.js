import axios from 'axios';
import { useEffect } from 'react'; 

class TokenManager {
    constructor() {
        this.tokenExpireTime = null;
        this.refreshTimeout = null;
        this.eventListeners = [];
        this.refreshing = null; // 토큰 갱신 중복 방지
        this.initializeFromStorage();
    }

    initializeFromStorage() {
        const token = localStorage.getItem('accessToken');
        if (token) {
            this.setTokenExpireTime(this.getExpirationFromToken(token));
        }
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (typeof window === 'undefined') return;

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        const activityHandler = () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const expiration = this.getExpirationFromToken(token);
                if (expiration) {
                    this.setTokenExpireTime(expiration);
                }
            }
        };

        events.forEach(event => {
            window.addEventListener(event, activityHandler, { passive: true });
            this.eventListeners.push({ event, handler: activityHandler });
        });
    }

    cleanup() {
        // 이벤트 리스너 제거
        this.eventListeners.forEach(({ event, handler }) => {
            window.removeEventListener(event, handler);
        });
        this.eventListeners = [];

        // 타이머 정리
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
            this.refreshTimeout = null;
        }
    }

    setTokenExpireTime(expiresIn) {
        if (!expiresIn) return;
        
        this.tokenExpireTime = expiresIn;
        this.scheduleTokenRefresh();
    }

    getExpirationFromToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000; // 밀리초로 변환
        } catch (e) {
            console.error('토큰 만료 시간 파싱 실패:', e);
            return null;
        }
    }

    scheduleTokenRefresh() {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }

        const timeUntilExpire = this.tokenExpireTime - new Date().getTime();
        const refreshTime = timeUntilExpire - (5 * 60 * 1000); // 만료 5분 전

        if (refreshTime > 0) {
            this.refreshTimeout = setTimeout(() => {
                this.refreshToken().catch(error => {
                    console.error('자동 토큰 갱신 실패:', error);
                    if (error?.response?.status === 401) {
                        this.logout();
                    }
                });
            }, refreshTime);
        }
    }

    async refreshToken() {
        // 이미 갱신 중이면 진행 중인 갱신 완료 대기
        if (this.refreshing) {
            return this.refreshing;
        }

        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('리프레시 토큰이 없습니다.');
        }

        try {
            this.refreshing = axios.post('/user/refreshToken', {}, {
                headers: { Authorization: `Bearer ${refreshToken}` }
            });

            const response = await this.refreshing;
            
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                const newExpiration = this.getExpirationFromToken(response.data.accessToken);
                this.setTokenExpireTime(newExpiration);
                return response.data.accessToken;
            }
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            throw error;
        } finally {
            this.refreshing = null;
        }
    }

    isTokenExpiringSoon() {
        if (!this.tokenExpireTime) return false;
        const currentTime = new Date().getTime();
        const timeUntilExpire = this.tokenExpireTime - currentTime;
        return timeUntilExpire < 5 * 60 * 1000; // 5분 이내로 남은 경우
    }

    logout() {
        this.cleanup(); // 이벤트 리스너와 타이머 정리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.tokenExpireTime = null;
        window.location.href = '/login';
    }
}

// 싱글톤 인스턴스 생성
const tokenManager = new TokenManager();

// axios 인스턴스 생성
const instance = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json'
    },
    // 요청 타임아웃 설정
    timeout: 10000
});

// 요청 인터셉터
instance.interceptors.request.use(
    async (config) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                if (tokenManager.isTokenExpiringSoon()) {
                    try {
                        const newToken = await tokenManager.refreshToken();
                        if (newToken) {
                            config.headers.Authorization = `Bearer ${newToken}`;
                            return config;
                        }
                    } catch (error) {
                        console.error('토큰 갱신 중 오류:', error);
                        if (error?.response?.status === 401) {
                            tokenManager.logout();
                            throw error;
                        }
                    }
                }
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            console.error('요청 인터셉터 오류:', error);
            return Promise.reject(error);
        }
    },
    (error) => {
        console.error('요청 전송 실패:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
instance.interceptors.response.use(
    (response) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const expiration = tokenManager.getExpirationFromToken(token);
                if (expiration) {
                    tokenManager.setTokenExpireTime(expiration);
                }
            }
            return response;
        } catch (error) {
            console.error('응답 처리 중 오류:', error);
            return response;
        }
    },
    async (error) => {
        try {
            if (error.response?.status === 401) {
                // 토큰 갱신 시도
                try {
                    const newToken = await tokenManager.refreshToken();
                    if (newToken) {
                        error.config.headers.Authorization = `Bearer ${newToken}`;
                        return axios(error.config);
                    }
                } catch (refreshError) {
                    console.error('토큰 갱신 실패:', refreshError);
                    tokenManager.logout();
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        } catch (error) {
            console.error('응답 인터셉터 오류:', error);
            return Promise.reject(error);
        }
    }
);

// 컴포넌트 언마운트 시 정리를 위한 cleanup 메서드 export
export const cleanup = () => {
    tokenManager.cleanup();
};

// React 컴포넌트에서 사용할 수 있는 커스텀 훅
export const useTokenCleanup = () => {
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, []);
};

export default instance;
