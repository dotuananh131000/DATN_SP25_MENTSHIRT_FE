import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx"; // Assuming you have a Navbar component
import Footer from "./Footer.jsx"; // Assuming you have a Footer component
import {motion} from "framer-motion"

function UserLayout() {
  return (
    <motion.div className="user-layout "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Navbar />
      <main className="layout-main min-h-96 mt-[76px]">
        <Outlet />
      </main>
      <Footer />
    </motion.div>
  );
}

export default UserLayout;