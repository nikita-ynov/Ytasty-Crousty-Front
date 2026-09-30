import { Link, useNavigate } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CityMenu from "./CityMenu";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store.ts";
import { logout } from "../store/reducers/auth.ts";

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector(
        (state: RootState) => state.auth.token
    );

    const cartItems = useSelector(
        (state: RootState) => state.cart.items
    );

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");

        dispatch(logout());

        navigate("/login");
    };

    return (
        <header className="header">
            <div className="header-container">

                <Link className="logo" to="/">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/fr/4/4c/Logo_Tasty_Crousty.webp"
                        alt="Ytasty Crousty"
                    />
                </Link>

                <nav className="header-nav">
                    <ul>
                        <li>
                            <Link to="/">Accueil</Link>
                        </li>

                        <li>
                            <Link to="/menu">Menu</Link>
                        </li>

                        <li>
                            <Link to="/tracking">
                                Suivre ma commande
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="header-actions">

                    <CityMenu />

                    <Link className="cart" to="/cart" aria-label="Panier">
                        <ShoppingBagIcon />

                        {cartCount > 0 && (
                            <span>{cartCount}</span>
                        )}
                    </Link>

                    {token ? (
                        <button className="login" onClick={handleLogout}>
                            Déconnexion
                        </button>
                    ) : (
                        <Link className="login" to="/login">
                            Connexion
                        </Link>
                    )}

                </div>
            </div>
        </header>
    );
}