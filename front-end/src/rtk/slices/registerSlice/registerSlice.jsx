import { createSlice } from "@reduxjs/toolkit";
import {
    changePasswordThunk,
    forgetPasswordThunk,
    getRegisteredUsers,
    registerThunk,
    resetPasswordThunk,
    verifyOTPThunk
} from "../../thunks/registerThunk/registerThunk";

const initialState = {
    loading: false,
    error: null,
    success: false,
    registeredUsers: [],
    otpPendingVerification: false,
    registeredEmail: "",
    verificationSuccess: false,
    forgotPasswordEmail: "",
    forgotPasswordOtpSent: false,
    resetPasswordSuccess: false
}

const registerSlice = createSlice({
    name: 'register',
    initialState,   
    reducers: {
        resetRegisterState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.registeredUsers = [];
            state.otpPendingVerification = false;
            state.registeredEmail = "";
            state.verificationSuccess = false;
            state.forgotPasswordEmail = "";
            state.forgotPasswordOtpSent = false;
            state.resetPasswordSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder

        .addCase(registerThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
            state.verificationSuccess = false;
        })

        .addCase(registerThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.otpPendingVerification = true;
            state.registeredEmail = action.payload?.user?.email || "";
            state.verificationSuccess = false;
        })  
        .addCase(registerThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload.message : 'An error occurred while registering.';
            state.success = false;
        })
        .addCase(verifyOTPThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.verificationSuccess = false;
        })
        .addCase(verifyOTPThunk.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
            state.otpPendingVerification = false;
            state.verificationSuccess = true;
            state.success = false;
        })
        .addCase(verifyOTPThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload.message : 'An error occurred while verifying OTP.';
            state.verificationSuccess = false;
        }).addCase(getRegisteredUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.registeredUsers = [];
        }
        ).addCase(getRegisteredUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.registeredUsers = action.payload;
        }
        ).addCase(getRegisteredUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? action.payload.message : 'An error occurred while fetching registered users.';
            state.success = false;
            state.registeredUsers = [];
        }
    ).addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
    }).addCase(changePasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
    }).addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'An error occurred while changing password.';
     }).addCase(forgetPasswordThunk.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.resetPasswordSuccess = false;
     }).addCase(forgetPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.forgotPasswordEmail = action.payload?.email || "";
        state.forgotPasswordOtpSent = true;
     }).addCase(forgetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'An error occurred while processing forget password request.';
     }).addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetPasswordSuccess = false;
     }).addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.forgotPasswordEmail = "";
        state.forgotPasswordOtpSent = false;
        state.resetPasswordSuccess = true;
     }).addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'An error occurred while resetting password.';
     })
    }
})

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
