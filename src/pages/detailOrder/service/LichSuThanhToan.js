import apiClients from "../../../api/ApiClient"

const LichSuThanhToan = {
    async getAll(idHD){
        try{
            const response = await apiClients.get(`/hdpttt/${idHD}`)
            return response.data
        }catch(error){
            throw error;
        }
    }

}
export default LichSuThanhToan;