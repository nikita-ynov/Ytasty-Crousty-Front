import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Restaurant } from '../../types/restaurants';

interface RestaurantState {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
};

export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload;
    },
    setCurrentRestaurante: (state, action: PayloadAction<Restaurant | null>) => {
      state.currentRestaurant = action.payload;
    },
  },
});

export const { setRestaurants, setCurrentRestaurante } = restaurantSlice.actions;
export default restaurantSlice.reducer;
