import { useState, type FormEvent } from "react";
import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                {
                    username,
                    password
                }
            );

            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            navigate("/");
        } catch (error) {
            console.error(error);
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
                >
                    Se connecter
                </Button>
            </Box>
        </Box>
    );
}