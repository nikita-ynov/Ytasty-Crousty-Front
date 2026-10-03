import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { IconButton } from "@mui/material";

import type { RootState } from "../store/store";
import {
    addToCart,
    removeFromCart,
    clearCart,
    removeOneFromCart,
} from "../store/reducers/cart";


export default function Cart() {
    const dispatch = useDispatch();

    const cartItems = useSelector(
        (state: RootState) => state.cart.items
    );

    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const itemCount = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    if (cartItems.length === 0) {
        return (
            <main className="cart-page">
                <div className="cart-container cart-empty">
                    <div className="cart-empty-icon">
                        <ShoppingBagOutlinedIcon />
                    </div>

                    <h1>Votre panier est vide</h1>

                    <p>
                        Découvrez notre menu et ajoutez vos produits
                        préférés à votre panier.
                    </p>

                    <Link to="/menu" className="cart-primary-button">
                        Découvrir le menu
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <div className="cart-container">

                <Link to="/menu" className="cart-back">
                    <ArrowBackIcon fontSize="small" />
                    Retour au menu
                </Link>

                <div className="cart-header">
                    <div>
                        <span className="cart-label">VOTRE COMMANDE</span>
                        <h1>Votre panier</h1>
                        <p>
                            {itemCount}{" "}
                            {itemCount > 1 ? "articles" : "article"} dans votre panier
                        </p>
                    </div>

                    <button
                        className="cart-clear"
                        onClick={() => dispatch(clearCart())}
                    >
                        Vider le panier
                    </button>
                </div>

                <div className="cart-layout">

                    <section className="cart-items">

                        {cartItems.map((item) => (
                            <article
                                className="cart-item"
                                key={item.product.id}
                            >
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="cart-item-image"
                                />

                                <div className="cart-item-content">

                                    <div className="cart-item-info">
                                        <span className="cart-item-category">
                                            {item.product.category}
                                        </span>

                                        <h2>{item.product.name}</h2>

                                        <p>
                                            {item.product.description}
                                        </p>
                                    </div>

                                    <div className="cart-item-bottom">

                                        <strong className="cart-item-price">
                                            {item.product.price.toFixed(2)} €
                                        </strong>

                                        <div className="cart-item-actions">

                                            <div className="quantity-control">
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        dispatch(
                                                            removeOneFromCart(
                                                                item.product.id
                                                            )
                                                        )
                                                    }
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>

                                                <span>{item.quantity}</span>

                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        dispatch(
                                                            addToCart(
                                                                item.product
                                                            )
                                                        )
                                                    }
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </div>

                                            <IconButton
                                                className="cart-delete"
                                                onClick={() =>
                                                    dispatch(
                                                        removeFromCart(
                                                            item.product.id
                                                        )
                                                    )
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>

                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}

                    </section>

                    <aside className="cart-summary">

                        <div className="summary-header">
                            <h2>Résumé</h2>
                            <span>{itemCount} articles</span>
                        </div>

                        <div className="summary-line">
                            <span>Sous-total</span>
                            <strong>{total.toFixed(2)} €</strong>
                        </div>

                        <div className="summary-line">
                            <span>Livraison</span>
                            <span>À calculer</span>
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-total">
                            <span>Total</span>
                            <strong>{total.toFixed(2)} €</strong>
                        </div>

                        <Link to="/formulaire" className="checkout-button">
                            Commander
                        </Link>

                        <p className="checkout-info">
                            Les frais de livraison seront calculés
                            lors de la commande.
                        </p>

                    </aside>

                </div>
            </div>
        </main>
    );
}
