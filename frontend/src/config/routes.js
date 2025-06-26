import ViolationsPageAdmin from "../components/pages/admin/ViolationsPageAdmin";
import ViolationsPageUser from "../components/pages/user/ViolationsPageUser";
import VehiclesPage from "../components/pages/VehiclesPage";
import PersonsPage from "../components/pages/PersonsPage";
import TrafficPage from "../components/pages/TrafficStatusPage";
import AnalyticsPage from "../components/pages/AnalyticsPage";
import LoginPage from "../components/pages/LoginPage";
import SignUpPage from "../components/pages/SignUpPage";
import NotFoundPage from "../components/pages/NotFoundPage";
import HomePageAdmin from "../components/pages/admin/HomePageAdmin";
import HomePageUser from "../components/pages/user/HomePageUser";
import PrivateRoute from "../routes/PrivateRoute";
import UnauthorizedPage from "../components/pages/UnauthorizedPage";
import RedirectToHome from "../routes/RedirectToHome";
import SettingPage from "../components/pages/SettingAccountPage";
import MainLayout from "../components/layout/MainLayout";
import ShowOneCamera from "../components/pages/ShowOneCamera";
import AccountManagePageAdmin from "../components/pages/admin/AccountManagePageAdmin";
import CameraManagePageAdmin from "../components/pages/admin/CameraManagePageAdmin";
import SettingCameraPageAdmin from "../components/pages/admin/SettingCameraPageAdmin";
import SettingAccountPageAdmin from "../components/pages/admin/SettingAccountPageAdmin";
import AccountCreatePageAdmin from "../components/pages/admin/AccountCreatePageAdmin";
import CameraCreatePageAdmin from "../components/pages/admin/CameraCreatePageAdmin";

export const appRoutes = [
  {
    path: "/",
    element: <RedirectToHome />,
  },

  {
    path: "/admin/home",
    label: "Trang Chủ Quản Trị",
    element: (
      <PrivateRoute roles={["Quan Tri", "Giam Sat"]}>
        <MainLayout>
          <HomePageAdmin />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/violations",
    label: "Tra Cứu Vi Phạm Quản Trị",
    element: (
      <PrivateRoute roles={["Quan Tri", "Giam Sat"]}>
        <MainLayout>
          <ViolationsPageAdmin />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/accountmanage",
    label: "Quản Trị Quản Lý Tài Khoản",
    element: (
      <PrivateRoute roles={["Quan Tri", "Giam Sat"]}>
        <MainLayout>
          <AccountManagePageAdmin />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/cameramanage",
    label: "Quản Lý Camera",
    element: (
      <PrivateRoute roles={["Quan Tri", "Giam Sat"]}>
        <MainLayout>
          <CameraManagePageAdmin />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/camerasetting/:id",
    label: "Cài đặt camera",
    element: (
      <PrivateRoute roles={["Quan Tri", "Giam Sat"]}>
        <MainLayout>
          <SettingCameraPageAdmin />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/accountsetting/:userId",
    label: "Cài đặt tài khoản quản trị",
    element: (
      <PrivateRoute roles={["Quan Tri", "Giam Sat"]}>
        <MainLayout>
          <SettingAccountPageAdmin />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/accountcreate",
    label: "Thêm Tài Khoản Mới",
    element: (
      <PrivateRoute roles={["Quan Tri", "Giam Sat"]}>
        <MainLayout>
          <AccountCreatePageAdmin />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/cameracreate",
    label: "Thêm Camera Mới",
    element: (
      <PrivateRoute roles={["Quan Tri", "Giam Sat"]}>
        <MainLayout>
          <CameraCreatePageAdmin />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/user/home",
    label: "Trang Chủ Người Dùng",
    element: (
      <PrivateRoute roles={["Nguoi Dan", "Nhan Vien", "Nguoi Dung"]}>
        <MainLayout>
          <HomePageUser />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/user/violations",
    label: "Tra Cứu Vi Phạm Người Dùng",
    element: (
      <PrivateRoute roles={["Nguoi Dan", "Nhan Vien", "Nguoi Dung"]}>
        <MainLayout>
          <ViolationsPageUser />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/vehicles",
    label: "Tìm Kiếm Phương Tiện",
    element: (
      <PrivateRoute
        roles={["Quan Tri", "Giam Sat", "Nguoi Dan", "Nhan Vien", "Nguoi Dung"]}
      >
        <MainLayout>
          <VehiclesPage />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/persons",
    label: "Tìm Kiếm Người",
    element: (
      <PrivateRoute
        roles={["Quan Tri", "Giam Sat", "Nguoi Dan", "Nhan Vien", "Nguoi Dung"]}
      >
        <MainLayout>
          <PersonsPage />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/traffic",
    label: "Tình Trạng Giao Thông",
    element: (
      <PrivateRoute
        roles={["Quan Tri", "Giam Sat", "Nguoi Dan", "Nhan Vien", "Nguoi Dung"]}
      >
        <MainLayout>
          <TrafficPage />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/analytics",
    label: "Thống Kê",
    element: (
      <PrivateRoute
        roles={["Quan Tri", "Giam Sat", "Nguoi Dan", "Nhan Vien", "Nguoi Dung"]}
      >
        <MainLayout>
          <AnalyticsPage />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/login",
    label: "Đăng Nhập",
    element: (
      <MainLayout>
        <LoginPage />
      </MainLayout>
    ),
  },

  {
    path: "/signup",
    label: "Đăng Ký",
    element: (
      <MainLayout>
        <SignUpPage />
      </MainLayout>
    ),
  },

  {
    path: "/notfound",
    label: "Lỗi 404",
    element: (
      <MainLayout>
        <NotFoundPage />
      </MainLayout>
    ),
  },

  {
    path: "/showcamera/:id",
    label: "Xem Camera",
    element: (
      <PrivateRoute
        roles={["Quan Tri", "Giam Sat", "Nguoi Dan", "Nhan Vien", "Nguoi Dung"]}
      >
        <MainLayout>
          <ShowOneCamera />
        </MainLayout>
      </PrivateRoute>
    ),
  },

  {
    path: "/unauthorized",
    label: "Không Có Quyền",
    element: (
      <MainLayout>
        <UnauthorizedPage />
      </MainLayout>
    ),
  },

  {
    path: "*",
    label: "Không Tìm Thấy",
    element: (
      <MainLayout>
        <NotFoundPage />
      </MainLayout>
    ),
  },

  {
    path: "/accountsetting",
    label: "Cài đặt tài khoản",
    element: (
      <PrivateRoute
        roles={["Quan Tri", "Giam Sat", "Nguoi Dan", "Nhan Vien", "Nguoi Dung"]}
      >
        <MainLayout>
          <SettingPage />
        </MainLayout>
      </PrivateRoute>
    ),
  },
];
