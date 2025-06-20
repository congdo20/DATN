// src/routes/RedirectToHome.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // dùng hook thay vì context thô

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

// // src/components/routes/RedirectToHome.js
// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext"; // đường dẫn đúng với bạn

// const RedirectToHome = () => {
//   const { user } = useContext(AuthContext);

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (user.VaiTro === "Quan Tri" || user.VaiTro === "Giam Sat") {
//     return <Navigate to="/admin/home" replace />;
//   } else {
//     return <Navigate to="/user/home" replace />;
//   }
// };

// export default RedirectToHome;
