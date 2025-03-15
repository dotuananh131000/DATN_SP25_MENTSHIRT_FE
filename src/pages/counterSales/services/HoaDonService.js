import axios from "axios";

const HoaDonService = {
  async AddHoaDon(data) {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/ban-hang`,
        data
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi thêm hóa đơn");
      throw error;
    }
  },
  async UpdateKhachHang(id, idKH) {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/ban-hang/update-hoa-don/${id}`,
        JSON.stringify(idKH),
        {
          headers: {
            "Content-Type": "application/json", // Đảm bảo gửi Content-Type là application/json
          },
        }
      );
      if (response.status == 200) {
        return response.data;
      } else {
        console.log("Cập nhật số lượng thất bại");
        return null;
      }
    } catch (error) {
      console.log("Lỗi khi gọi API cập nhật khách hàng", error);
      throw error;
    }
  },

  async UpdateTrangThaiHD(id) {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/ban-hang/update-trang-thai/${id}`
      );
      if (response.status == 200) {
        return response.data;
      } else {
        console.log("Cập nhật trạng thái thất bại");
        return null;
      }
    } catch (error) {
      console.log("Lỗi khi gọi API cập nhật trạng thái", error);
      throw error;
    }
  },
  async UpdateLoaiDonOnline(id) {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/ban-hang/update-loai-don-online/${id}`
      );
      if (response.status == 200) {
        return response.data;
      } else {
        console.log("Cập nhật loại đơn thất bại");
        return null;
      }
    } catch (error) {
      console.log("Lỗi khi gọi API cập nhật loại đơn", error);
      throw error;
    }
  },
  async UpdateLoaiDonOffline(id) {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/ban-hang/update-loai-don-offline/${id}`
      );
      if (response.status == 200) {
        return response.data;
      } else {
        console.log("Cập nhật loại đơn thất bại");
        return null;
      }
    } catch (error) {
      console.log("Lỗi khi gọi API cập nhật loại đơn", error);
      throw error;
    }
  },
  async UpdateTrangThaiDonHang(id) {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/ban-hang/update-trang-thai-don-hang/${id}`
      );
      if (response.status == 200) {
        return response.data;
      } else {
        console.log("Cập nhật đơn hàng thất bại");
        return null;
      }
    } catch (error) {
      console.log("Lỗi khi gọi API cập nhật đơn hàng", error);
      throw error;
    }
  },

  async HoaDonHomNay() {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/ban-hang/hoa-don-hom-nay`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi lấy hóa đơn hôm nay");
      throw error;
    }
  },
  async ThemSPVaoGioHang(data) {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/ban-hang/addHdct`,
        data
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi gọi API thêm hóa đơn chi tiết", error);
      throw error;
    }
  },
  async AutoPhieuGiamGiaTotNhat(id) {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/ban-hang/auto-pggtn/${id}`
      );
      if (response.status == 200) {
        // console.log(response.data);
        return response.data;
      } else {
        console.log("Cập nhật trạng thái thất bại");
        return null;
      }
    } catch (error) {
      console.log("Lỗi khi gọi API auto phiếu giảm giá tốt nhất", error);
      throw error;
    }
  },
  async deleteKhachHang(id) {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/ban-hang/deleteKhachHang/${id}`
      );
      if (response.status === 200) {
        return response.data;
      } else {
        console.log("Có lỗi khi goi API xóa khách hàng");
      }
    } catch (error) {
      console.log("Lỗi khi goi API xóa khách hàng khỏi hóa đơn");
      throw error;
    }
  },
  async updateThongTinDonHang(id, data) {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/ban-hang/updateThongTinDonHang/${id}`,
        data
      );
      if (response.status === 200) {
        return response.data;
      } else {
        console.log("lỗi khi gọi API cập nhật thông tin");
      }
    } catch (error) {
      console.log("Lỗi khi gọi API cập nhật thông tin đơn hàng");
      throw error;
    }
  },
};
export default HoaDonService;
