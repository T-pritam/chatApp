import dbConnect from "@/lib/db";
import UserModel from "@/model/User";

export async function GET(req: Request) {

    await dbConnect();
    try{
        const { searchParams } = new URL(req.url)        
        const id = searchParams.get("id")
        const user = await UserModel.findById(id).populate({
            path:"friends",
            select:"-password",
        }).select("-password")
        const count = user?.friends.length
        return Response.json({
            status:true,
            message:"Friends fetched successfully",
            user,
            count
        })
    } catch (error) {
        console.log(error)
        return Response.json({
            status : false,
            message : "Error while fetching friends"
        })
    }
}