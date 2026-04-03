import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../utils/apiUrl";



export const deactivateAccountThunk = createAsyncThunk(
    'deactivateAccount',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/deactivate`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data || { message: 'An error occurred while deactivating the account.' }
            );
        }
    }
);
