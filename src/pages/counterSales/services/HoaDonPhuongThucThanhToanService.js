import axios from "axios";

const HoaDonPhuongThucThanhToan = {
  async getList(idHD) {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/hdpttt/${idHD}`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi gọi API hóa đơn phương thức thanh toán", error);
      throw error;
    }
  },
  async AdHDPTTT(data) {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/hdpttt/add`,
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
