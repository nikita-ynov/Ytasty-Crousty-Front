import { useState, type FormEvent } from "react";
import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log({
            username,
            password
        });
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