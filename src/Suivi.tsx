import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    Alert,
    Box,
    Button,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography
} from "@mui/material";

type OrderItem = {
    product_id: number;
    quantity: number;
    unit_price: number;
};

type Order = {
    order_number: string;
    status: string;
    pickup_mode: string;
    total_price: number;
    items: OrderItem[];
};

const steps = [
    "pending",
    "validated",
    "preparing",
    "ready",
    "collected"
];

export default function Suivi() {
    const { orderNumber } = useParams();

    const [number, setNumber] = useState(orderNumber || "");
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const loadOrder = async (value: string) => {
        try {
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/orders/${value}`
            );

            setOrder(response.data);
        } catch {
            setOrder(null);
            setError("Commande introuvable");
        }
    };

    useEffect(() => {
        if (orderNumber) {
            loadOrder(orderNumber);
        }
    }, [orderNumber]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!number) {
            return;
        }

        navigate(`/suivi/${number}`);
    };

    const activeStep = order
        ? steps.indexOf(order.status)
        : 0;

    return (
        <Box sx={{ maxWidth: 700, margin: "40px auto", padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
                Suivre ma commande
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", gap: 2, marginBottom: 4 }}
            >
                <TextField
                    label="Numéro de commande"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    fullWidth
                />

                <Button type="submit" variant="contained">
                    Rechercher
                </Button>
            </Box>

            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}

            {order && (
                <>
                    <Typography variant="h5" sx={{ marginBottom: 3 }}>
                        Commande {order.order_number}
                    </Typography>

                    {order.status === "cancelled" ? (
                        <Alert severity="error">
                            Commande annulée
                        </Alert>
                    ) : (
                        <Stepper
                            activeStep={activeStep}
                            alternativeLabel
                            sx={{ marginBottom: 4 }}
                        >
                            {steps.map((step) => (
                                <Step key={step}>
                                    <StepLabel>
                                        {step}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    )}

                    <Typography>
                        Mode de retrait : {order.pickup_mode}
                    </Typography>

                    <Typography sx={{ marginBottom: 2 }}>
                        Total : {order.total_price.toFixed(2)} €
                    </Typography>

                    {order.items.map((item) => (
                        <Typography key={item.product_id}>
                            Produit {item.product_id} × {item.quantity}
                        </Typography>
                    ))}
                </>
            )}
        </Box>
    );
}