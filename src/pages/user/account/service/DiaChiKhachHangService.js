import axios from "axios";

const DiaChiKhachHangService = {
    async diaChi(id){
        try{
            const response = await axios.get(`http://localhost:8080/api/dia-chi/khach-hang/${id}`);
            return response.data.data;
        }catch (error){
            throw error;
        }
        
    },
    async createDiaChi(request){
        try {
            const dataDiaChi = {
                id: request?.id ?? null,
                khachHangId: request?.khachHangId ?? null,
                tinhThanhId: request.tinhThanhId ?? null,
                tinhThanh: request.tinhThanh ?? null,
                quanHuyenId: request.quanHuyenId ?? null,
                quanHuyen: request.quanHuyen ?? null,
                phuongXaId: request.phuongXaId ?? null,
                phuongXa: request.phuongXa ?? null,
                diaChiChiTiet: request.diaChiChiTiet ?? null,
                trangThai: request.trangThai
            }
            console.log(dataDiaChi);
            const response = await axios.post(`http://localhost:8080/api/dia-chi`,dataDiaChi,
                {headers:{
                    "Content-Type":"application/json"
                }}
            )
            return response.data.data;
        }catch(error){
            console.log("Lỗi khi thêm địa chỉ mới", error);
            throw error;
        }
    },
    async UpdateDiaChi(request){
        try {
            const dataDiaChi = {
                id: request?.id ?? null,
                tinhThanhId: request.tinhThanhId ?? null,
                tinhThanh: request.tinhThanh ?? null,
                quanHuyenId: request.quanHuyenId ?? null,
                quanHuyen: request.quanHuyen ?? null,
                phuongXaId: request.phuongXaId ?? null,
                phuongXa: request.phuongXa ?? null,
                diaChiChiTiet: request.diaChiChiTiet ?? null,
                trangThai: request.trangThai
            }
            console.log(dataDiaChi);
            const response = await axios.put(`http://localhost:8080/api/dia-chi/${dataDiaChi.id}`,dataDiaChi,
                {headers:{
                    "Content-Type":"application/json"
                }}
            )
            return response.data.data;
        }catch(error){
            console.log("Lỗi khi cập nhật địa chỉ mới", error);
            throw error;
        }
    },
    async deleteDiaChi(id){
        try {
            const response = await axios.delete(`http://localhost:8080/api/dia-chi/${id}`);
            return response.data;
        }catch (error){
            throw error;
        }
    }
}
export default DiaChiKhachHangService;