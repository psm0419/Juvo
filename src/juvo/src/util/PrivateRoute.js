import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const getExpirationFromToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000; // 밀리초로 변환
    } catch (e) {
        console.error('토큰 만료 시간 파싱 실패:', e);
        return null;
    }
};

const isTokenExpired = (token) => {
    const expiration = getExpirationFromToken(token);
    if (!expiration) return true; // 만료 시간을 가져올 수 없으면 만료된 것으로 간주
    return expiration < new Date().getTime();
};

const PrivateRoute = ({ component: Component, ...rest }) => {
    const token = localStorage.getItem('accessToken');
    const isAuthenticated = token && !isTokenExpired(token);

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{
                        pathname: '/user/login',
                        state: { from: props.location }
                    }} />
                )
            }
        />
    );
};

export default PrivateRoute;
