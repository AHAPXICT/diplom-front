import { Navigate, Outlet } from "react-router";

export const GuestRoute = () => {
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    return token ? <Navigate to="/" replace /> : <Outlet />;
};