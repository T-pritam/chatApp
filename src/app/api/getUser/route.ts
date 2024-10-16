import dbConnect from "@/lib/db";
import UserModel from "@/model/User";

export async function GET(req : Request) {

    await dbConnect();
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
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