import axios from "axios";
import apiClients from "../../../api/ApiClient";

const HoaDonPhuongThucThanhToan = {
  async getList(idHD) {
    try {
      const response = await apiClients.get(
        `/hdpttt/${idHD}`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi gọi API hóa đơn phương thức thanh toán", error);
      throw error;
    }
  },
  async AdHDPTTT(data) {
    try {
      const response = await apiClients.post(
        `/hdpttt/add`,
        data
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API thêm hóa đơn phương thức thanh toán");
      throw error;
    }
  },
};
export default HoaDonPhuongThucThanhToan;
