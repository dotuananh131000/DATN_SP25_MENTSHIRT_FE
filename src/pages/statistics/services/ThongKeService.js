import axios from "axios";
import apiClients from "../../../api/ApiClient";

const ThongKeService = {
  async TopSelling(page) {
    try {
      const response = await apiClients.get(
        `/thong-ke/top-san-pham`,
        {
          params: {
            page: page || 0,
            size: 5,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API top dản phẩm bán chạy", error);
      throw error;
    }
  },
  async SanPhamGanHet(page) {
    try {
      const response = await apiClients.get(
        `/thong-ke/san-pham-gan-het`,
        {
          params: {
            page: page || 0,
            size: 5,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API sản phẩm gần hết", error);
      throw error;
    }
  },
  async countDonHang(ngayBatDau, ngayKetThuc) {
    // console.log(ngayBatDau, ngayKetThuc);
    try {
      const response = await apiClients.get(
        `/thong-ke/so-luong-trang-thai-don-hang`,
        {
          params: {
            ngayBatDau: ngayBatDau,
            ngayKetThuc: ngayKetThuc,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API đếm hóa đơn", error);
      throw error;
    }
  },
};
export default ThongKeService;
