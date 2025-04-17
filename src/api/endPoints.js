const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const API_ENDPOINTS = {
  ORDERS: {
    BASE: `${API_BASE_URL}/hoa-don/hien-thi`,
    SEARCH: `${API_BASE_URL}/hoa-don/search`,
    COUNT: `${API_BASE_URL}/hoa-don/count`,
    TIEPNHAN: (idHD) => `${API_BASE_URL}/hoa-don/${idHD}`,
  },
  DETAILORDERS: {
    BASE: `${API_BASE_URL}/hdct/hien-thi`,
  },
  VOUCHERS: {
    BASE: `${API_BASE_URL}/phieu-giam-gia/hien-thi`,
  },

  CHANGEPASSWORD:(id) => `${API_BASE_URL}/nhan-vien/changePassword/${id}`,

  ORDERHISTORIES: {
    CREATE: `${API_BASE_URL}/lich-su-hoa-don`,
    GETALL:(id) => `${API_BASE_URL}/lich-su-hoa-don/${id}`
  },
  ADDRESS: {
    DEFAULTADDRESS: (idKH) => `${API_BASE_URL}/dia-chi/dia-chi-mac-dinh/${idKH}`,
  },
  CUSTOMER: {
    CHANGEPASSWORD: (id) => `${API_BASE_URL}/khach-hang/changePassword/${id}`,
  },
  NOTIFICATION: {
    GETALL: (id) => `${API_BASE_URL}/thong-bao/${id}`,
    SEEN : (idTB) => `${API_BASE_URL}/thong-bao/${idTB}`
  }
};
export default API_ENDPOINTS;
export const TOKEN_GHN = "cfbc877c-f2a2-11ef-b8bc-72b37b984ae4";
export const GHN_ID = 5653296;
