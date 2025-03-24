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
        console.log('[디버깅] 초기화 - accessToken:', token);
        if (token) {
            this.setTokenExpireTime(this.getExpirationFromToken(token));
        }
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (typeof window === 'undefined') return;

        const events = ['mousedown', 'keydown', 'touchstart'];
        const activityHandler = () => {
            const token = localStorage.getItem('accessToken');
            
            if (token) {
                const expiration = this.getExpirationFromToken(token);
                if (expiration) {
                    if (expiration < new Date().getTime()) {
                        // console.log('[디버깅] 토큰 만료로 로그아웃');
                        this.logout();
                    } else {
                        this.setTokenExpireTime(expiration);
                    }
                }
            } else {
                console.log('[디버깅] 토큰 없음으로 로그아웃');
                this.logout();
            }
        };

        // 주기적인 세션 체크 추가 (5분마다)
        const sessionCheckInterval = setInterval(() => {
            this.checkSession();
            console.log('[디버깅] 세션 체크 실행');
        }, 5 * 60 * 1000);

        this.eventListeners.push({
            type: 'interval',
            handler: sessionCheckInterval
        });

        events.forEach(event => {
            window.addEventListener(event, activityHandler, { passive: true });
            this.eventListeners.push({ event, handler: activityHandler });
            console.log('[디버깅] 이벤트 리스너 등록:', event);
        });
    }

    cleanup() {
        this.eventListeners.forEach(({ event, handler, type }) => {
            if (type === 'interval') {
                clearInterval(handler);
                // console.log('[디버깅] 세션 체크 인터벌 정리');
            } else {
                window.removeEventListener(event, handler);
            }
        });
        this.eventListeners = [];

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
            const expiration = payload.exp * 1000; // 밀리초로 변환
            return expiration;
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
                        // console.log('[디버깅] 401 에러로 로그아웃');
                        this.logout();
                    }
                });
            }, refreshTime);
            
        }
    }

    async refreshToken() {
        if (this.refreshing) return this.refreshing;
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('리프레시 토큰이 없습니다.');
        try {
            this.refreshing = axios.post('/user/refreshToken', {}, {
                headers: { Authorization: `Bearer ${refreshToken}` },
                timeout: 5000 // 타임아웃 설정
            });
            const response = await this.refreshing;
            console.log('[디버깅] 갱신 응답:', response.data);
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                const newExpiration = this.getExpirationFromToken(response.data.accessToken);
                this.setTokenExpireTime(newExpiration);
                return response.data.accessToken;
            }
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            if (error.response?.status === 401) {
                console.log('[디버깅] 401 에러로 로그아웃');
                this.logout(true);
            } else {
                this.showErrorPage('토큰 갱신 중 오류가 발생했습니다.');
            }
            throw error;
        } finally {
            this.refreshing = null;
            console.log('[디버깅] 갱신 완료 - refreshing 초기화');
        }
    }

    isTokenExpiringSoon() {
        if (!this.tokenExpireTime) return false;
        const currentTime = new Date().getTime();
        const timeUntilExpire = this.tokenExpireTime - currentTime;
        console.log('[디버깅] 만료까지 남은 시간(ms):', timeUntilExpire);
        return timeUntilExpire < 5 * 60 * 1000; // 5분 이내로 남은 경우
    }

    shouldRedirectToLogin(currentPath) {
        const myPagePaths = [
            '/mypage',
            '/mypage/profile',
            '/mypage/membership',
            '/mypage/favorites'
        ];
        console.log('[디버깅] 현재 경로:', currentPath);
        return myPagePaths.some(path => currentPath.startsWith(path));
    }

    logout(forceRedirect = false) {
        this.cleanup(); // 이벤트 리스너와 타이머 정리
        console.log('[디버깅] 로그아웃 실행 - forceRedirect:', forceRedirect);

        const currentPath = window.location.pathname;
        if (this.shouldRedirectToLogin(currentPath) || forceRedirect) {
            
            if (currentPath !== '/user/login') {
                sessionStorage.setItem('redirectUrl', currentPath);
                console.log('[디버깅] 리다이렉트 URL 저장:', currentPath);
            }
            window.location.href = '/user/login';
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.tokenExpireTime = null;
        console.log('[디버깅] 토큰 제거 완료');
    }

    checkSession() {
        const token = localStorage.getItem('accessToken');
        console.log('[디버깅] 세션 체크 - accessToken:', token);
        if (token) console.log('현재 토큰 만료 시간:', new Date(tokenManager.getExpirationFromToken(token)));
        if (!token || this.getExpirationFromToken(token) < new Date().getTime()) {
            console.log('[디버깅] 토큰 없음 또는 만료로 로그아웃');
            this.logout(true);
            return false;
        }
        return true;
    }
}

