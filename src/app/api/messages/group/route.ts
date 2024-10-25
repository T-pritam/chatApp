import dbConnect from "@/lib/db";
import MessageModel from "@/model/Message";
import { pusherServer } from "@/lib/pusher";


export async function GET(req: Request){
    await dbConnect();
    try {
        const { searchParams} = new URL(req.url)
        const id = searchParams.get("id")
        const messages = await MessageModel.find({
            groupId: id
        }).populate("senderId", "username email")
        return Response.json({ status: true, message: "Messages fetched successfully", messages })
        
    } catch (error) {
        console.log(error)
        return Response.json({ status: false, message: "Something went wrong" })
    }
}

export async function POST(req: Request){
    await dbConnect();
    try {
        const { groupId, text, senderId } = await req.json()
        await MessageModel.create({
            groupId,
            text,
            senderId
        })
        pusherServer.trigger(`group-${groupId}`, "new-message", {
            senderId,
            sendername : senderId.username,  
            text  
        })
        return Response.json({ status: true, message: "Message saved" })
        
    } catch (error) {
        console.log(error)
        return Response.json({ status: false, message: "Something went wrong" })
    }  
}