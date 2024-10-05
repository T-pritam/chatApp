import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import jwt from 'jsonwebtoken';

export async function GET(req : Request) {
    const cookieStore = cookies();
    const token = cookieStore.get("auth");
    console.log( "token : ", token)
    if (token) {
        const user = jwt.verify(token.value, "secret")
        return Response.json({
            status: true,
            message : "success",
            user : user
        });
    }
    else{
        console.log("token not found")
        return Response.json({
            status: false,
            user: null
        })
    }
}