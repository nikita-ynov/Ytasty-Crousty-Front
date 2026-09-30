import { createRoot } from 'react-dom/client'
import '../styles/index.css'
import '../styles/header.css'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from './routes.tsx'
import { setCurrentRestaurante, setRestaurants } from './store/reducers/restaurants.ts'
import axios from 'axios'
import { setLoading } from './store/reducers/loading.ts'

// const socket = SocketService.getInstance().socket;

const API_URL = import.meta.env.VITE_API_URL

const getRestaurants= async () => {
  const response = await axios.get(API_URL + "/restaurants");
  store.dispatch(setRestaurants(response.data))
  store.dispatch(setCurrentRestaurante(response.data[0]))
}

Promise.all([getRestaurants()]).finally(() => store.dispatch(setLoading(false)))

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)