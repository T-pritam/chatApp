import dbConnect from "@/lib/db";
import MessageModel from "@/model/Message";
import { v2 as cloudinary } from 'cloudinary';
import { pusherServer } from "@/lib/pusher";
import { ObjectId } from "mongoose";
import UserModel from "@/model/User";
import { Members } from "pusher-js";
import Group from "@/model/Group";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface cloudinaryUploadResult {
    public_id: string;
    asset_id: string;
    [key : string] : any
}

export async function POST(req: Request){
    await dbConnect();
    try {
        const formData = await req.formData();
        const senderId = formData.get("senderId") as string;
        const groupId = formData.get("groupId") as string;
        const senderUsername = formData.get("senderUsername") as string;
        const text = formData.get("text") as string;
        const fileType = formData.get("fileType") as string;
        const file = formData.get("file") as File | null;
        let fileUrl = "";
        let downloadUrl = "";
        
        if (file != null && fileType != "") {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const originalFileName = file?.name.split(".")[0];

            const Result = await new Promise<cloudinaryUploadResult>(
                (resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({
                        folder: 'chat_files',
                        resource_type: 'auto',
                        public_id: originalFileName,
                        use_filename: true, 
                        unique_filename: false,
                    },(error, result) => {
                        if (error) {
                            console.error('Error uploading to Cloudinary:', error);
                            reject(error);
                        }
                        resolve(result as unknown as cloudinaryUploadResult);
                    }
                    )
                    uploadStream.end(buffer);
                }
            )
            console.log(Result)
            console.log("Asset id : ",Result.asset_id)

            await MessageModel.create({
                senderId,
                text,
                groupId,
                fileType,
                fileUrl : Result.public_id,
                downloadUrl : Result.asset_id
            })
            fileUrl = Result.public_id
            downloadUrl = Result.asset_id
        } else{
            await MessageModel.create({
                senderId,   
                groupId,
                text,
                fileType,
                fileUrl,
                downloadUrl
            })
        }
        const group = await Group.findById(groupId)
        const memberIds = group.members.filter((userId : ObjectId) => String(userId) !== senderId)
        console.log(group)
        console.log(memberIds)
        await Promise.all(
            memberIds.map((userId : ObjectId) =>
              UserModel.updateOne(
                { _id: userId, "unReadMessages.id": groupId },
                { $inc: { "unReadMessages.$.count": 1 } }
              )
            )
          );
        pusherServer.trigger("groups", "new-messages", {
            groupId : groupId,
            senderId,
            senderUsername,  
            text,
            fileUrl,
            downloadUrl,
            fileType
        })
        pusherServer.trigger("groups-last-message", "new-messages", {
            groupId : groupId,
            senderId,
            senderUsername,  
            text,
            fileUrl,
            downloadUrl,
            fileType
        })
        return Response.json({
            status: true,
            message: "Message saved",
            fileUrl,
            downloadUrl
        })
        
    } catch (error) {
        console.log(error)
        return Response.json({ status: false, message: "Something went wrong" })
    }  
}

export async function GET(req: Request){
    await dbConnect();
    try {
        const { searchParams} = new URL(req.url)
        const id = searchParams.get("id")
        const senderId = searchParams.get("senderId")
        const messages = await MessageModel.find({
            groupId: id
        }).populate("senderId", "username email")
        await UserModel.updateOne(
            { _id: senderId, 'unReadMessages.id': id },
            { $set: { 'unReadMessages.$.count': 0 } }
        );
        return Response.json({ status: true, message: "Messages fetched successfully", messages })
        
    } catch (error) {
        console.log(error)
        return Response.json({ status: false, message: "Something went wrong" })
    }
}
