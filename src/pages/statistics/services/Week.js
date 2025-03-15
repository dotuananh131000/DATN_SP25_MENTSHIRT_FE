import axios from "axios";

const Week = {
  async DoanhThuTrongTuan() {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/thong-ke/doanh-thu-trong-tuan"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API doanh thu trong tuần", error);
      throw error;
    }
  },
  async SoLuongSPDaBanTrongTuan() {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/thong-ke/so-luong-da-ban-trong-tuan"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API số lượng trong tuần", error);
      throw error;
    }
  },
  async SoLuongHoaDonTrongTuan() {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/thong-ke/so-luong-hoa-don-trong-tuan"
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API hóa đơn trong tuần", error);
      throw error;
    }
  },
};

export default Week;
