import axios from "axios";
import apiClients from "../../../api/ApiClient";

const SizeService = {
    async getAll(page = 0, size = 10, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await apiClients.get(`/kich-thuoc`, {
                params: {
                    page,
                    size,
                    search,
                    sort: sortKey,
                    direction: sortDirection
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
            const response = await apiClients.get(`/kich-thuoc/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product data:", error);
            throw error;
        }
    },

    async add(data) {
        try {
            const response = await apiClients.post(`/kich-thuoc`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await apiClients.put(`/kich-thuoc/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    async toggleStatus(id) {
        try {
            const response = await apiClients.patch(`/kich-thuoc/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error toggling product status:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await apiClients.delete(`/kich-thuoc/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },
};

export default SizeService;