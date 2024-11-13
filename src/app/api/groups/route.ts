import dbConnect from "@/lib/db";
import GroupModel from "@/model/Group";

export async function GET(req: Request) {
    await dbConnect();
    try{
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const group = await GroupModel.findById(id).populate("members","username email profileImgUrl").populate("createdBy","username email profileImgUrl").populate("admins","username email profileImgUrl");
    // const members = group.members.filter((id : string) => !group.admins.map((id : string) => id.toString()).includes(id))
    // const member = group.members.filter((m : any) => m._id.toString() === id)
    const adminIds = new Set(group.admins.map((admin : any) => admin._id.toString()));
    const nonAdminMembers = group.members.filter(
    (member : any) => !adminIds.has(member._id.toString())
    );
    return Response.json({ 
        status: true, 
        message: "Group fetched successfully", 
        group,
        members : nonAdminMembers
    }); 
    } catch (error) {
        console.log(error);
        return Response.json({ status: false, message: "Something went wrong" });
    }
}