import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'https://chatt-7yghfoimp-rizwan-jabbars-projects.vercel.app';
console.log('API URL in loginThunk:', API_URL);


export const loginThunk = createAsyncThunk(
    'login',
    async (loginData , {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/login` , loginData);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An error occurred while logging in.' });
        }
    }
)

