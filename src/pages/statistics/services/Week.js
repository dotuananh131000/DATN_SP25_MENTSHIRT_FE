import axios from "axios";
import apiClients from "../../../api/ApiClient";

const Week = {
  async DoanhThuTrongTuan() {
    try {
      const response = await apiClients.get(
        "/thong-ke/doanh-thu-trong-tuan"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API doanh thu trong tuần", error);
      throw error;
    }
  },
  async SoLuongSPDaBanTrongTuan() {
    try {
      const response = await apiClients.get(
        "/thong-ke/so-luong-da-ban-trong-tuan"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API số lượng trong tuần", error);
      throw error;
    }
  },
  async SoLuongHoaDonTrongTuan() {
    try {
      const response = await apiClients.get(
        "/thong-ke/so-luong-hoa-don-trong-tuan"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API hóa đơn trong tuần", error);
      throw error;
    }
  },
};

export default Week;
