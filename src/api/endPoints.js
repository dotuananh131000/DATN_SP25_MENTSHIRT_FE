const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const API_ENDPOINTS = {
  ORDERS: {
    BASE: `${API_BASE_URL}/hoa-don/hien-thi`,
    ADDORCOUNTER: `${API_BASE_URL}/hoa-don`,
    SEARCH: `${API_BASE_URL}/hoa-don/search`,
    COUNT: `${API_BASE_URL}/hoa-don/count`,
    TIEPNHAN: (idHD) => `${API_BASE_URL}/hoa-don/${idHD}`,
    GETBYMA: (maHoaDon) => `${API_BASE_URL}/hoa-don/getByMa/${maHoaDon}`,
    PAIDINVOICE: (idHD) => `${API_BASE_URL}/hoa-don/paid/${idHD}`,
    UPDATEINFOINVOICE: `${API_BASE_URL}/hoa-don/updateInfo`,
    CANCELINVOICE: (idHD) => `${API_BASE_URL}/hoa-don/cancel/${idHD}`,
    WAITORDERS: `${API_BASE_URL}/hoa-don/cho`,
    CHONKHACHHANG: (idHD) =>  `${API_BASE_URL}/hoa-don/chon-khach-hang/${idHD}`,
    BOKHACHHANG: (idHD) =>  `${API_BASE_URL}/hoa-don/bo-khach-hang/${idHD}`,
    DOILOAIDON: (idHD) =>  `${API_BASE_URL}/hoa-don/doi-loai-don/${idHD}`
  },

  DETAILORDERS: {
    BASE: `${API_BASE_URL}/hdct/hien-thi`,
    GETBYID: (idHD) =>  `${API_BASE_URL}/hdct/${idHD}`,
    ADD: `${API_BASE_URL}/hdct`,
    DELETE:(idHDCT) => `${API_BASE_URL}/hdct/${idHDCT}`,
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
    ADDRESSLIST: (idKH) => `${API_BASE_URL}/dia-chi/khach-hang/${idKH}`
  },

  CUSTOMER: {
    CHANGEPASSWORD: (id) => `${API_BASE_URL}/khach-hang/changePassword/${id}`,
    GETBYID: (id) => `${API_BASE_URL}/khach-hang/${id}`,
    SIGNUP: `${API_BASE_URL}/khach-hang/sign-up`,
    THEMNHANH: `${API_BASE_URL}/khach-hang/themNhanh`,
    GETALL: `${API_BASE_URL}/khach-hang`
  },

  NOTIFICATION: {
    GETALL: (id) => `${API_BASE_URL}/thong-bao/${id}`,
    SEEN : (idTB) => `${API_BASE_URL}/thong-bao/${idTB}`
  },

  HDPTTTT : {
    ADD :`${API_BASE_URL}/hdpttt/add`,
    GETALLBYIDHD: (idHD) => `${API_BASE_URL}/hdpttt/${idHD}` 
  },

  PRODUCT: {
    GETALLACTIVE: `${API_BASE_URL}/san-pham-chi-tiet/active`,
  },

};
export default API_ENDPOINTS;
export const TOKEN_GHN = "cfbc877c-f2a2-11ef-b8bc-72b37b984ae4";
export const GHN_ID = 5653296;
