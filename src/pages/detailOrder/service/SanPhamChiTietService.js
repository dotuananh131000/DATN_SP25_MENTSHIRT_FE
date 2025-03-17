import axios from "axios";
import apiClients from "../../../api/ApiClient";
const SanPhamChiTietService = {
  async GetAll() {
    try {
      const response = await apiClients.get(
        `/san-pham-chi-tiet/hien-thi`
      );
      return response.data;
    } catch (error) {
      console.log("lỗi lấy dữ liệu sản phẩm", error);
      throw error;
    }
  },
};
export default SanPhamChiTietService;
