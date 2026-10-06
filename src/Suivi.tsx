import {
    useEffect,
    useState,
    type FormEvent
} from "react";

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

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

import "../styles/suivi.css";

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

const stepLabels: Record<string, string> = {
    pending: "En attente",
    validated: "Validée",
    preparing: "En préparation",
    ready: "Prête",
    collected: "Récupérée"
};

export default function Suivi() {
    const { orderNumber } = useParams();

    const [number, setNumber] = useState(
        orderNumber || ""
    );

    const [order, setOrder] =
        useState<Order | null>(null);

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const loadOrder = async (
        value: string
    ) => {
        try {
            setError("");

            const response =
                await axios.get(
                    `${import.meta.env.VITE_API_URL}/orders/${value}`
                );

            setOrder(response.data);
        } catch {
            setOrder(null);
            setError(
                "Commande introuvable"
            );
        }
    };

    useEffect(() => {
        if (orderNumber) {
            loadOrder(orderNumber);
        }
    }, [orderNumber]);

    const handleSubmit = (
        e: FormEvent<HTMLFormElement>
    ) => {
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
        <Box
            component="main"
            className="suivi-page"
        >
            <Box className="suivi-card">

                <Typography
                    variant="h4"
                    component="h1"
                    className="suivi-title"
                >
                    Suivre ma commande
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    className="suivi-form"
                >
                    <TextField
                        label="Numéro de commande"
                        value={number}
                        onChange={(e) =>
                            setNumber(
                                e.target.value
                            )
                        }
                        fullWidth
                        className="suivi-field"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        className="suivi-search-button"
                    >
                        Rechercher
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                {order && (
                    <Box className="suivi-order">

                        <Typography
                            variant="h5"
                            className="suivi-order-title"
                        >
                            Commande{" "}
                            {order.order_number}
                        </Typography>

                        {order.status ===
                        "cancelled" ? (
                            <Alert severity="error">
                                Commande annulée
                            </Alert>
                        ) : (
                            <Stepper
                                activeStep={
                                    activeStep
                                }
                                alternativeLabel
                                className="suivi-stepper"
                            >
                                {steps.map(
                                    (step) => (
                                        <Step
                                            key={
                                                step
                                            }
                                        >
                                            <StepLabel>
                                                {
                                                    stepLabels[
                                                        step
                                                        ]
                                                }
                                            </StepLabel>
                                        </Step>
                                    )
                                )}
                            </Stepper>
                        )}

                        <Box className="suivi-info">

                            <Typography>
                                Mode de retrait :{" "}
                                {order.pickup_mode ===
                                "onsite"
                                    ? "Sur place"
                                    : "À emporter"}
                            </Typography>

                            <Typography
                                className="suivi-total"
                            >
                                Total :{" "}
                                {order.total_price.toFixed(
                                    2
                                )}{" "}
                                €
                            </Typography>

                            {order.items.map(
                                (item) => (
                                    <Typography
                                        key={
                                            item.product_id
                                        }
                                        className="suivi-item"
                                    >
                                        Produit{" "}
                                        {
                                            item.product_id
                                        }{" "}
                                        ×{" "}
                                        {
                                            item.quantity
                                        }
                                    </Typography>
                                )
                            )}

                        </Box>
                    </Box>
                )}

            </Box>
        </Box>
    );
}