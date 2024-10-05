import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { User } from "lucide-react";
import { date } from "zod";
import { sendVerificationEmail } from "@/lib/sendVerificationmail";
import { json } from "stream/consumers";

export async function POST(req : Request){
    await dbConnect()

    try {
        const {username,email,password} = await req.json()
        const existingUserByEmail = await UserModel.findOne({email})
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    status : false,
                    message: "User already exists with this email"
                })
            }
            else{
                existingUserByEmail.password = await bcrypt.hash(password,10)
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else{
            const hashedpassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const user = new UserModel({
                username,
                password: hashedpassword,
                email,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                messages : []
            })
            await user.save()
        }
        const emailResponse = await sendVerificationEmail(email,username,verifyCode)
        if (!emailResponse){
            return Response.json({
                status : false,
                message : "Failed to send verification email."
            })
        }

        return Response.json({
            status : true,
            message : "User Registered and Verifiaction Email sent"
        })

    } catch (error) {
        console.log("Error user Registrtion",error)
        return Response.json({
            status : false,
            message : "User Registration failed"
        })
    }    
}
