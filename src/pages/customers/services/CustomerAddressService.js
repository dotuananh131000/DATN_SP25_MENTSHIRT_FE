import axios from "axios";
import apiClients from "../../../api/ApiClient";

const CustomerAddressService = {
    async getById(id) {
        try {
            const response = await apiClients.get(`/dia-chi/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching customer address:", error);
            throw error;
        }
    },

    async getByCustomerId(khachHangId) {
        try {
            const response = await apiClients.get(`/dia-chi/khach-hang/${khachHangId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching customer addresses by customer id:", error);
            throw error;
        }
    },

    async create(data) {
        try {
            const response = await apiClients.post(`/dia-chi`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating customer address:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await apiClients.put(`/dia-chi/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating customer address:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await apiClients.delete(`/dia-chi/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting customer address:", error);
            throw error;
        }
    }
};

export default CustomerAddressService;
