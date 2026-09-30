import "./Checkout.css";
import Formulaire from "./components/Formulaire.tsx";

export default function Checkout() {
    return (
        <main className="commande-page">
            <h1>Finaliser ma commande</h1>
            <p>Renseignez vos informations pour valider votre commande.</p>

            <Formulaire items={[]} />
        </main>
    );
}