import dbConnect from '@/lib/db';
import UserModel from '@/model/User';
import Group from '@/model/Group';
import { z } from 'zod';
import { groupnameValidation } from '@/schema/groupnameSchema';

const UsernameQuerySchema = z.object({
  username: groupnameValidation,
});

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get("groupname")
        }
        const result = UsernameQuerySchema.safeParse(queryParams)
        if(!result.success){
            const usernameErrors = result.error?.format().username?._errors || [];
            return Response.json({
                status : false,
                message : usernameErrors?.length > 0 
                ? usernameErrors.join()
                : "Invalid query parameter"
            })
        }

        const {username} = result.data
        const existingVerifiedUser = await Group.findOne({
            name : username,
            isVerified: true
        })
        if (existingVerifiedUser) {
            return Response.json({
                status: false,
                message: "Groupname is not available"
            })
        }
        return Response.json({
            status: true,
            message: "Groupname is unique"
        })    
    } catch (error) {
        console.log("Error Checking username",error)
        return Response.json({
            success : false,
            message : "Error Checking username"
        })
    }
}