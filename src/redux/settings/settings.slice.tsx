import { createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

interface SettingsState {
    user: User | null;
    loading: boolean;
    error: Record<string, unknown>;
}

const initialState: Partial<SettingsState> = {
    user: null,
    loading: true,
    error: {},
};

const settingsSlice = createSlice({
    name: "settings",
    initialState: initialState as SettingsState,
    reducers: {
        setUsers: (state: Partial<SettingsState>, action) => {
            state.user = action.payload
        },
        setSettingsLoading: (state: Partial<SettingsState>, action) => {
            state.loading = action.payload
        }
    },
});

export const { setUsers, setSettingsLoading } = settingsSlice.actions;

export default settingsSlice.reducer;