const tokenManager = new TokenManager();

const instance = axios.create({
    baseURL: '/', // 서버 경로 확인 필요
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

// 요청 인터셉터
instance.interceptors.request.use(
    async (config) => {
        try {
            const token = localStorage.getItem('accessToken');
            console.log('[디버깅] 요청 인터셉터 - accessToken:', token);
            if (token) {
                if (tokenManager.isTokenExpiringSoon()) {
                    console.log('[디버깅] 토큰 만료 임박, 갱신 시도');
                    try {
                        const newToken = await tokenManager.refreshToken();
                        if (newToken) {
                            config.headers.Authorization = `Bearer ${newToken}`;
                            console.log('[디버깅] 새 토큰으로 요청 설정:', newToken);
                            return config;
                        }
                    } catch (error) {
                        console.error('토큰 갱신 중 오류:', error);
                        if (error?.response?.status === 401) {
                            console.log('[디버깅] 401 에러로 로그아웃');
                            tokenManager.logout();
                            throw error;
                        }
                    }
                }
                config.headers.Authorization = `Bearer ${token}`;
                console.log('[디버깅] 기존 토큰으로 요청 설정');
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
            console.log('[디버깅] 응답 인터셉터 - accessToken:', token);
            if (token) {
                const expiration = tokenManager.getExpirationFromToken(token);
                console.log('[디버깅] 응답 시 토큰 만료 시간:', new Date(expiration));
                if (expiration) {
                    if (expiration < new Date().getTime()) {
                        const currentPath = window.location.pathname;
                        if (tokenManager.shouldRedirectToLogin(currentPath)) {
                            console.log('[디버깅] 토큰 만료로 로그아웃');
                            tokenManager.logout(true);
                            return Promise.reject(new Error('세션이 만료되었습니다.'));
                        }
                    }
                    tokenManager.setTokenExpireTime(expiration);
                }
            } else {
                const currentPath = window.location.pathname;
                if (tokenManager.shouldRedirectToLogin(currentPath)) {
                    console.log('[디버깅] 토큰 없음으로 로그아웃');
                    tokenManager.logout(true);
                    return Promise.reject(new Error('인증이 필요합니다.'));
                }
            }
            return response;
        } catch (error) {
            console.error('응답 처리 중 오류:', error);
            return response; // 원래 동작 유지
        }
    },
    async (error) => {
        try {
            if (error.response?.status === 401) {
                console.log('[디버깅] 401 응답, 갱신 시도');
                try {
                    const newToken = await tokenManager.refreshToken();
                    if (newToken) {
                        error.config.headers.Authorization = `Bearer ${newToken}`;
                        console.log('[디버깅] 새 토큰으로 요청 재시도');
                        return axios(error.config);
                    }
                } catch (refreshError) {
                    console.error('토큰 갱신 실패:', refreshError);
                    const currentPath = window.location.pathname;
                    if (tokenManager.shouldRedirectToLogin(currentPath)) {
                        console.log('[디버깅] 갱신 실패로 로그아웃');
                        tokenManager.logout(true);
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

export const cleanup = () => {
    tokenManager.cleanup();
    console.log('[디버깅] cleanup 호출');
};

export const useTokenCleanup = () => {
    useEffect(() => {
        return () => {
            cleanup();
            console.log('[디버깅] 컴포넌트 언마운트 - cleanup 실행');
        };
    }, []);
};

export default instance;