import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { createToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req:Request){
    await dbConnect()
    const cookieStore = cookies()

    try {
        const {email,password} = await req.json()
        console.log(email,password)
        const user = await UserModel.findOne({
            $or:[
                {email : email},
                {username : email}
            ]
        })

        if (!user){
            return Response.json({
                status : false,
                message : "User not found"
            })
        }
        if (!user.isVerified){
            return Response.json({
                status : false,
                message : "Please verify your account before login"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if (isPasswordCorrect) {
            const token = createToken(user)
            cookieStore.set('auth', token)
            cookieStore.set({
                name: 'auth',
                value: token,
                path: '/', 
                httpOnly: true, 
                maxAge: 60 * 60 * 24, // Expire after 1 day
              });
            return Response.json({
                status : true,
                message : "Login successful"
            })
        }else{
            return Response.json({
                status : false,
                message : "Invalid credentials"
            })
        }
    } catch (error) {
        console.log("error in login",error)
        return Response.json({
            status : false,
            message : "Something went wrong"
        })
    }
}