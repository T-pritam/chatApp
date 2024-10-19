import dbConnect from "@/lib/db";
import UserModel from "@/model/User";


export async function GET(req: Request) {

    await dbConnect();
    const users = await UserModel.find({});
    users.forEach((user) => {
        UserModel.findByIdAndUpdate(user._id, {
            $set: {
                friends: []
            }
        })
    });
    return Response.json({ users });
}