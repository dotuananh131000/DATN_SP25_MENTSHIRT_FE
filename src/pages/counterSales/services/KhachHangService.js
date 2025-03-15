import axios from "axios";

const KhachHangService = {
  async getAllKH() {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/ban-hang/khach-hang`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API khách hàng", error);
      throw error;
    }
  },
};
export default KhachHangService;
