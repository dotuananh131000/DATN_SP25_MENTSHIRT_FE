import axios from "axios";
const SanPhamChiTietService = {
  async GetAll() {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/san-pham-chi-tiet/hien-thi`
      );
      return response.data;
    } catch (error) {
      console.log("lỗi lấy dữ liệu sản phẩm", error);
      throw error;
    }
  },
};
export default SanPhamChiTietService;
