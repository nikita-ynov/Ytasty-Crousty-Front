import { useState, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";

type CartItem = {
    product_id: number;
    quantity: number;
};

type FormulaireProps = {
    items: CartItem[];
};

export default function Formulaire({ items }: FormulaireProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pickupMode, setPickupMode] = useState("");

    const navigate = useNavigate();

    const currentRestaurant = useSelector(
        (state: RootState) => state.restaurant.currentRestaurant
    );

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!currentRestaurant) {
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/orders`,
                {
                    restaurant_id: currentRestaurant.id,
                    items,
                    pickup_mode: pickupMode,
                    customer: {
                        name,
                        email
                    }
                }
            );

            navigate(`/confirmation/${response.data.order_number}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Passer une commande</h2>

            <TextField
                label="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <FormControl required>
                <RadioGroup
                    value={pickupMode}
                    onChange={(e) => setPickupMode(e.target.value)}
                >
                    <FormControlLabel
                        value="onsite"
                        control={<Radio />}
                        label="Sur place"
                    />

                    <FormControlLabel
                        value="takeaway"
                        control={<Radio />}
                        label="À emporter"
                    />
                </RadioGroup>
            </FormControl>

            <Button type="submit" variant="contained">
                Commander
            </Button>
        </form>
    );
}