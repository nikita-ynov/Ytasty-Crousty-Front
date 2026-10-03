import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Role = "admin" | "staff" | "direction";

interface AuthState {
    token: string | null;
    role: Role | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("access_token"),
    role: localStorage.getItem("role") as Role | null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (
            state,
            action: PayloadAction<{
                token: string;
                role: Role;
            }>
        ) => {
            state.token = action.payload.token;
            state.role = action.payload.role;
        },

        logout: (state) => {
            state.token = null;
            state.role = null;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;