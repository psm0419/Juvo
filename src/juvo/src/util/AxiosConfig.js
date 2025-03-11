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
                    if (expiration < new Date().getTime()) {
                        // 토큰이 이미 만료된 경우
                        this.logout();
                    } else {
                        this.setTokenExpireTime(expiration);
                    }
                }
            } else {
                // 토큰이 없는 경우
                this.logout();
            }
        };

        // 주기적인 세션 체크 추가 (5분마다)
        const sessionCheckInterval = setInterval(() => {
            this.checkSession();
        }, 5 * 60 * 1000);

        this.eventListeners.push({
            type: 'interval',
            handler: sessionCheckInterval
        });

        events.forEach(event => {
            window.addEventListener(event, activityHandler, { passive: true });
            this.eventListeners.push({ event, handler: activityHandler });
        });
    }

    cleanup() {
        // 이벤트 리스너 제거
        this.eventListeners.forEach(({ event, handler, type }) => {
            if (type === 'interval') {
                clearInterval(handler);
            } else {
                window.removeEventListener(event, handler);
            }
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

    shouldRedirectToLogin(currentPath) {
        // 마이페이지 관련 경로들을 배열로 정의
        const myPagePaths = [
            '/mypage',
            '/mypage/favorites',
            '/mypage/membership',
            '/mypage/reviews',
            '/mypage/settings'
            // 필요한 마이페이지 경로 추가
        ];
        
        // 현재 경로가 마이페이지 관련 경로인지 확인
        return myPagePaths.some(path => currentPath.startsWith(path));
    }

    logout(forceRedirect = false) {
        this.cleanup(); // 이벤트 리스너와 타이머 정리
        
        // 현재 페이지 URL 확인
        const currentPath = window.location.pathname;
        
        // 마이페이지이거나 강제 리다이렉트가 true인 경우에만 리다이렉트 처리
        if (this.shouldRedirectToLogin(currentPath) || forceRedirect) {
            if (currentPath !== '/login') {
                sessionStorage.setItem('redirectUrl', currentPath);
            }
            window.location.href = '/login';
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.tokenExpireTime = null;
    }

    checkSession() {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            this.logout(false);  // 강제 리다이렉트 없이 로그아웃
            return false;
        }

        const expiration = this.getExpirationFromToken(token);
        if (!expiration || expiration < new Date().getTime()) {
            this.logout(false);  // 강제 리다이렉트 없이 로그아웃
            return false;
        }

        return true;
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
                    if (expiration < new Date().getTime()) {
                        // 현재 경로가 마이페이지인 경우에만 로그아웃 처리
                        const currentPath = window.location.pathname;
                        if (tokenManager.shouldRedirectToLogin(currentPath)) {
                            tokenManager.logout(true);  // 강제 리다이렉트와 함께 로그아웃
                            return Promise.reject(new Error('세션이 만료되었습니다.'));
                        }
                    }
                    tokenManager.setTokenExpireTime(expiration);
                }
            } else {
                // 현재 경로가 마이페이지인 경우에만 로그아웃 처리
                const currentPath = window.location.pathname;
                if (tokenManager.shouldRedirectToLogin(currentPath)) {
                    tokenManager.logout(true);  // 강제 리다이렉트와 함께 로그아웃
                    return Promise.reject(new Error('인증이 필요합니다.'));
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
                try {
                    const newToken = await tokenManager.refreshToken();
                    if (newToken) {
                        error.config.headers.Authorization = `Bearer ${newToken}`;
                        return axios(error.config);
                    }
                } catch (refreshError) {
                    console.error('토큰 갱신 실패:', refreshError);
                    // 현재 경로가 마이페이지인 경우에만 로그아웃 처리
                    const currentPath = window.location.pathname;
                    if (tokenManager.shouldRedirectToLogin(currentPath)) {
                        tokenManager.logout(true);  // 강제 리다이렉트와 함께 로그아웃
                        return Promise.reject(new Error('세션이 만료되었습니다. 다시 로그인해주세요.'));
                    }
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
