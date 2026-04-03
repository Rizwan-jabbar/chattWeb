import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { getLoggedInUserThunk } from "./rtk/thunks/userProfileThunk/userProfileThunk";
import Login from "./components/login/login";

const ProtectedRoutes = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.userProfile);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(getLoggedInUserThunk());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Login />;

  return <Outlet />;
};

export default ProtectedRoutes;