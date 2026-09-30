import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/products";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(
                (item) => item.product.id === action.payload.id
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    product: action.payload,
                    quantity: 1,
                });
            }
        },

        removeOneFromCart: (state, action: PayloadAction<number>) => {
            const existingItem = state.items.find(
                (item) => item.product.id === action.payload
            );

            if (!existingItem) return;

            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                state.items = state.items.filter(
                    (item) => item.product.id !== action.payload
                );
            }
        },

        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(
                (item) => item.product.id !== action.payload
            );
        },

        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const {
    addToCart,
    removeOneFromCart,
    removeFromCart,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;