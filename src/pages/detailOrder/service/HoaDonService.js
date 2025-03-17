import axios from "axios";
import apiClients from "../../../api/ApiClient";
const HoaDonService = {
  async getHoaDon(maHoaDon) {
    try {
      const response = await apiClients.get(
        `/hoa-don/${maHoaDon}`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu hóa đơn theo mã", error);
      throw error;
    }
  },
  async ThemSPVaoGioHang(data) {
    try {
      const response = await apiClients.post(
        `/ban-hang/addHdct`,
        data
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API thêm hóa đơn chi tiết", error);
      throw error;
    }
  },
  async UpdateTrangThaiDonHang(id) {
    try {
      const response = await apiClients.put(
        `/ban-hang/update-trang-thai-don-hang/${id}`
      );
      if (response.status == 200) {
        return response.data;
      } else {
        console.log("Cập nhật đơn hàng thất bại");
        return null;
      }
    } catch (error) {
      console.log("Lỗi khi gọi API cập nhật đơn hàng", error);
      throw error;
    }
  },
};
export default HoaDonService;
