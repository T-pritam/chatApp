import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import mongoose from "mongoose";


export async function GET(req: Request) {
    await dbConnect();
        try {
            const { searchParams } = new URL(req.url)
            const id = searchParams.get("id")
            const user = await UserModel.findById(id).populate({
                path:"friendRequestReceived",
                select : '-password',
            }).select("-password")
            return Response.json({ status: true, data: "Friends fetched successfully", user })
        
    } catch (error) {
        console.log(error)
        return Response.json({
            status : false,
            message : "Something went wrong"
        })
    }
}

export async function POST(req: Request) {
    await dbConnect();
        try {
            const { sender, reciever,accept } = await req.json()
            const senderUser = await UserModel.findById(sender)
            const recieverUser = await UserModel.findById(reciever)
            if (!senderUser || !recieverUser) {
                return Response.json({
                    status : false,
                    message : "Sender or reciever not found"
                })
            }
            if (accept){
                senderUser.friends.push(reciever)
                recieverUser.friends.push(sender)
                await UserModel.updateOne(
                    { _id: sender },
                    { $pull: { friendRequest: recieverUser._id } }
                  );
                await UserModel.updateOne(
                    { _id: reciever },
                    { $pull: { friendRequestReceived: senderUser._id } }
                  );
                senderUser.save()
                recieverUser.save()
                return Response.json({
                    status : true,
                    message : "Friend request Accepted"
                })
            } else {
                console.log("runned")
                await UserModel.updateOne(
                    { _id: sender },
                    { $pull: { friendRequest: recieverUser._id } }
                  );
                await UserModel.updateOne(
                    { _id: reciever },
                    { $pull: { friendRequestReceived: senderUser._id } }
                  );
                
                return Response.json({
                    status : true,
                    message : "Friend request Rejected"
                })
            }
    } catch (error) {
        console.log(error)
        return Response.json({
            status : false,
            message : "Something went wrong"
        })
    }
}