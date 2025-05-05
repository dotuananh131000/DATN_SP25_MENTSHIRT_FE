import axios from "axios"

const Voucher = {
    async lisVoucher(idKh){
        try {
            const response = await axios.get(`http://localhost:8080/phieu-giam-gia/${idKh}`)
            return response.data.data
        }catch (error) {
            throw error;
        }
    },
}
export default Voucher;