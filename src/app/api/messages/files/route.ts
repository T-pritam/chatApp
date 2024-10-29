// app/api/messages/route.ts
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import Message from '@/model/Message';
import dbConnect from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { rejects } from 'assert';
import { Result } from 'postcss';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface cloudinaryUploadResult {
    public_id: string;
    [key : string] : any
}

export async function POST(request: Request) {


    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ message: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const Result = await new Promise<cloudinaryUploadResult>(
            (resolve,reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'chat_files',
                    },
                    (error, result) => {
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
        console.log("File Public ID : ",Result.public_id)
        return NextResponse.json({ message: 'File uploaded successfully', url: Result.public_id }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
    }
}
