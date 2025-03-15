import axios from "axios";

const Month = {
  async DoanhThuTrongThang() {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/thong-ke/doanh-thu-trong-thang"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API doanh thu trong tháng", error);
      throw error;
    }
  },
  async SoLuongSPDaBanTrongThang() {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/thong-ke/so-luong-da-ban-trong-thang"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API số lượng trong tháng", error);
      throw error;
    }
  },
  async SoLuongHoaDonTrongThang() {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/thong-ke/so-luong-hoa-don-trong-thang"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API hóa đơn trong tháng", error);
      throw error;
    }
  },
};

export default Month;
