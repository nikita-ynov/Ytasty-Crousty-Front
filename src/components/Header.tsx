import { Link } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CityMenu from "./CityMenu";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export default function Header() {
    const cartItems = useSelector(
        (state: RootState) => state.cart.items
    );

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );
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
                            <Link to="/tracking">Suivre ma commande</Link>
                        </li>
                    </ul>
                </nav>

                <div className="header-actions">

                    <CityMenu />

                    <Link
                        className="cart"
                        to="/cart"
                        aria-label="Panier"
                    >
                        <ShoppingBagIcon />

                        {cartCount > 0 && <span>{cartCount}</span>}
                    </Link>

                    <Link className="login" to="/login">
                        Connexion
                    </Link>

                </div>

            </div>
        </header>
    );
}