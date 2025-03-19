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

function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/" element={<UserLayout />}>
             {userRoutes.map((route, index) => (
               <Route
                 key={index}
                 path={route.path}
                 element={<route.component />}
               />
             ))}
           </Route>

           
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />
          <Route path="/login" element={<Login/>}/>

          <Route path="/admin" element={<Layout />}>
            {adminRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Route>
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRouter;
