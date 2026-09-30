import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./reducers/restaurants";
import productReducer from "./reducers/products";
import cartReducer from "./reducers/cart";
import loadingReducer from "./reducers/loading";
import authReducer from "./reducers/auth";

export const store = configureStore({
    reducer: {
        restaurant: restaurantReducer,
        product: productReducer,
        loading: loadingReducer,
        cart: cartReducer,
        auth: authReducer
    }
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];