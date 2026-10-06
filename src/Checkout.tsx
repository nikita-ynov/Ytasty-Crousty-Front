import "./Checkout.css";
import Formulaire from "./components/Formulaire";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";

export default function Checkout() {
    const cartItems = useSelector(
        (state: RootState) => state.cart.items
    );

    const items = cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity
    }));

    return (
        <main className="commande-page">
            <div className="commande-card">
                <h1 className="commande-title">
                    Finaliser ma commande
                </h1>

                <p className="commande-subtitle">
                    Renseignez vos informations pour valider votre commande.
                </p>

                <Formulaire items={items} />
            </div>
        </main>
    );
}