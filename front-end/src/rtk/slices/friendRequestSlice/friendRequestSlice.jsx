import { getFriendRequests, sendFriendRequest , removeFriendRequest } from "../../thunks/friendsRequestThunk/friendRequestThunk";
import { createSlice } from "@reduxjs/toolkit";




const friendRequestSlice = createSlice({
    name: 'friendRequest',
    initialState: {
        friendRequests: [],
        loading: false,

    },
    reducers: {},
    extraReducers: (builder) => {   
        builder
            .addCase(sendFriendRequest.pending, (state) => {
                state.loading = true;
            }   )   
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.loading = false;
            }
            )
            .addCase(sendFriendRequest.rejected, (state) => {
                state.loading = false;
            }
            )
            .addCase(getFriendRequests.pending, (state) => {
                state.loading = true;
            }
            )
            .addCase(getFriendRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.friendRequests = action.payload;
            }
            )
            .addCase(getFriendRequests.rejected, (state) => {   
                state.loading = false;
            }
            )
            .addCase(removeFriendRequest.pending, (state) => {
                state.loading = true;
            }
            )
            .addCase(removeFriendRequest.fulfilled, (state, action) => {
                state.loading = false;
            }
            )
            .addCase(removeFriendRequest.rejected, (state) => {
                state.loading = false;
            }
            )
    }
});

export default friendRequestSlice.reducer;
