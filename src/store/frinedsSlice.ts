import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userSlice";

export interface friendsState {
    friends: UserState[],
    friendsRequest: UserState[],
    friendsRequestReceived: UserState[],
}

const initialState: friendsState = {
    friends: [],
    friendsRequest: [],
    friendsRequestReceived: []
}

export const friendsSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        setFriends: (state, action) => {
            state.friends = action.payload
        },
        setFriendsRequest: (state, action) => {
            state.friendsRequest = action.payload
        },
        setFriendsRequestReceived: (state, action) => {
            state.friendsRequestReceived = action.payload
        },
        updateFriends: (state, action) => {
            state.friends = [...state.friends, action.payload]
        },
        updateFriendsRequest: (state, action) => {
            state.friendsRequest = state.friendsRequest.filter((user) => user._id !== action.payload._id)
        },
        updateFriendsRequestReceived: (state, action) => {
            state.friendsRequestReceived = [...state.friendsRequestReceived, action.payload]
        },
    },
})

export const { setFriends, setFriendsRequest, setFriendsRequestReceived, updateFriends, updateFriendsRequest, updateFriendsRequestReceived } = friendsSlice.actions
export default friendsSlice.reducer