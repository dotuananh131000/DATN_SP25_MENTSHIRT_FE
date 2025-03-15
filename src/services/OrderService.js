import apiClient from "../api/ApiClient";
import API_ENDPOINTS from "../api/endPoints";

const OrderService = {
  getOrders: async (
    page = 0,
    size = 10,
    trangThai,
    ngayBatDau,
    ngayKetThuc,
    loaiDon,
    keyword
  ) => {
    let queryParams = new URLSearchParams({
      p: page,
      size: size,
    });

    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : null;

    if (trangThai !== null) queryParams.append("trangThaiGiaoHang", trangThai);

    if (ngayBatDau !== null)
      queryParams.append("ngayBatDau", formatDate(ngayBatDau));

    if (ngayKetThuc !== null)
      queryParams.append("ngayKetThuc", formatDate(ngayKetThuc));

    if (loaiDon !== null) queryParams.append("loaiDon", loaiDon);

    if (keyword !== null) queryParams.append("keyword", keyword);

    const url =
      keyword || ngayBatDau || ngayKetThuc || trangThai
        ? API_ENDPOINTS.ORDERS.SEARCH
        : API_ENDPOINTS.ORDERS.BASE;

    console.log(`${url}?${queryParams.toString()}`);

    const response = await apiClient.get(`${url}?${queryParams.toString()}`);
    return response.data;
  },
  getOrderCounts: async (filters) => {
    let queryParams = new URLSearchParams();

    if (filters.ngayBatDau)
      queryParams.append("ngayBatDau", filters.ngayBatDau);

    if (filters.ngayKetThuc)
      queryParams.append("ngayKetThuc", filters.ngayKetThuc);

    if (filters.loaiDon !== null)
      queryParams.append("loaiDon", filters.loaiDon);

    const response = await apiClient.get(
      `${API_ENDPOINTS.ORDERS.COUNT}?${queryParams.toString()}`
    );
    return response.data;
  },
};

export default OrderService;
