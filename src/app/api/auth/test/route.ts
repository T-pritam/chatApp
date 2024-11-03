import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    const data = await req.formData();
    const file = data.get('file') as File;

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' });
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw', // Important for non-image files like PDFs
                    folder: 'pdf_files',
                    use_filename: true,
                    unique_filename: false,
                },
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        // Construct a URL for downloading the PDF with the original filename and forced as an attachment
        const downloadUrl = cloudinary.url(uploadResult.public_id, {
            resource_type: 'raw',
            type: 'upload',
            flags: 'attachment',
            format: 'pdf',
        });

        return NextResponse.json({
            success: true,
            url: downloadUrl,
            original_filename: uploadResult.original_filename,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Upload failed', error });
    }
}
