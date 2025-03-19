import { lazy } from "react";

const Home = lazy(() => import("../pages/user/home/Home.jsx"));
const ProductList = lazy(() => import("../pages/user/product/ProductList.jsx"));
const ProductDetail = lazy(() => import("../pages/user/detail/ProductDetail.jsx"));
const Cart = lazy(() => import("../pages/user/cart/Cart.jsx"));
const Payment = lazy(() => import("../pages/user/pay/Payment.jsx"));
const OrderHistory = lazy(() => import("../pages/user/order/OrderHistory.jsx"));
const ChangePassword = lazy(() => import("../pages/user/account/ChangePassword.jsx"));
const UserProfile = lazy(() => import("../pages/user/account/UserProfile.jsx"));

const userRoutes = [
  { path: "home", component: Home, role:"user" },
  { path: "products", component: ProductList , role:"user" },
  { path: "product/:sanPhamId", component: ProductDetail , role:"user" },
  { path: "cart", component: Cart , role:"user" },
  { path: "pay", component: Payment , role:"user" },
  { path: "order-history", component: OrderHistory, role:"user"  },
  { path: "change-password", component: ChangePassword, role:"user"  },
  { path: "profile", component: UserProfile, role:"user"  },
];

export default userRoutes;