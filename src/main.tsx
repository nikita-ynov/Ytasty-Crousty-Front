import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from './routes.tsx'
import SocketService from './services/socketService.ts'

const socket = SocketService.getInstance().socket;

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)