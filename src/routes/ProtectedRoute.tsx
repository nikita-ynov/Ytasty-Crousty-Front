import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

export default function ProtectedRoute({children, allowedRoles}: ProtectedRouteProps) {
    const token = useSelector(
        (state: RootState) => state.auth.token
    );

    const role = useSelector(
        (state: RootState) => state.auth.role
    );

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}