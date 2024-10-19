import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import friendsSlice from "./frinedsSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        friends: friendsSlice
    },
})

export type RootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;