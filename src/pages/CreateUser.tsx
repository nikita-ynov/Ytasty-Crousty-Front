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

    const fieldStyle = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "14px",

            "&.Mui-focused fieldset": {
                borderColor: "var(--color-primary)"
            }
        },

        "& .MuiInputLabel-root.Mui-focused": {
            color: "var(--color-primary)"
        }
    };

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // Validation username
        if (username.length < 8 || username.length > 12) {
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

        // Validation mot de passe
        if (password.length < 12 || password.length > 64) {
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
                setError(
                    "Impossible de créer l'utilisateur"
                );
            }
        }
    };

    return (
        <Box
            component="main"
            sx={{
                maxWidth: 520,
                margin: "60px auto",
                padding: 3
            }}
        >
            <Box
                sx={{
                    background: "var(--color-surface)",
                    border:
                        "1px solid var(--color-border-subtle)",
                    borderRadius: "24px",
                    padding: 4,
                    boxShadow:
                        "0 4px 16px rgba(160, 65, 0, 0.08)"
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        marginBottom: 1,
                        fontWeight: 700,
                        color: "var(--color-text)"
                    }}
                >
                    Créer un utilisateur
                </Typography>

                <Typography
                    sx={{
                        marginBottom: 3,
                        color: "var(--color-text-secondary)"
                    }}
                >
                    Ajoutez un nouveau membre du personnel
                    Ytasty Crousty.
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
                        onChange={(e) =>
                            setFirstName(e.target.value)
                        }
                        required
                        fullWidth
                        sx={fieldStyle}
                    />

                    <TextField
                        label="Nom"
                        value={lastName}
                        onChange={(e) =>
                            setLastName(e.target.value)
                        }
                        required
                        fullWidth
                        sx={fieldStyle}
                    />

                    <TextField
                        label="Identifiant"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        required
                        fullWidth
                        helperText="8 à 12 caractères, lettres et chiffres uniquement"
                        sx={fieldStyle}
                    />

                    <TextField
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                        fullWidth
                        helperText="12 à 64 caractères, avec une majuscule, un chiffre et un caractère spécial"
                        sx={fieldStyle}
                    />

                    <TextField
                        select
                        label="Rôle"
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                        fullWidth
                        sx={fieldStyle}
                    >
                        <MenuItem value="staff">
                            Staff
                        </MenuItem>

                        <MenuItem value="admin">
                            Admin
                        </MenuItem>

                        <MenuItem value="direction">
                            Direction
                        </MenuItem>
                    </TextField>

                    <TextField
                        select
                        label="Restaurant"
                        value={restaurantId}
                        onChange={(e) =>
                            setRestaurantId(e.target.value)
                        }
                        fullWidth
                        sx={fieldStyle}
                    >
                        <MenuItem value="">
                            Aucun
                        </MenuItem>

                        <MenuItem value="1">
                            Aix-en-Provence
                        </MenuItem>

                        <MenuItem value="2">
                            Lyon
                        </MenuItem>

                        <MenuItem value="3">
                            Paris
                        </MenuItem>
                    </TextField>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            marginTop: 1,
                            background:
                                "var(--color-primary)",
                            color: "white",
                            borderRadius: "999px",
                            padding: "11px 18px",
                            fontWeight: 600,
                            textTransform: "none",
                            boxShadow:
                                "0 2px 5px rgba(160, 65, 0, 0.12)",
                            transition:
                                "transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease",

                            "&:hover": {
                                background:
                                    "var(--color-primary)",
                                opacity: 0.95,
                                transform:
                                    "translateY(-1px)",
                                boxShadow:
                                    "0 4px 10px rgba(160, 65, 0, 0.18)"
                            },

                            "&:active": {
                                transform:
                                    "scale(0.97)"
                            }
                        }}
                    >
                        Créer l'utilisateur
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}