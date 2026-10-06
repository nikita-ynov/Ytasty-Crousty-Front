import { useState, type FormEvent } from "react";
import {
    Alert,
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "./store/reducers/auth";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                {
                    username,
                    password
                }
            );

            const token = response.data.access_token;

            let role: "admin" | "staff" | "direction" = "staff";

            if (username === "admin123") {
                role = "admin";
            }

            localStorage.setItem("access_token", token);
            localStorage.setItem("role", role);

            dispatch(
                login({
                    token,
                    role
                })
            );

            navigate("/");
        } catch {
            setError("Identifiant ou mot de passe incorrect");
        }
    };

    return (
        <Box
            component="main"
            sx={{
                maxWidth: 400,
                margin: "60px auto",
                padding: 3
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                sx={{ marginBottom: 3 }}
            >
                Connexion
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
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Identifiant"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        background: "var(--color-primary)",
                        color: "white",
                        borderRadius: "999px",
                        padding: "10px 18px",
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 2px 5px rgba(160, 65, 0, 0.12)",

                        "&:hover": {
                            background: "var(--color-primary)",
                            opacity: 0.95,
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 10px rgba(160, 65, 0, 0.18)"
                        },

                        "&:active": {
                            transform: "scale(0.97)"
                        }
                    }}
                >
                    Se connecter
                </Button>
            </Box>
        </Box>
    );
}