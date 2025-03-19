import apiClients from "../../../api/ApiClient";

const DiaChiKhacHangService = {
  async diaChi(id) {
    try {
      const response = await apiClients.get(
        `/dia-chi/khach-hang/${id}`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API đia chỉ khách hàng");
      throw error;
    }
  },
};
export default DiaChiKhacHangService;
