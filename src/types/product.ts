export type ProductCategory =
    | "burgers"
    | "boxes"
    | "menus"
    | "sides"
    | "drinks"
    | "desserts";

export interface Product {
  id: number;
  restaurant_id: number;
  name: string;
  image: string;
  description: string;
  category: ProductCategory;
  price: number;
  is_available: boolean;
  ingredients: string[];
}