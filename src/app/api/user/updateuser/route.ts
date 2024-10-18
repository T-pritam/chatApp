import dbConnect from "@/lib/db";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url)
        const token = searchParams.get("id")
        const {username,about} = await req.json()
        const user = await UserModel.findByIdAndUpdate(token,{
            username,
            about
        })

        return Response.json({
            status : true,
            data : "User updated successfully",
            user
        })

    } catch (error) {
        console.log(error);
        return Response.json({
            status : false,
            message : "Error while updating user"
        })
    }
}
