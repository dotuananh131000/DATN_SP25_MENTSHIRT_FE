import axios from "axios";
import apiClients from "../../../api/ApiClient";

const PhieuGiamGiaService = {
  async getAllPhieuGiamGia() {
    try {
      const response = await apiClients.get(
        `/ban-hang/phieu-giam-gia`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi goi API phiếu giảm giá", error);
      throw error;
    }
  },
  async getPhieuGiamGiaKH(idKH) {
    try {
      const response = await apiClients.get(
        `/ban-hang/phieu-giam-gia-khach-hang/${idKH}`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API phiếu giảm giá khách hàng", error);
      throw error;
    }
  },
};
export default PhieuGiamGiaService;
