import axios from "axios";
import apiClients from "../../../api/ApiClient";

const HoaDonChiTietService = {
  async getSPCTByIDHoaDon(idHoaDon) {
    try {
      const response = await apiClients.get(
        `/hdct/${idHoaDon}`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi api hóa đơn chi tiết", error);
      throw error;
    }
  },

  async updateSoLuongHDCT(idHDCT, newQuantity) {
    try {
      // Gửi yêu cầu PUT với số lượng mới được đóng gói trong một đối tượng JSON
      const response = await apiClients.put(
        `/ban-hang/update-quantity/${idHDCT}`,
        // Đảm bảo gửi số lượng mới dưới dạng một đối tượng JSON
        JSON.stringify(newQuantity),
        {
          headers: {
            "Content-Type": "application/json", // Đảm bảo gửi Content-Type là application/json
          },
        }
      );

      if (response.status === 200) {
        // console.log("Cập nhật số lượng thành công: ", response.data);
        return response.data;
      } else {
        console.log("Cập nhật số lượng thất bại.");
        return null;
      }
    } catch (error) {
      console.log("Lỗi khi gọi API cập nhật số lượng", error);
      throw error;
    }
  },

  async deleteHDCT(id) {
    try {
      const response = await apiClients.delete(
        `/ban-hang/deleteHDCT/${id}`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi lấy API xóa hóa đơn chi tiết", error);
      throw error;
    }
  },
  async reloadHDCT(id) {
    try {
      const response = await apiClients.put(
        `/ban-hang/reloadHDCT/${id}`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi goi API reload HDCT", error);
      throw error;
    }
  },
};

export default HoaDonChiTietService;
