import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx"; // Assuming you have a Navbar component
import Footer from "./Footer.jsx"; // Assuming you have a Footer component

function UserLayout() {
  return (
    <div className="user-layout">
      <Navbar />
      <main className="layout-main min-h-96">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;