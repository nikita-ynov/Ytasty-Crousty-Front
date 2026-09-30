export interface Product {
  restaurant_id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  price: number;
  is_available: boolean;
  ingredients: string[];
}
