import axios from "axios";

const ProductService = {
    async getAllProducts(
        page = 0, 
        size = 10, 
        search = '', 
        sortBy = 'gia', 
        sortDir = 'desc', 
        filters = {}
    ) {
        try {
            const params = {
                page,
                size,
                search,
                sortBy,         
                sortDir,         
                thuongHieuIds: filters.thuongHieuIds?.join(',') || '',
                xuatXuIds: filters.xuatXuIds?.join(',') || '',
                chatLieuIds: filters.chatLieuIds?.join(',') || '',
                coAoIds: filters.coAoIds?.join(',') || '',
                tayAoIds: filters.tayAoIds?.join(',') || '',
                mauSacIds: filters.mauSacIds?.join(',') || '',
                kichThuocIds: filters.kichThuocIds?.join(',') || '',
                minPrice: filters.minPrice ?? '',
                maxPrice: filters.maxPrice ?? ''
            };
    
            const response = await axios.get(`http://localhost:8080/san-pham`, { params });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching product details:", error);
            throw error;
        }
    },
    
    
    async getThuongHieu(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/thuong-hieu`, {
                params: {
                    page,
                    size,
                    search,
                    sort: `${sortKey},${sortDirection}`
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching product details:", error);
            throw error;
        }
    },

    async getChatLieu(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/chat-lieu`, {
                params: {
                    page,
                    size,
                    search,
                    sort: sortKey,
                    direction: sortDirection
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching material:", error);
            throw error;
        }
    },

    async getCoAo(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/co-ao`, {
                params: {
                    page,
                    size,
                    search,
                    sort: sortKey,
                    direction: sortDirection
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching collar types:", error);
            throw error;
        }
    },

    async getKichThuoc(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/kich-thuoc`, {
                params: {
                    page,
                    size,
                    search,
                    sort: sortKey,
                    direction: sortDirection
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching sizes:", error);
            throw error;
        }
    },

    async getMauSac(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/mau-sac`, {
                params: {
                    page,
                    size,
                    search,
                    sort: sortKey,
                    direction: sortDirection
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching colors:", error);
            throw error;
        }
    },

    async getTayAo(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/tay-ao`, {
                params: {
                    page,
                    size,
                    search,
                    sort: `${sortKey},${sortDirection}`
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching sleeve types:", error);
            throw error;
        }
    },

    async getXuatXu(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/xuat-xu`, {
                params: {
                    page,
                    size,
                    search,
                    sort: `${sortKey},${sortDirection}`
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching origins:", error);
            throw error;
        }
    },
};

export default ProductService;