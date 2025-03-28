import axios from "axios";
import apiClients from "../../../api/ApiClient";

const TodayService = {
  async doanThuHomNay() {
    try {
      const response = await apiClients.get(
        `/thong-ke/doanh-thu-hom-nay`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API doanh thu hôm nay", error);
      throw error;
    }
  },
  async soLuongSanPham() {
    try {
      const response = await apiClients.get(
        `/thong-ke/so-luong-da-ban-hom-nay`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API số lượng sản phẩm đã bán hôm nay", error);
      throw error;
    }
  },
  async soLuongHoaDon() {
    try {
      const response = await apiClients.get(
        `/thong-ke/so-luong-hoa-don-hom-nay`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API số lượng hóa đơn hôm nay", error);
      throw error;
    }
  },
};
export default TodayService;
