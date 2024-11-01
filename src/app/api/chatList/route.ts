import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import Group from "@/model/Group";
import Message from "@/model/Message";

export async function GET(req: Request) {

    await dbConnect();
    try{
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        const user = await UserModel.findById(id)
                        .populate('friends', 'username')
                        .populate('groups', 'name')
                        .exec();
        if(!user) {
            return Response.json({
                status : false,
                message : "User not found"
            })
        }
        const friendMessages = await Promise.all(
        user.friends.map(async (friendId) => {
        const lastMessage = await Message.findOne({
            $or: [
            { senderId: id, receiverId: friendId },
            { senderId: friendId, receiverId: id },
            ],
        })
            .sort({ createdAt: -1 })
            .exec();
        return {
            friendId,
            lastMessageType : lastMessage ? lastMessage.fileType : null,
            lastMessage: lastMessage ? lastMessage.text : null,
            lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        };
        })
    );

    const groupMessages = await Promise.all(
      user.groups.map(async (groupId) => {
        const group = await Group.findById(groupId, 'name');
        const lastMessage = await Message.findOne({ groupId })
          .sort({ createdAt: -1 })
          .exec();
        const sender = await UserModel.findById(lastMessage?.senderId);
        return {
          groupId,
          lastMessageType : lastMessage ? lastMessage.fileType : null,
          lastMessage: lastMessage ? lastMessage.text : null,
          lastMessageSender: sender?.username,
          lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        };
      })
    );

    const sortedData = [...friendMessages, ...groupMessages].sort(
      (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
    );
    return Response.json({
        status : true,
        message : "Chat list fetched successfully",
        data : sortedData
    })
    } catch(error) {
        console.log(error)
        return Response.json({
            status : false,
            message : "Something went wrong"
        })
    }
}