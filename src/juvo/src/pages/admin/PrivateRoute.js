import React from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Swal 추가

function AdminPrivateRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    const userType = localStorage.getItem("userType");

    console.log("accessToken:", token);
    console.log("userType:", userType, typeof userType);

    if (!token || userType?.trim().toUpperCase() !== "ADM") {
        Swal.fire({
            icon: "error",
            title: "페이지 접속 불가",
            text: "관리자 권한이 필요합니다.",
        }).then(() => {
            window.location.href = "/user/login";
        });

        return null; // ✅ Navigate가 비동기라서, 일단 null 반환
    }

    return children;
}

export default AdminPrivateRoute;
