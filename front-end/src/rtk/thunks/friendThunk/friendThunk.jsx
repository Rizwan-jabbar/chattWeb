import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 




export const addFriend = createAsyncThunk(
    'addFriend',

    async ({ friendId, requestId }, { rejectWithValue }) => {
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/addFriend`, { friendId, requestId }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getFriends = createAsyncThunk(
    'getFriends',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/friends`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



export const deleteFriend = createAsyncThunk(
    'deleteFriend',
    async ({ friendId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/deleteFriend`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: { friendId }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
