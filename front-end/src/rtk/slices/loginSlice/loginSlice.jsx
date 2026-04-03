import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "../../thunks/loginThunk/loginThunk";

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetLoginState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }   
    },
    extraReducers: (builder) => {
        builder
        .addCase('login/pending', (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        }
        )
        .addCase('login/fulfilled', (state) => {
            state.loading = false;
            state.error = null;
            state.success = true;
        })
        .addCase('login/rejected', (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload.message : 'An error occurred while logging in.';
            state.success = false;
        })
    }
})

export const { resetLoginState } = loginSlice.actions;
export default loginSlice.reducer;