import React from "react";
import { Navigate } from "react-router-dom"; // ✅ 추가

function AdminPrivateRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    const userType = localStorage.getItem("userType"); // ✅ "userRole" → "userType" 수정

    console.log("accessToken:", token);
    console.log("userType:", userType, typeof userType); // ✅ 값 확인

    if (!token || userType?.trim().toUpperCase() !== "ADM") { // ✅ 수정
        alert("관리자 권한이 필요합니다.");
        return <Navigate to="/user/login" replace />;
    }

    return children;
}

export default AdminPrivateRoute;
