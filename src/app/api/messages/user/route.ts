import dbConnect from "@/lib/db";
import MessageModel from "@/model/Message";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    await dbConnect();
    try {  
        const { senderId,receiverId,text,senderUsername } = await req.json()
        await MessageModel.create({
            senderId,
            receiverId,
            text
        })

        pusherServer.trigger(`user`, "new-message", {
            senderId,
            receiverId,
            text,
        })
        return Response.json({
            status: true,
            message: "Message saved"
        })

    } catch (error) {   
        console.log(error)
        return Response.json({
            status: false,
            message: "Message not saved"
        })
    }
}

export async function GET(req: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url)
        const senderId = searchParams.get("senderId")
        const receiverId = searchParams.get("receiverId")
        const messages = await MessageModel.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
        console.log("senderId : ",senderId," receiverId : ",receiverId)
        console.log(messages)
        return Response.json({
            status: true,
            messages
        })
    } catch (error) {
        console.log(error)
        return Response.json({
            
        })
    }

}