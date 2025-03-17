import axios from "axios";
import apiClients from "../../../api/ApiClient";

const Year = {
  async DoanhThuTrongnam() {
    try {
      const response = await apiClients.get(
        "/thong-ke/doanh-thu-trong-nam"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API doanh thu trong năm", error);
      throw error;
    }
  },
  async SoLuongSPDaBanTrongNam() {
    try {
      const response = await apiClients.get(
        "/thong-ke/so-luong-da-ban-trong-nam"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API số lượng trong năm", error);
      throw error;
    }
  },
  async SoLuongHoaDonTrongNam() {
    try {
      const response = await apiClients.get(
        "/thong-ke/so-luong-hoa-don-trong-nam"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API hóa đơn trong năm", error);
      throw error;
    }
  },
};

export default Year;
