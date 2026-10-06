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

import "../styles/login.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        if (
            username.length < 8 ||
            username.length > 12
        ) {
            setError(
                "L'identifiant doit contenir entre 8 et 12 caractères"
            );
            return;
        }

        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            setError(
                "L'identifiant doit être alphanumérique"
            );
            return;
        }

        if (
            password.length < 12 ||
            password.length > 64
        ) {
            setError(
                "Le mot de passe doit contenir entre 12 et 64 caractères"
            );
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setError(
                "Le mot de passe doit contenir une majuscule"
            );
            return;
        }

        if (!/[0-9]/.test(password)) {
            setError(
                "Le mot de passe doit contenir un chiffre"
            );
            return;
        }

        if (!/[^a-zA-Z0-9]/.test(password)) {
            setError(
                "Le mot de passe doit contenir un caractère spécial"
            );
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

            const token =
                response.data.access_token;

            let role:
                | "admin"
                | "staff"
                | "direction" = "staff";

            if (username === "admin123") {
                role = "admin";
            }

            localStorage.setItem(
                "access_token",
                token
            );

            localStorage.setItem(
                "role",
                role
            );

            dispatch(
                login({
                    token,
                    role
                })
            );

            navigate("/");
        } catch {
            setError(
                "Identifiant ou mot de passe incorrect"
            );
        }
    };

    return (
        <Box
            component="main"
            className="login-page"
        >
            <Box className="login-card">

                <Typography
                    variant="h4"
                    component="h1"
                    className="login-title"
                >
                    Connexion
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    className="login-form"
                >
                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Identifiant"
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                        required
                        fullWidth
                        className="login-field"
                    />

                    <TextField
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        required
                        fullWidth
                        className="login-field"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        className="login-submit"
                    >
                        Se connecter
                    </Button>

                </Box>
            </Box>
        </Box>
    );
}