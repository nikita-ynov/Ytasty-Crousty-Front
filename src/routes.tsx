import App from './App.tsx'
import { Outlet } from 'react-router-dom'
import Header from './components/Header.tsx';
import Menu from './pages/Menu.tsx';
import Login from "./Login.tsx";
import Cart from './pages/Cart.tsx';
import Checkout from "./Checkout.tsx";
import Confirmation from "./Confirmation.tsx";
import Suivi from "./Suivi";

const Layout = () => (
    <>
        <Header />
        <Outlet />
    </>
)

const routes = [
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <App />,
            },
            {
                 path: "/formulaire",
                 element: <Checkout/>,
             },
            {
                path: "/confirmation/:orderNumber",
                element: <Confirmation />
            },
            {
                path: "/menu",
                element: <Menu />,
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/suivi",
                element: <Suivi />
            },
            {
                path: "/suivi/:orderNumber",
                element: <Suivi />
            },
            // {
            //     path: "/login",
            //     element: <GuestRoute><Login /></GuestRoute>,
            // },
            // {
            //     path: "/profile",
            //     element: <PrivateRoute><Profile /></PrivateRoute>,
            // },
            // {
            //     path: "/users",
            //     element: <Users />,
            // },
            // {
            //     path: "/user/:userId",
            //     element: <User />,
            // },
            // {
            //     path: "/favorites",
            //     element: <Favorites />,
            // },
            // {
            //     path: "/recipe/:id",
            //     element: <RecipeDetails />,
            // },
            // {
            //     path: "/blog",
            //     element: <Blog />,
            // },
            // {
            //     path: "/posts/:id",
            //     element: <PostDetails />,
            // },
            // {
            //     path: "*",
            //     element: <PageNotFound />,
            // },
        ]
    }
]
export default routes;