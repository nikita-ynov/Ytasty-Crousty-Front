import { useState } from "react";
import axios from "axios";

export default function Formulaire() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pickupMode, setPickupMode] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/orders", {
                name: name,
                email: email,
                pickup_mode: pickupMode,
            });

            console.log("Commande créée :", response.data);
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Passer une commande</h2>

                <div>
                    <label>Nom :</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <p>Mode de retrait :</p>

                    <label>
                        <input
                            type="radio"
                            name="pickupMode"
                            value="onsite"
                            checked={pickupMode === "onsite"}
                            onChange={(e) => setPickupMode(e.target.value)}
                            required
                        />
                        Sur place
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="pickupMode"
                            value="takeaway"
                            checked={pickupMode === "takeaway"}
                            onChange={(e) => setPickupMode(e.target.value)}
                        />
                        À emporter
                    </label>
                </div>

                <button type="submit">
                    Commander
                </button>
            </form>
        </>
    );
}