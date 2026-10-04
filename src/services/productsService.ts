import api from "./api";
import type { Product } from "../types/product";

export const productsService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get("/products");

    return response.data;
  },

  toggleAvailability: async (
      productId: string,
      isAvailable: boolean
  ): Promise<Product> => {
    const response = await api.patch(
        `/products/${productId}/availability`,
        {
          is_available: isAvailable
        }
    );

    return response.data;
  },

  createProduct: async (
      productData: Omit<Product, "id">
  ): Promise<Product> => {
    const response = await api.post(
        "/products",
        productData
    );

    return response.data;
  },

  updateProduct: async (
      productId: string,
      productData: Partial<Product>
  ): Promise<Product> => {
    const response = await api.patch(
        `/products/${productId}`,
        productData
    );

    return response.data;
  },

  deleteProduct: async (
      productId: string
  ): Promise<void> => {
    await api.delete(`/products/${productId}`);
  }
};