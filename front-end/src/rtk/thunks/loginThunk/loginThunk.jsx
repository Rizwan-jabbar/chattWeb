import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../utils/apiUrl";


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

