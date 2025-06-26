import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const RedirectToHome = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.VaiTro === "Quan Tri" || user.VaiTro === "Giam Sat") {
    return <Navigate to="/admin/home" replace />;
  } else {
    return <Navigate to="/user/home" replace />;
  }
};

export default RedirectToHome;
