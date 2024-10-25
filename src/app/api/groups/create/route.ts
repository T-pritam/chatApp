import dbConnect from "@/lib/db";
import GroupModel from "@/model/Group";


export async function POST(request: Request) {

    await dbConnect();
    try {
        const { name, description, admins, members } = await request.json();
        const group = await GroupModel.create({
            name,
            description,
            members : [admins, ...members],
            admins : [admins]
        })
        return Response.json({
            status: true,
            message: "Group created successfully",
            group
        })
        
    } catch (error) {
        console.log(error)
        return Response.json({
            status: false,
            message: "Something went wrong"
        })
    }
}