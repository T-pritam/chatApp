import dbConnect from "@/lib/db";
import { createToken } from "@/lib/jwt";
import { v2 as cloudinary } from 'cloudinary';
import UserModel from "@/model/User";

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

export async function POST(req:Request){
    const {email,username,profileImgUrl} = await req.json()
    await dbConnect()

    try{
        const existingUser = await UserModel.findOne({email : email})
        if(existingUser){
            const token = createToken(existingUser)
            return Response.json({
                status : true,
                message : "Login successful",
                token,
                user : existingUser
            })
        } else {
            
            const imageResponse = await fetch(profileImgUrl);
            const arrayBuffer = await imageResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const originalFileName = profileImgUrl.split("/").pop()?.split(".")[0] || "uploaded_image";

            const result = await new Promise<cloudinaryUploadResult>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                  {
                    folder: 'chat_files',
                    resource_type: 'auto', // Automatically detect resource type (image, video, etc.)
                    public_id: originalFileName,
                    use_filename: true,
                    unique_filename: false, // Preserve original filename
                  },
                  (error, result) => {
                    if (error) {
                      console.error('Error uploading to Cloudinary:', error);
                      reject(error);
                    }
                    resolve(result as unknown as cloudinaryUploadResult);
                  }
                );
          
                uploadStream.end(buffer);
            });

            const user = await UserModel.create({
                email,
                username,
                profileImgUrl : result.secure_url || profileImgUrl,
                isVerified : true,
                password:"googleLogin",
                passwordResetToken: "P",
                passwordResetExpires: new Date(),
                verifyCode : Math.floor(100000 + Math.random() * 900000).toString(),
                verifyCodeExpiry : new Date(Date.now() + 3600000),
                messages : []
            })
            const token = createToken(user)
            return Response.json({
                status : true,
                message : "Login successful",
                token,
                user
            })
        }

    } catch (error) {
        console.log(error);
        return Response.json({status : false, message : "Something went wrong"})
    }

}