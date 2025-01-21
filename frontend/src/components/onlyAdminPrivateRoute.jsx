import { useContext } from "react";
import { userDataContext } from "../context/userContext";
import { Outlet, Navigate } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
  const { user, isLoading } = useContext(userDataContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default OnlyAdminPrivateRoute;
