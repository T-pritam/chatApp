import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userSlice";

export interface friendsState {
    friends: UserState[],
    friendsRequest: UserState[],
    friendsRequestReceived: UserState[],
    friendsRequestSent: UserState[]
}

const initialState: friendsState = {
    friends: [],
    friendsRequest: [],
    friendsRequestReceived: [],
    friendsRequestSent: []
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
        setFriendsRequestSent: (state, action) => {
            state.friendsRequestSent = action.payload
        },
        updateFriends: (state, action) => {
            state.friends = [...state.friends, action.payload]
        },
        removeFriendsRequest: (state, action) => {
            state.friendsRequest = state.friendsRequest.filter((user) => user._id !== action.payload._id)
        },
        addFriendsRequest: (state, action) => {
            state.friendsRequest = [...state.friendsRequest, action.payload]  
        },
        addFriendsRequestSent: (state, action) => {
            state.friendsRequestSent = [...state.friendsRequestSent, action.payload]
        },
        removeFriendsRequestSent: (state, action) => {
            state.friendsRequestSent = state.friendsRequestSent.filter((user) => user._id !== action.payload._id)
        },
        addFriendsRequestReceived: (state, action) => {
            state.friendsRequestReceived = [...state.friendsRequestReceived, action.payload]
        },
        removeFriendsRequestReceived: (state, action) => {
            state.friendsRequestReceived = state.friendsRequestReceived.filter((user) => user._id !== action.payload._id)
        }
    },
})

export const { setFriends, setFriendsRequest, setFriendsRequestReceived, updateFriends, setFriendsRequestSent,
    removeFriendsRequest, addFriendsRequest, addFriendsRequestReceived, removeFriendsRequestReceived,
    addFriendsRequestSent, removeFriendsRequestSent
 } = friendsSlice.actions
export default friendsSlice.reducer