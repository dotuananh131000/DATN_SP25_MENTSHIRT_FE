import axios from "axios";
import apiClients from "../../../api/ApiClient";

const KhachHangService = {
  async getAllKH() {
    try {
      const response = await apiClients.get(
        `/ban-hang/khach-hang`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API khách hàng", error);
      throw error;
    }
  },
};
export default KhachHangService;
