import dbConnect from "@/lib/db";
import Group from "@/model/Group";
import UserModel from "@/model/User";
import { v2 as cloudinary } from 'cloudinary';

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

export async function POST(req: Request) {
    const formData = await req.formData();
    const userId = formData.get("senderId") as string;
    const groupId = formData.get("receiverId") as string;
    const file = formData.get("file") as File | null;
    let fileUrl = "";

    if (file != null) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const originalFileName = file?.name.split(".")[0];

        const Result = await new Promise<cloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: 'profile_imgs',
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
    
    if (groupId) {
        const group = await Group.findById(groupId);
        if (group) {
            
            group.profileImgUrl = Result.public_id;
            await group.save();
        }
    } else {
        const user = await UserModel.findById(userId);
        if (user) {
            // if (user.profileImgUrl != "") {
            //     await cloudinary.uploader.destroy(user.profileImgUrl);
            // }
            user.profileImgUrl = Result.public_id;
            await user.save();
        }
    }
    fileUrl = Result.public_id
}
    return Response.json({ status: true, message: "Image uploaded successfully", fileUrl });
}