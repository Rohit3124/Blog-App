import { useContext } from "react";
import { userDataContext } from "../context/userContext";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useContext(userDataContext);
  return user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
