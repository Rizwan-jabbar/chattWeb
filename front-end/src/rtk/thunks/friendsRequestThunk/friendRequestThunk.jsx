import  { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const sendFriendRequest = createAsyncThunk(
    'sendFriendRequest',
    async (receiverId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `${API_URL}/friendRequest`,
                { receiverId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const getFriendRequests = createAsyncThunk(
    'getFriendRequests',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(
                `${API_URL}/friendRequest`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const removeFriendRequest = createAsyncThunk(
    'removeFriendRequest',
    async (senderId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.delete(
                `${API_URL}/friendRequest`,
                {
                    data: { senderId },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);