import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./reducers/restaurants"
import productReducer from "./reducers/products"
import loadingReducer from './reducers/loading'

export const store = configureStore({
    reducer: {
        restaurant: restaurantReducer,
        product: productReducer,
        loading: loadingReducer,
    }
})
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
