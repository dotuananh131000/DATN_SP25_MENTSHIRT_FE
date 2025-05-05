import axios from "axios"

const Voucher = {
    async lisVoucher(idKH) {
    
        try {
            const response = await axios.get('http://localhost:8080/phieu-giam-gia', {
                params: { idKH }
            });
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy phiếu giảm giá:", error);
            throw error;
        }
    }
}
export default Voucher;