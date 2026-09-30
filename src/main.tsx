import { createRoot } from 'react-dom/client'
import '../styles/index.css'
import '../styles/header.css'
import '../styles/home.css'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from './routes.tsx'
import SocketService from './services/socketService.ts'
import type { Restaurant } from './types/restaurants.ts'
import { setCurrentRestaurante, setRestaurants } from './store/reducers/restaurants.ts'
import axios from 'axios'
import { setLoading } from './store/reducers/loading.ts'
import { setProducts } from './store/reducers/products.ts'

// const socket = SocketService.getInstance().socket;

const API_URL = import.meta.env.VITE_API_URL

const getRestaurants= async () => {
  const response = await axios.get(API_URL + "/restaurants");
  store.dispatch(setRestaurants(response.data))
  store.dispatch(setCurrentRestaurante(response.data[0]))
}

const getProducts= async () => {
  const response = await axios.get(API_URL + "/products");
  store.dispatch(setProducts(response.data))
}

Promise.all([getRestaurants(), getProducts()]).finally(() => store.dispatch(setLoading(false)))

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)