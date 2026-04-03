import { createSlice } from "@reduxjs/toolkit";


const deactivateSlice = createSlice({
    name: 'deactivate',
    initialState: {
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetDeactivateState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder            .addCase('deactivateAccount/pending', (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            }
            )
            .addCase('deactivateAccount/fulfilled', (state) => {
                state.loading = false;
                state.success = true;
            }).addCase('deactivateAccount/rejected', (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    }
});

export const { resetDeactivateState } = deactivateSlice.actions;

export default deactivateSlice.reducer;