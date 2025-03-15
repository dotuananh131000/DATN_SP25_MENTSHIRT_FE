import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartPie,
  FaUserTie,
  FaStore,
  FaClipboardList,
  FaUsers,
  FaReply,
  FaChevronDown,
  FaCashRegister,
  FaGift,
  FaTshirt,
  FaShapes,
  FaTrademark,
  FaGlobe,
  FaMoneyBill,
} from "react-icons/fa";

function SlideBar() {
  const [activeMenu, setActiveMenu] = useState("thongKe");
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const toggleMenu = (menu) => {
    setActiveMenu(menu);
    if (menu === "quanLySanPham") setShowProductMenu(!showProductMenu);
    if (menu === "quanLyTaiKhoan") setShowAccountMenu(!showAccountMenu);
  };

  const productItems = [
    { label: "Sản phẩm", icon: <FaTshirt />, path: "product" },
    { label: "Chất liệu", icon: <FaShapes />, path: "material" },
    { label: "Cổ áo", icon: <FaShapes />, path: "collar" },
    { label: "Màu sắc", icon: <FaShapes />, path: "color" },
    { label: "Kích thước", icon: <FaShapes />, path: "size" },
    { label: "Tay áo", icon: <FaShapes />, path: "sleeve" },
    { label: "Thương hiệu", icon: <FaTrademark />, path: "brand" },
    { label: "Xuất xứ", icon: <FaGlobe />, path: "origin" },
  ];

  const accountItems = [
    { label: "Nhân Viên", icon: <FaUserTie />, path: "employee" },
    { label: "Khách Hàng", icon: <FaUsers />, path: "customer" },
  ];

  return (
    <div className="w-60 min-h-screen bg-base-200 shadow-lg p-4">
      <div className="flex justify-center mb-4">
        <img src="/public/logo.png" alt="Logo" className="w-24" />
      </div>

      <ul className="menu w-full ">
        <li>
          <Link
            to="/admin/statistic"
            className={`menu-item my-1 `}
            onClick={() => toggleMenu("thongKe")}
          >
            <FaChartPie /> Thống kê
          </Link>
        </li>

        <li>
          <Link
            to="/admin/counterSale"
            className={`menu-item my-1`}
            onClick={() => toggleMenu("banHangTaiQuay")}
          >
            <FaCashRegister /> Bán hàng tại quầy
          </Link>
        </li>

        <li>
          <Link
            to="/admin/order"
            className={`menu-item my-1`}
            onClick={() => toggleMenu("donHang")}
          >
            <FaClipboardList /> Quản lý hóa đơn
          </Link>
        </li>

        {/* Quản lý sản phẩm */}
        <li>
          <div
            className="menu-item my-1 flex justify-between"
            onClick={() => toggleMenu("quanLySanPham")}
          >
            <span className="flex items-center gap-2">
              <FaTshirt /> Quản lý sản phẩm
            </span>
            <FaChevronDown
              className={`transition ${showProductMenu ? "rotate-180" : ""}`}
            />
          </div>
          {showProductMenu && (
            <ul className="pl-4">
              {productItems.map((item) => (
                <li key={item.path}>
                  <Link to={`/admin/${item.path}`} className="menu-subitem">
                    {item.icon} {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Quản lý tài khoản */}
        <li>
          <div
            className="menu-item my-1 flex justify-between"
            onClick={() => toggleMenu("quanLyTaiKhoan")}
          >
            <span className="flex items-center gap-2">
              <FaUsers /> Quản lý tài khoản
            </span>
            <FaChevronDown
              className={`transition ${showAccountMenu ? "rotate-180" : ""}`}
            />
          </div>
          {showAccountMenu && (
            <ul className="pl-4">
              {accountItems.map((item) => (
                <li key={item.path}>
                  <Link to={`/admin/${item.path}`} className="menu-subitem">
                    {item.icon} {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li>
          <Link to="/admin/return" className="menu-item my-1 ">
            <FaReply /> Trả Hàng
          </Link>
        </li>
        <li>
          <Link to="/admin/promotion" className="menu-item my-1">
            <FaGift /> Khuyến mãi
          </Link>
        </li>
        <li>
          <Link to="/admin/voucher" className="menu-item my-1">
            <FaMoneyBill /> Phiếu giảm giá
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SlideBar;
