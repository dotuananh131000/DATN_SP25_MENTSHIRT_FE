import axios from "axios";

const ProductDetailService = {
    async getAllProductDetails(page = 0, size = 10, search = '', sortField = 'id', sortDirection = 'desc', filters = {}) {
        try {
            const params = {
                page,
                size,
                search,
                sort: `${sortField},${sortDirection}`, 
                thuongHieuIds: filters.thuongHieuIds ? filters.thuongHieuIds.join(',') : '',
                xuatXuIds: filters.xuatXuIds ? filters.xuatXuIds.join(',') : '',
                chatLieuIds: filters.chatLieuIds ? filters.chatLieuIds.join(',') : '',
                coAoIds: filters.coAoIds ? filters.coAoIds.join(',') : '',
                tayAoIds: filters.tayAoIds ? filters.tayAoIds.join(',') : '',
                mauSacIds: filters.mauSacIds ? filters.mauSacIds.join(',') : '',
                kichThuocIds: filters.kichThuocIds ? filters.kichThuocIds.join(',') : '',
                minPrice: filters.minPrice ?? '',  
                maxPrice: filters.maxPrice ?? ''   
            };
    
            const response = await axios.get(`http://localhost:8080/api/san-pham-chi-tiet`, { params });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching product details:", error);
            throw error;
        }
    },
    

    async getDetailByProductId(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/san-pham/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product data:", error);
            throw error;
        }
    },

    async getProductDetailById(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/san-pham-chi-tiet/${id}`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching product detail:", error);
            throw error;
        }
    },

    async createProductDetail(productDetailData) {
        try {
            const response = await axios.post(`http://localhost:8080/api/san-pham-chi-tiet`, productDetailData);
            return response.data.data;
        } catch (error) {
            console.error("Error creating product detail:", error);
            throw error;
        }
    },

    async updateProductDetail(id, productDetailData) {
        try {
            const response = await axios.put(`http://localhost:8080/api/san-pham-chi-tiet/${id}`, productDetailData);
            return response.data.data;
        } catch (error) {
            console.error("Error updating product detail:", error);
            throw error;
        }
    },

    async toggleProductDetailStatus(id) {
        try {
            const response = await axios.patch(`http://localhost:8080/api/san-pham-chi-tiet/${id}/toggle`);
            return response.data.data;
        } catch (error) {
            console.error("Error toggling product detail status:", error);
            throw error;
        }
    },

    async deleteProductDetail(id) {
        try {
            const response = await axios.delete(`http://localhost:8080/api/san-pham-chi-tiet/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting product detail:", error);
            throw error;
        }
    },

    async generateProductDetails(generateModel) {
        try {
            const response = await axios.post(`http://localhost:8080/api/san-pham-chi-tiet/generate`, generateModel);
            return response.data.data;
        } catch (error) {
            console.error("Error generating product details:", error);
            throw error;
        }
    },

    async getThuongHieu(page = 0, size = 1000, search = '') {
        try {
            const response = await axios.get(`http://localhost:8080/api/thuong-hieu`, {
                params: {
                    page,
                    size,
                    search,
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching product details:", error);
            throw error;
        }
    },

    async getChatLieu(page = 0, size = 1000, search = '') {
        try {
            const response = await axios.get(`http://localhost:8080/api/chat-lieu`, {
                params: {
                    page,
                    size,
                    search,
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching material:", error);
            throw error;
        }
    },

    async getCoAo(page = 0, size = 1000, search = '') {
        try {
            const response = await axios.get(`http://localhost:8080/api/co-ao`, {
                params: {
                    page,
                    size,
                    search,
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching collar types:", error);
            throw error;
        }
    },

    async getKichThuoc(page = 0, size = 1000, search = '') {
        try {
            const response = await axios.get(`http://localhost:8080/api/kich-thuoc`, {
                params: {
                    page,
                    size,
                    search,
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching sizes:", error);
            throw error;
        }
    },

    async getMauSac(page = 0, size = 1000, search = '') {
        try {
            const response = await axios.get(`http://localhost:8080/api/mau-sac`, {
                params: {
                    page,
                    size,
                    search,
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching colors:", error);
            throw error;
        }
    },

    async getTayAo(page = 0, size = 1000, search = '') {
        try {
            const response = await axios.get(`http://localhost:8080/api/tay-ao`, {
                params: {
                    page,
                    size,
                    search,
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching sleeve types:", error);
            throw error;
        }
    },

    async getThuongHieu(page = 0, size = 1000, search = '') {
        try {
            const response = await axios.get(`http://localhost:8080/api/thuong-hieu`, {
                params: {
                    page,
                    size,
                    search,
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching brands:", error);
            throw error;
        }
    },

    async getXuatXu(page = 0, size = 1000, search = '') {
        try {
            const response = await axios.get(`http://localhost:8080/api/xuat-xu`, {
                params: {
                    page,
                    size,
                    search,
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching origins:", error);
            throw error;
        }
    }
};

export default ProductDetailService;