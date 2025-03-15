import axios from "axios";
const HoaDonService = {
  async getHoaDon(maHoaDon) {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/hoa-don/${maHoaDon}`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu hóa đơn theo mã", error);
      throw error;
    }
  },
  async ThemSPVaoGioHang(data) {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/ban-hang/addHdct`,
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
      const response = await axios.put(
        `http://localhost:8080/api/ban-hang/update-trang-thai-don-hang/${id}`
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
