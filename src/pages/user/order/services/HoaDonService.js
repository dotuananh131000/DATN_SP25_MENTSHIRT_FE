import axios from "axios";

const HoaDonOnline = {
    async HoaDonByKH (page = 0, idKH, keyword, trangThaiGiaoHang) {
        try {
            const params = {
                page: page,
                keyword: keyword || null,
                trangThaiGiaoHang: Number(trangThaiGiaoHang) || null
            }
            const response = await axios.get(`http://localhost:8080/api/hoa-don/khach-hang/${idKH}`,
                {params}
            );
            return response.data.data;
        }catch (error){
            console.log("Lỗi khi gọi API danh sách hóa đơn")
            throw error;
        }
    }
}
export default HoaDonOnline;