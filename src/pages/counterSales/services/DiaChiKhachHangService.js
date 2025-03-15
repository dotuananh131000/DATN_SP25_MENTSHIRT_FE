import axios from "axios";

const DiaChiKhacHangService = {
  async diaChi(id) {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/dia-chi/khach-hang/${id}`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API đia chỉ khách hàng");
      throw error;
    }
  },
};
export default DiaChiKhacHangService;
