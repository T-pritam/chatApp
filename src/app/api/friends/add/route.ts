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
            _id: { 
                $ne: id,
                $nin: [user.friendRequest, user.friendRequestReceived, user.friends],
            }
          });        
        console.log("usersToShow : " , usersToShow);
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

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { sender, reciever } = await req.json();
        const senderUser = await UserModel.findById(sender);
        const recieverUser = await UserModel.findById(reciever);
        if (!senderUser || !recieverUser) {
            return Response.json({
                status: false,
                message: "Sender or reciever not found",
            });
        }
        console.log(senderUser, recieverUser);
        senderUser.friendRequest.push(reciever);
        recieverUser.friendRequestReceived.push(sender);
        senderUser.save();
        recieverUser.save();
        return Response.json({
            status: true,
            message: "Friend request sent successfully",
        });
    } catch (error) {
        console.log(error);
        return Response.json({
            status: false,
            message: "Something went wrong",
        });
    }
}