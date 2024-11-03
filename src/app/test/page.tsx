'use client';

import React, { useState } from 'react';

export default function Page() {
    const [file, setFile] = useState<File | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setFileName(selectedFile.name); // Save the original filename
        } else {
            alert('Please upload a PDF file.');
        }
    };

    const uploadPdf = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/auth/test', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                setDownloadUrl(data.url); // Use the returned URL
            } else {
                console.error('Upload failed:', data.message);
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Upload and Download PDF</h1>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button
                onClick={uploadPdf}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Upload PDF
            </button>
            {downloadUrl && fileName && (
                <a
                    href={downloadUrl}
                    className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded"
                    download={fileName} // Sets the download filename
                >
                    Download {fileName}
                </a>
            )}
        </div>
    );
}