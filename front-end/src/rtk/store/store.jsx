import { configureStore } from "@reduxjs/toolkit";

import registerReducer from "../slices/registerSlice/registerSlice";
import loginReducer from "../slices/loginSlice/loginSlice";
import userProfileReducer from "../slices/userProfileSlice/userProfileSlice";
import friendRequestReducer from "../slices/friendRequestSlice/friendRequestSlice";
import friendReducer from "../slices/friendSlice/friendSlice";
import messageReducer from "../slices/messageSlice/messageSlice";
import notificationReducer from "../slices/notificationSlice/notificationSlice";
const store = configureStore({
    reducer: {
        register: registerReducer,
        login: loginReducer, 
        userProfile: userProfileReducer,
        notification: notificationReducer,
        friendRequest: friendRequestReducer,
        friend: friendReducer,
        message: messageReducer
    }
})

export default store;