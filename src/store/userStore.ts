import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import friendsSlice from "./frinedsSlice";
import groupSlice from "./groupSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        friends: friendsSlice,
        group: groupSlice
    },
})

export type RootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;