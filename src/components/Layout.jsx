import { Outlet } from "react-router-dom";
import Header from "./Header";
import SlideBar from "./SlideBar";

function Layout() {
  return (
    <div className="layout">
      <SlideBar />
      <div className="right-layout">
        <Header />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default Layout;
