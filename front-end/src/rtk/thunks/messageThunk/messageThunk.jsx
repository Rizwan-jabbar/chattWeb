import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../utils/apiUrl";


export const sendMessage = createAsyncThunk(
    "sendMessage",
    async ({ recipientId, content }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/messages`,
                { recipientId, content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const getMessages = createAsyncThunk(
    "getMessages",
    async (friendId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/messages/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const markMessagesAsRead = createAsyncThunk(
    "markMessagesAsRead",
    async (friendId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(`${API_URL}/messages/${friendId}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { ...response.data, friendId };
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: "An error occurred while marking messages as read." });
        }
    }
);

export const sendVoiceMessage = createAsyncThunk(
    "sendVoiceMessage",
    async ({ recipientId, audioFile }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("recipientId", recipientId);
            formData.append("audio", audioFile);

            const response = await axios.post(`${API_URL}/voiceMessages`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: "An error occurred while sending voice message." });
        }
    }
);


export const sendPictureMessage = createAsyncThunk(
    "sendPictureMessage",
    async ({ recipientId, pictureFile }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("recipientId", recipientId);
            formData.append("picture", pictureFile);
            const response = await axios.post(`${API_URL}/pictureMessages`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: "An error occurred while sending picture message." });
        }
    }
);

export const saveVoiceCallHistory = createAsyncThunk(
    "saveVoiceCallHistory",
    async ({ recipientId, duration, status = "completed" }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/callMessages`,
                { recipientId, duration, status },
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
            return rejectWithValue({ message: "An error occurred while saving call history." });
        }
    }
);
