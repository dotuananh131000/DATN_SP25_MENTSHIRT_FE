import axios from "axios";

const HoaDonOnline = {
    async HoaDonByKH (idKH) {
        try {
            const response = await axios.get(`http://localhost:8080/api/hoa-don/khach-hang/${idKH}`);
            return response.data.data;
        }catch (error){
            throw error;
        }
    }
}
export default HoaDonOnline;