import dbConnect from "@/lib/db";
import GroupModel from "@/model/Group";

export async function GET(req: Request) {
    dbConnect()
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        const group = await GroupModel.find({
            members: {
                $in: [id]
            }
        })
        return Response.json({ status: true, message: "Group fetched successfully", group })
        
    } catch (error) {
        console.log(error)
        return Response.json({ status: false, message: "Something went wrong" })
    }
}