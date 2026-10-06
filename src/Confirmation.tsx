import { Link, useParams } from "react-router-dom";
import "./Confirmation.css";

export default function Confirmation() {
    const { orderNumber } = useParams();

    return (
        <main className="confirmation-page">
            <div className="confirmation-card">
                <h1>Commande validée</h1>

                <p>Votre numéro de commande est :</p>

                <h2>{orderNumber}</h2>

                <Link
                    to={`/suivi/${orderNumber}`}
                    className="confirmation-button"
                >
                    Suivre ma commande
                </Link>
            </div>
        </main>
    );
}