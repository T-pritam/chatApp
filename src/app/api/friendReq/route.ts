import dbConnect from "@/lib/db";
import UserModel from "@/model/User";

export async function GET(req: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const user = await UserModel.findById(id);

        if (!user){
            return Response.json({
                status: false,
                message: "User not found",
            });
        }
        const usersToShow = await UserModel.find({
            _id: { $ne: id,
                $nin: user.friendRequest
             }
          });        
        return Response.json({
            status: true,
            message: "Users fetched successfully",
            users: usersToShow,
        })
    } catch (error) {
        console.log(error);
        return Response.json({
            status: false,
            message: "Something went wrong",   
        });
    }
}