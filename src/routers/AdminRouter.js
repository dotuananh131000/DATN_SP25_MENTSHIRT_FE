import { lazy } from "react";

const customer = lazy(() => import("../pages/customers/Customer"));
const returnItem = lazy(() => import("../pages/returns/Return"));
const Statistic = lazy(() => import("../pages/statistics/Statistic"));
const product = lazy(() => import("../pages/products/Product"));
const addProduct = lazy(() => import("../pages/products/AddProduct"));
const productDetail = lazy(() => import("../pages/details/ProductDetail"));
const brand = lazy(() => import("../pages/attributes/Brand"));
const collar = lazy(() => import("../pages/attributes/Collar"));
const color = lazy(() => import("../pages/attributes/Color"));
const material = lazy(() => import("../pages/attributes/Material"));
const origin = lazy(() => import("../pages/attributes/Origin"));
const size = lazy(() => import("../pages/attributes/Size"));
const sleeve = lazy(() => import("../pages/attributes/Sleeve"));
const employee = lazy(() => import("../pages/employees/Employee"));
const order = lazy(() => import("../pages/orders/Order"));
const discount = lazy(() => import("../pages/discounts/Discount"));
const detailOrder = lazy(() => import("../pages/detailOrder/DetailOrder"));
const counterSale = lazy(() => import("../pages/counterSales/CounterSale"));
const voucher = lazy(() => import("../pages/voucher/Voucher"));

const adminRoutes = [
  { path: "customer", component: customer, role: "admin" },
  { path: "return", component: returnItem, role: "admin" },
  { path: "statistic", component: Statistic, role: "admin" },
  { path: "product", component: product, role: "admin" },
  { path: "product/new", component: addProduct, role: "admin" },
  { path: "product/:maSanPham", component: productDetail, role: "admin" },
  { path: "brand", component: brand, role: "admin" },
  { path: "collar", component: collar, role: "admin" },
  { path: "color", component: color, role: "admin" },
  { path: "material", component: material, role: "admin" },
  { path: "origin", component: origin, role: "admin" },
  { path: "size", component: size, role: "admin" },
  { path: "sleeve", component: sleeve, role: "admin" },
  { path: "employee", component: employee, role: "admin" },
  { path: "order", component: order, role: "admin" },
  { path: "discount", component: discount, role: "admin" },
  { path: "detailOrder/:id", component: detailOrder, role: "admin" },
  { path: "counterSale", component: counterSale, role: "admin" },
  { path: "voucher", component: voucher, role: "admin" },
];

export default adminRoutes;