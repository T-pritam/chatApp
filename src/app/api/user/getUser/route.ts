import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import { verifyToken } from "@/lib/jwt";

export async function GET(req : Request) {

    await dbConnect();
    try {
        const { searchParams } = new URL(req.url)
        const token = searchParams.get("token")
        const id = verifyToken(token as string)
        if (!id) {
            return Response.json({
                status : false,
                message : "Invalid token"
            })
        }
        const user = await UserModel.findById(id).select("-password")

        return Response.json({
            status : true,
            data : "User fetched successfully",
            user
        })

        
    } catch (error) {
        console.log(error);
        return Response.json({
            status : false,
            message : "Error while fetching user"
        })
    }
}