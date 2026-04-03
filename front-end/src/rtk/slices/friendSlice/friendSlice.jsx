import  { createSlice } from '@reduxjs/toolkit';
import { addFriend , getFriends , deleteFriend } from '../../thunks/friendThunk/friendThunk';


const friendSlice = createSlice({
    name: 'friend',
    initialState: {
        friends: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addFriend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFriend.fulfilled, (state, action) => {
                state.loading = false;
                state.friends.push(action.payload);
            })  
            .addCase(addFriend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(getFriends.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFriends.fulfilled, (state, action) => {
                state.loading = false;
                state.friends = action.payload;
            })
            .addCase(getFriends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(deleteFriend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFriend.fulfilled, (state, action) => {
                state.loading = false;
                state.friends = state.friends.filter(
                    (friend) => friend.friendId?._id !== action.payload.friendId
                );
            })
            .addCase(deleteFriend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default friendSlice.reducer;
