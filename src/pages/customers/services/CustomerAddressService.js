import axios from "axios";

const CustomerAddressService = {
    async getById(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/dia-chi/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching customer address:", error);
            throw error;
        }
    },

    async getByCustomerId(khachHangId) {
        try {
            const response = await axios.get(`http://localhost:8080/api/dia-chi/khach-hang/${khachHangId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching customer addresses by customer id:", error);
            throw error;
        }
    },

    async create(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/dia-chi`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating customer address:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await axios.put(`http://localhost:8080/api/dia-chi/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating customer address:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await axios.delete(`http://localhost:8080/api/dia-chi/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting customer address:", error);
            throw error;
        }
    }
};

export default CustomerAddressService;
