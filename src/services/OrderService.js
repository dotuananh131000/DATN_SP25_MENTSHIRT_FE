import apiClient from "../api/ApiClient";
import API_ENDPOINTS from "../api/endPoints";

const OrderService = {
  async hoaDons(page = 0, size = 10, filters = {}){
    try {
      const params ={
        page,
        size,
        ngayBatDau: filters.ngayBatDau ? filters.ngayBatDau : "",
        ngayKetThuc: filters.ngayKetThuc ? filters.ngayKetThuc : "",
        keyword: filters.keyword ? filters.keyword : "",
        loaiDon: filters.loaiDon ? filters.loaiDon : "",
        trangThaiGiaoHang: filters.trangThaiGiaoHang ? filters.trangThaiGiaoHang : "",
      }
      const response = await apiClient.get("/hoa-don",
        {params}
      )

      return response.data.data;
    }catch(error) {
      throw error;
    }
  },
  
  async getOrderById(id){
    try {
      const response = await apiClient(`/hoa-don/${id}`);
      return response.data.data;
    }catch (error){
      throw error;
    }
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

  async tiepNhanHoaDon(idHD, idNV) {
    try{
      const idNhanVien = idNV ? idNV : null
      
      const response = await apiClient.put(`${API_ENDPOINTS.ORDERS.TIEPNHAN(idHD)}?idNhanVien=${idNhanVien}`);
      return response.data.data;
    }catch (err){
      console.log("Lỗi khi gọi API tiếp nhận nhân viên", err);
    }
  },
};

export default OrderService;
