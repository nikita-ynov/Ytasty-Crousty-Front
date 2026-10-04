import api from "./api";
import type { Order, OrderStatus } from "../types/order";

export const ordersService = {
  getRestaurantOrders: async (
      restaurantId: string
  ): Promise<Order[]> => {
    const response = await api.get(
        `/restaurants/${restaurantId}/orders`
    );

    return response.data;
  },

  updateOrderStatus: async (
      orderNumber: string,
      status: OrderStatus
  ): Promise<Order> => {
    const response = await api.patch(
        `/orders/${orderNumber}/status`,
        { status }
    );

    return response.data;
  },

  cancelOrder: async (
      orderNumber: string
  ): Promise<void> => {
    await api.post(
        `/orders/${orderNumber}/cancel`
    );
  }
};