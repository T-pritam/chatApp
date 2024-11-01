import dbConnect from "@/lib/db";
import MessageModel from "@/model/Message";
import { pusherServer } from "@/lib/pusher";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface cloudinaryUploadResult {
    public_id: string;
    [key : string] : any
}

export async function POST(req: Request) {
    await dbConnect();
    try {  
        const formData = await req.formData();
        const senderId = formData.get("senderId") as string;
        const receiverId = formData.get("receiverId") as string;
        const text = formData.get("text") as string;
        const fileType = formData.get("fileType") as string;
        const file = formData.get("file") as File | null;
        const originalFileName = file?.name.split(".")[0];

        if (file != null) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

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
                        resolve(result as cloudinaryUploadResult);
                    }
                    )
                    uploadStream.end(buffer);
                }
            )
            console.log(Result)

            await MessageModel.create({
                senderId,
                receiverId,
                text,
                fileType,
                fileUrl : Result.public_id
            })
        }
        
        // const { senderId,receiverId,text } = await req.json()
        // await MessageModel.create({
        //     senderId,
        //     receiverId,
        //     text
        // })

        // pusherServer.trigger(`user`, "new-message", {
        //     senderId,
        //     receiverId,
        //     text,
        // })
        // pusherServer.trigger(`user-last-message`, "new-message", {
        //     senderId,
        //     receiverId,
        //     text,
        // })
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