import axios from "axios";

const SleeveService = {
    async getAll(page = 0, size = 10, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/tay-ao`, {
                params: {
                    page,
                    size,
                    search,
                    sort: `${sortKey},${sortDirection}`
                },
            });
            return response.data.data; 
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/tay-ao/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product data:", error);
            throw error;
        }
    },

    async add(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/tay-ao`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await axios.put(`http://localhost:8080/api/tay-ao/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    async toggleStatus(id) {
        try {
            const response = await axios.patch(`http://localhost:8080/api/tay-ao/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error toggling product status:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await axios.delete(`http://localhost:8080/api/tay-ao/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },
};

export default SleeveService;