import axios from 'axios';
import type { Product } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const productsService = {
  getProducts: async (token: string): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  toggleAvailability: async (productId: string, isAvailable: boolean, token: string): Promise<Product> => {
    const response = await axios.patch(
      `${API_URL}/products/${productId}/availability`,
      { is_available: isAvailable },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  createProduct: async (productData: Omit<Product, 'id'>, token: string): Promise<Product> => {
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateProduct: async (productId: string, productData: Partial<Product>, token: string): Promise<Product> => {
    const response = await axios.patch(`${API_URL}/products/${productId}`, productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteProduct: async (productId: string, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};