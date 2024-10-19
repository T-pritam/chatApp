import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
    _id : string,
    username: string
    email: string
    isVerified: boolean
    about: string
}

const initialState: UserState = {
    _id: "",
    username: "",
    email: "",
    isVerified: false,
    about: ""
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login : (state,action) => {
            state._id = action.payload._id
            state.username = action.payload.username
            state.email = action.payload.email
            state.isVerified = action.payload.isVerified
            state.about = action.payload.about
        },
        logout : (state) => {
            localStorage.removeItem("token")
            state = initialState
        },
        updateUsername : (state,action) => {
            state.username = action.payload.username
        },
        updateAbout : (state,action) => {
            state.about = action.payload.about
        },        
    }
});

export const {login,logout,updateUsername,updateAbout} = userSlice.actions
export default userSlice.reducer