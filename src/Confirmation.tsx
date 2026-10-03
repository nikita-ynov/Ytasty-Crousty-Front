import { Link, useParams } from "react-router-dom";

export default function Confirmation() {
    const { orderNumber } = useParams();

    return (
        <main className="commande-page">
            <h1>Commande validée</h1>

            <p>Votre numéro de commande est :</p>

            <h2>{orderNumber}</h2>

            <Link to={`/suivi/${orderNumber}`}>
                Suivre ma commande
            </Link>
        </main>
    );
}