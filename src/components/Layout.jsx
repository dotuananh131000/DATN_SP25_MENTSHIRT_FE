import { Outlet } from "react-router-dom";
import Header from "./Header";
import SlideBar from "./SlideBar";

function Layout() {
  return (
    <div className="layout">
      <SlideBar />
      <div className="right-layout">
        <Header />
        <main className="layout-main min-h-80">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default Layout;
