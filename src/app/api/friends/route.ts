import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import { log } from "console";
import { MdOutlineTheaterComedy } from "react-icons/md";

export async function GET(req: Request) {

    await dbConnect();
    try{
        const { searchParams } = new URL(req.url)
        console.log(searchParams);
        
        const id = searchParams.get("id")
        const user = await UserModel.findById(id).populate({
            path:"friends",
            select:"-password",
        }).select("-password")
        return Response.json({
            status:true,
            message:"Friends fetched successfully",
            user
        })
    } catch (error) {
        console.log(error)
        return Response.json({
            status : false,
            message : "Error while fetching friends"
        })
    }
}