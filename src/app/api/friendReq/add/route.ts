import dbConnect from "@/lib/db";
import UserModel from "@/model/User";


export async function POST(req: Request) {
    await dbConnect();
        try {
            const {sender,reciever} = await req.json()
            const senderUser = await UserModel.findById(sender)
            const recieverUser = await UserModel.findById(reciever)

            if(!senderUser || !recieverUser){
                return Response.json({
                    status : false,
                    message : "Sender not found"
                })
            }

            senderUser.friendRequest.push(reciever)
            recieverUser.friendRequestReceived.push(sender)
            senderUser.save()
            return Response.json({
                status : true,
                message : "Friend request sent"
            })
        
    } catch (error) {
        console.log(error)
        return Response.json({
            status : false,
            message : "Something went wrong"
        })
    }
}