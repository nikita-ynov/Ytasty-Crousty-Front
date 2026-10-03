export type ProductCategory = 'burgers' | 'sides' | 'drinks' | 'desserts';

export interface Product {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  ingredients?: string[];
  image_url?: string;
  is_available: boolean;
}