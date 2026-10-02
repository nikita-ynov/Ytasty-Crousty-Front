import axios from 'axios';
import type { Order, OrderStatus } from '../types/order';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface CreateOrderItem {
  product_id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: CreateOrderItem[];
}

export const ordersService = {
  getRestaurantOrders: async (restaurantId: string, token: string): Promise<Order[]> => {
    const response = await axios.get(`${API_URL}/restaurants/${restaurantId}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateOrderStatus: async (orderNumber: string, status: OrderStatus, token: string): Promise<Order> => {
    const response = await axios.patch(
      `${API_URL}/orders/${orderNumber}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  cancelOrder: async (orderNumber: string, token: string): Promise<void> => {
    await axios.post(
      `${API_URL}/orders/${orderNumber}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  createOrder: async (payload: CreateOrderPayload, token: string): Promise<Order> => {
    const response = await axios.post(`${API_URL}/orders`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};