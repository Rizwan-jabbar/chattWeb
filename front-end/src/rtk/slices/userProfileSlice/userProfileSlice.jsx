import { createSlice } from "@reduxjs/toolkit";
import { getLoggedInUserThunk } from "../../thunks/userProfileThunk/userProfileThunk";

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState: {
        user: null,
        loading: false,
        error: null
    },

    reducers: {
        resetUserProfileState: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        }   
    },

    extraReducers: (builder) => {
        builder
        .addCase(getLoggedInUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getLoggedInUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.error = null;
        }
        )
        .addCase(getLoggedInUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload.message : 'An error occurred while fetching user data.';
        })
    }   
})

export const { resetUserProfileState } = userProfileSlice.actions;
export default userProfileSlice.reducer;
