export type OrderStatus = 'pending' | 'validated' | 'preparing' | 'ready' | 'collected' | 'cancelled';
export type TakeawayMode = 'onsite' | 'takeaway';

export interface OrderItem {
  product_id: string;
  quantity: number;
  price?: number;
  product?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface Order {
  order_number: string;
  restaurant_id: string;
  customer_name?: string;
  customer_email?: string;
  status: OrderStatus;
  takeaway_mode?: TakeawayMode;
  items: OrderItem[];
  total_price?: number;
  created_at: string;
}