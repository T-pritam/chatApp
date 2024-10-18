import dbConnect from "@/lib/db";
import UserModel from "@/model/User";


export async function POST(req: Request) {
    await dbConnect();
        try {
        const {sender,reciever} = await req.json()
        const senderUser = await UserModel.findById(sender)

        if(!senderUser){
            return Response.json({
                status : false,
                message : "Sender not found"
            })
        }

        senderUser.friendRequest.filter((id) => id !== reciever)
        senderUser.friendRequestReceived.push(reciever)
        senderUser.save()
        return Response.json({
            status : true,
            message : "Friend request Accepted"
        })
        
    } catch (error) {
        console.log(error)
        return Response.json({
            status : false,
            message : "Something went wrong"
        })
    }
}