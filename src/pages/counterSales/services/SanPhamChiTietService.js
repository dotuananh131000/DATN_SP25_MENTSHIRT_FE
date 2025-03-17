import axios from "axios";
import apiClients from "../../../api/ApiClient";
const SanPhamChiTietService = {
  async GetAll(page = 0, size = 10, search = '', filters = {}) {
    try {
      const params = {
        page,
        size,
        search,
        thuongHieuIds: filters.thuongHieuIds ? filters.thuongHieuIds.join(',') : '',
        xuatXuIds: filters.xuatXuIds ? filters.xuatXuIds.join(',') : '',
        chatLieuIds: filters.chatLieuIds ? filters.chatLieuIds.join(',') : '',
        coAoIds: filters.coAoIds ? filters.coAoIds.join(',') : '',
        tayAoIds: filters.tayAoIds ? filters.tayAoIds.join(',') : '',
        mauSacIds: filters.mauSacIds ? filters.mauSacIds.join(',') : '',
        kichThuocIds: filters.kichThuocIds ? filters.kichThuocIds.join(',') : '',
    };
      const response = await apiClients.get(
        `/san-pham-chi-tiet`,
        {params}
      );
      return response.data.data;
    } catch (error) {
      console.log("lỗi lấy dữ liệu sản phẩm", error);
      throw error;
    }
  },
  async GetById(id){
    try{
      const response = await apiClients.get(`/san-pham-chi-tiet/${id}`);
      return response.data.data
    }catch(error){
      console.log("Lỗi khi gọi api sản phẩm chi tiết", error);
      throw error;
    }
  }
};
export default SanPhamChiTietService;
