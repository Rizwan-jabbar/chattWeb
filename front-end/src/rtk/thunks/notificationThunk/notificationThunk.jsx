import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL

export const sendNotificationThunk = createAsyncThunk(
  '/sendNotification',
  async ({ recipientId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/notifications`,
        { recipientId, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);




export const getNotificationsThunk = createAsyncThunk(
  '/getNotifications',
  async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/notifications`, { 
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
    }
);

export const markNotificationAsReadThunk = createAsyncThunk(
  '/markNotificationAsRead',
  async ({ notificationId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/notifications/${notificationId}`,
        { isRead: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);