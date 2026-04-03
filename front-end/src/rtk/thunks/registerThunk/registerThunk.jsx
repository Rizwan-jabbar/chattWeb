import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL 

export const registerThunk = createAsyncThunk(
    'register',

    async (registerData , {rejectWithValue}) => {
        try {

            const response = await axios.post(`${API_URL}/register` , registerData);
            return response.data;
            
        } catch (error) {

            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An error occurred while registering.' });
        }
    }
)

export const verifyOTPThunk = createAsyncThunk(
    'verifyOTP',
    async (verificationData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/verifyOTP`, verificationData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An error occurred while verifying OTP.' });
        }
    }
)


export const getRegisteredUsers = createAsyncThunk(
    'getRegisteredUsers',
    async (searchParams = '', { rejectWithValue }) => {
        try {
            const params =
                typeof searchParams === 'string'
                    ? { email: searchParams }
                    : {
                          email: searchParams?.email || '',
                          excludeUserId: searchParams?.excludeUserId || '',
                      };

            const response = await axios.get(`${API_URL}/registeredUsers`, {
                params
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An error occurred while fetching registered users.' });
        }
    }
);


export const changePasswordThunk = createAsyncThunk(
    'changePassword',
    async ({ currentPassword, newPassword }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/changePassword`,
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An error occurred while changing password.' });
        }
    }
);



export const forgetPasswordThunk = createAsyncThunk(
    'forgetPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/forgetPassword`, { email });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An error occurred while processing forget password request.' });
        }
    }
);  

export const resetPasswordThunk = createAsyncThunk(
    'resetPassword',
    async ({ email, otp, newPassword }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/resetPassword`, {
                email,
                otp,
                newPassword
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An error occurred while resetting password.' });
        }
    }
);
