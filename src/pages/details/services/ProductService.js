import axios from "axios";
import apiClients from "../../../api/ApiClient";

const ProductService = {
    async getAllProducts(page = 0, size = 10, search = '') {
        try {
            const response = await apiClients.get(`/san-pham`, {
                params: {
                    page,
                    size,
                    search,
                },
            });
            console.log("API response:", response.data); // Log API response
            return response.data.data.content; // Access the content array
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },

    async getProductById(id) {
        try {
            const response = await apiClients.get(`/san-pham/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product data:", error);
            throw error;
        }
    },

    async getDetailByProductId(id) {
        try {
            const response = await apiClients.get(`/san-pham/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product data:", error);
            throw error;
        }
    },

    async createProduct(productData) {
        try {
            const response = await apiClients.post(`/san-pham`, productData);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async updateProduct(id, productData) {
        try {
            const response = await apiClients.put(`/san-pham/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    async toggleProductStatus(id) {
        try {
            const response = await apiClients.patch(`/san-pham/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error toggling product status:", error);
            throw error;
        }
    },

    async deleteProduct(id) {
        try {
            const response = await apiClients.delete(`/san-pham/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },
};

export default ProductService;