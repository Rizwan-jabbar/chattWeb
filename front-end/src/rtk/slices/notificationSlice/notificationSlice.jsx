import { createSlice } from "@reduxjs/toolkit";
import { sendNotificationThunk , getNotificationsThunk , markNotificationAsReadThunk } from "../../thunks/notificationThunk/notificationThunk";
const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notifications: [],
        loading: false,
        error: null
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        }


    }, extraReducers: (builder) => {
        builder
            .addCase(sendNotificationThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(sendNotificationThunk.fulfilled, (state) => {
                state.loading = false;
            }
            )
            .addCase(sendNotificationThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
            ).addCase(getNotificationsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(getNotificationsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            }
            )
            .addCase(getNotificationsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
            ).addCase(markNotificationAsReadThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(markNotificationAsReadThunk.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.notifications.findIndex(notification => notification._id === action.payload._id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
            }
            )
            .addCase(markNotificationAsReadThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
            );
    }
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
