import { Suspense } from "react";
import UserLayout from "../components/UserLayout";

import userRoutes from "./UserRouter";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "../components/Layout";
import adminRoutes from "./AdminRouter";
import Login from "../auth/login";
import { useSelector } from "react-redux";
import PrivateRounte from "./PrivateRouter";

function AppRouter() {

  const user = useSelector((state) => state.auth.user);  // Lấy user từ Redux
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
        {/* Route gốc, chuyển hướng đến trang home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Các route cho người dùng bình thường (client) */}
          <Route path="/" element={<UserLayout />}>
          {userRoutes.map((route, index) => (
          <Route
          key={index}
          path={route.path}
          element={<route.component />}
          />
            ))}
          </Route>

           
            {/* Route Login (Không yêu cầu đăng nhập trước) */}
            <Route path="/login" element={<Login />} />

           {/* Các route cho admin, được bảo vệ bởi PrivateRoute */}
           <Route path="/admin" element={user ? <PrivateRounte /> : <Navigate to="/login" />}>
           <Route path="/admin" element={<Layout />}> {/* Đảm bảo Layout được render */}
              {user && adminRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
            </Route>
          </Route>
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRouter;
