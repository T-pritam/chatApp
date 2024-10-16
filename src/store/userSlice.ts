import { createSlice } from "@reduxjs/toolkit";
import jwt from 'jsonwebtoken';
import { log } from "console";
import { get } from "http";

interface UserState {
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
            const token =localStorage.getItem("token")            
            console.log(token)
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
        // retriveUser : (state,action) => {
        //     const token = localStorage.getItem("token")
        //     if(token){
        //         const id = jwt.verify(token,"secret")
        //         const data = await fetch(`/api/user/${id}`)
        //         const user = await data.json()
        //         state = user
        //     }
        // }
    }
});

export const {login,logout} = userSlice.actions
export default userSlice.reducer