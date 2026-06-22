import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = () => {
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    return token ? <Outlet /> : <Navigate to="/auth" replace />;
};