import axios from "axios";
import apiClients from "../../../api/ApiClient";

const MapGiaSanPham = {
  async MapProduct() {
    try {
      const response = await apiClients.get(
        `/ban-hang/mapGiaSPCT`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API danh sách giá của sản phẩm", error);
      throw error;
    }
  },
};

export default MapGiaSanPham;
