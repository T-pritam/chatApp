import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userSlice";

export interface groupState {
    group : UserState[],
}

const initialState: groupState = {
    group: [],
}

export const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        adduser : (state, action) => {
            if (!state.group.find((user : UserState) => user._id === action.payload._id)) {
                state.group = [...state.group, action.payload]
            }
        },
        removeuser : (state, action) => {
            state.group = state.group.filter((user : UserState) => user._id !== action.payload._id)
        },
        deleteall : (state) => {
            state.group = []
        }
    },
})

export const { adduser,removeuser,deleteall } = groupSlice.actions
export default groupSlice.reducer