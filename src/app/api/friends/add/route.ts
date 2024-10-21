import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import { pusherServer } from "@/lib/pusher";

export async function GET(req: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        console.log("id : " , id);
        const user = await UserModel.findById(id);

        if (!user){
            return Response.json({
                status: false,
                message: "User not found",
            });
        }
        const idsToExclude = [...user.friendRequest, ...user.friendRequestReceived, ...user.friends];
        const usersToShow = await UserModel.find({
            _id: { 
                $ne: id,
                $nin: idsToExclude,
            }
          });        
        const sendReq = await UserModel.find({
            _id: { 
                $in: user.friendRequest
            }
        })
        return Response.json({
            status: true,
            message: "Users fetched successfully",
            users: usersToShow,
            sendReq
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
        const { sender, reciever, send } = await req.json();
        const senderUser = await UserModel.findById(sender);
        const recieverUser = await UserModel.findById(reciever);
        if (!senderUser || !recieverUser) {
            return Response.json({
                status: false,
                message: "Sender or reciever not found",
            });
        }
        if (send) {
            senderUser.friendRequest.push(reciever);
            recieverUser.friendRequestReceived.push(sender);
            senderUser.save();
            recieverUser.save();
            console.log(`user-${recieverUser._id}`);
            pusherServer.trigger(`user-${recieverUser._id}`, "friend-request", {
                message: "Friend request sent", 
                sender: senderUser,
            })
            return Response.json({
                status: true,
                message: "Friend request sent successfully",
            });
        } else {
            await UserModel.updateOne(
                { _id: sender },
                { $pull: { friendRequest: recieverUser._id } }
            );
            await UserModel.updateOne(
                { _id: reciever },
                { $pull: { friendRequestReceived: senderUser._id } }
            );
            pusherServer.trigger(`user-${recieverUser._id}`, "friend-request-remove", {
                sender: senderUser,
            })
            return Response.json({
                status: true,
                message: "Friend request removed successfully",
            });
        }
    } catch (error) {
        console.log(error);
        return Response.json({
            status: false,
            message: "Something went wrong",
        });
    }
}