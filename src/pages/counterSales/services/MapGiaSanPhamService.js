import axios from "axios";

const MapGiaSanPham = {
  async MapProduct() {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/ban-hang/mapGiaSPCT`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API danh sách giá của sản phẩm", error);
      throw error;
    }
  },
};

export default MapGiaSanPham;
