import axios from "axios";
import apiClients from "../../../api/ApiClient";

const ColorService = {
    async getAll(page = 0, size = 10, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await apiClients.get(`/mau-sac`, {
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
            const response = await apiClients.get(`/mau-sac/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product data:", error);
            throw error;
        }
    },

    async add(data) {
        try {
            const response = await apiClients.post(`/mau-sac`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await apiClients.put(`/mau-sac/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    async toggleStatus(id) {
        try {
            const response = await apiClients.patch(`/mau-sac/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error toggling product status:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await apiClients.delete(`/mau-sac/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },
};

export default ColorService;