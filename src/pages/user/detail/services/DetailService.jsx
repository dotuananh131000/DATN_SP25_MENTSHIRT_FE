import axios from "axios";

const DetailService = {
    async getAttributesByProductId(sanPhamId) {
        try {
            const response = await axios.get(`http://localhost:8080/san-pham-chi-tiet/thuoc-tinh`, {
                params: { sanPhamId }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching product attributes:", error);
            throw error;
        }
    },

    async getProductDetail(sanPhamId, chatLieuId, coAoId, kichThuocId, mauSacId, tayAoId, thuongHieuId, xuatXuId) {
        try {
            const response = await axios.get(`http://localhost:8080/san-pham-chi-tiet/chi-tiet`, {
                params: {
                    sanPhamId,
                    chatLieuId,
                    coAoId,
                    kichThuocId,
                    mauSacId,
                    tayAoId,
                    thuongHieuId,
                    xuatXuId
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching product details:", error);
            throw error;
        }
    }
};

export default DetailService;