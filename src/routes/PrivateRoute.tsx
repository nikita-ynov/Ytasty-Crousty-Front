import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const loggedUser = useSelector((state: RootState) => state.auth.loggedUser);
  const loading = useSelector((state: RootState) => state.loading.value)
  if (loading) return <div>Loading ...</div>
  return loggedUser ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;

