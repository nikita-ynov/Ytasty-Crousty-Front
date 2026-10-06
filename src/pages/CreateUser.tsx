import { useState, type FormEvent } from "react";
import {
    Alert,
    Box,
    Button,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export default function CreateUser() {
    const token = useSelector(
        (state: RootState) => state.auth.token
    );

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("staff");
    const [restaurantId, setRestaurantId] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (username.length < 8 || username.length > 12) {
            setError("L'identifiant doit contenir entre 8 et 12 caractères");
            return;
        }

        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            setError("L'identifiant doit être alphanumérique");
            return;
        }

        if (password.length < 12 || password.length > 64) {
            setError("Le mot de passe doit contenir entre 12 et 64 caractères");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setError("Le mot de passe doit contenir une majuscule");
            return;
        }

        if (!/[0-9]/.test(password)) {
            setError("Le mot de passe doit contenir un chiffre");
            return;
        }

        if (!/[^a-zA-Z0-9]/.test(password)) {
            setError("Le mot de passe doit contenir un caractère spécial");
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/users`,
                {
                    first_name: firstName,
                    last_name: lastName,
                    username,
                    password,
                    role,
                    restaurant_id: restaurantId
                        ? Number(restaurantId)
                        : null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Utilisateur créé avec succès");

            setFirstName("");
            setLastName("");
            setUsername("");
            setPassword("");
            setRole("staff");
            setRestaurantId("");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.detail ||
                    "Impossible de créer l'utilisateur"
                );
            } else {
                setError("Impossible de créer l'utilisateur");
            }
        }
    };

    return (
        <Box
            component="main"
            sx={{
                maxWidth: 500,
                margin: "40px auto",
                padding: 3
            }}
        >
            <Typography variant="h4" sx={{ marginBottom: 3 }}>
                Créer un utilisateur
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}
            >
                {message && (
                    <Alert severity="success">
                        {message}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />

                <TextField
                    label="Nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

                <TextField
                    label="Identifiant"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <TextField
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <TextField
                    select
                    label="Rôle"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="direction">Direction</MenuItem>
                </TextField>

                <TextField
                    label="ID Restaurant"
                    type="number"
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                />

                <Button type="submit" variant="contained">
                    Créer
                </Button>
            </Box>
        </Box>
    );
}