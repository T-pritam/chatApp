import dbConnect from '@/lib/db';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schema/usernameScema'
import { log } from 'console';
import { User } from 'lucide-react';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryParams)
        if(!result.success){
            const usernameErrors = result.error?.format().username?._errors || [];
            console.log(usernameErrors)
            return Response.json({
                status : false,
                message : usernameErrors?.length > 0 
                ? usernameErrors.join()
                : "Invalid query parameter"
            })
        }

        const {username} = result.data
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingVerifiedUser) {
            return Response.json({
                status: false,
                message: "username is not available"
            })
        }
        return Response.json({
            status: true,
            message: "username is unique"
        })    
    } catch (error) {
        console.log("Error Checking username",error)
        return Response.json({
            success : false,
            message : "Error Checking username"
        })
    }
}
