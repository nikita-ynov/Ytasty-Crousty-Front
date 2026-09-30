import App from './App.tsx'
import { Outlet } from 'react-router-dom'
import Header from './components/Header.tsx';
import Menu from './pages/Menu.tsx';

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
                path: "/menu",
                element: <Menu />,
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