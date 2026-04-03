import { createSlice } from "@reduxjs/toolkit";
import {
    getMessages,
    markMessagesAsRead,
    saveVoiceCallHistory,
    sendMessage,
    sendPictureMessage,
    sendVoiceMessage
} from "../../thunks/messageThunk/messageThunk";


const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: [],
        loading: false,
        error: null
    },
    reducers: {
        clearMessageError: (state) => {
            state.error = null;
        },
        clearMessages: (state) => {
            state.messages = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Unable to send message.";
            }).addCase(sendVoiceMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendVoiceMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push(action.payload);
            })
            .addCase(sendVoiceMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Unable to send voice message.";
            }).addCase(getMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Unable to load messages.";  
                }).addCase(sendPictureMessage.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(sendPictureMessage.fulfilled, (state, action) => {
                    state.loading = false;
                    state.messages.push(action.payload);
                })
                .addCase(sendPictureMessage.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.message || "Unable to send picture message.";
                })
                .addCase(saveVoiceCallHistory.fulfilled, (state, action) => {
                    state.messages.push(action.payload);
                    state.error = null;
                })
                .addCase(markMessagesAsRead.fulfilled, (state) => {
                    state.error = null;
                });
    }
});
export const { clearMessageError, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
