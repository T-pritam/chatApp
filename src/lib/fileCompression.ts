// compressAndValidateFile.ts

import imageCompression from 'browser-image-compression';
import ffmpeg from 'fluent-ffmpeg';



/**
 * Compress image files and validate video files based on the specified rules.
 * @param {File} file - The file to be compressed or validated.
 * @param {number} maxSizeMB - Maximum size in MB for image files (default: 1MB).
 * @param {number} maxVideoSizeMB - Maximum size in MB for video files (default: 64MB).
 * @param {number} maxWidthOrHeight - Maximum width or height for image/video compression (default: 800px).
 * @returns {Promise<File | string >} - Returns the processed file if successful, otherwise an error message.
 */
export const compressAndValidateFile = async (
  file: File,
  maxSizeMB = 1,
  maxVideoSizeMB = 64,
  maxWidthOrHeight = 800
): Promise<File | string> => {
  // Supported file types
  const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const supportedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];

  // Check if the file is an image
  if (supportedImageTypes.includes(file.type)) {
    try {
      const options = {
        maxSizeMB, // Maximum size in MB for the compressed image
        maxWidthOrHeight, // Maximum width or height (maintaining aspect ratio)
        useWebWorker: true, // Uses Web Worker for a non-blocking compression
      };

      const compressedFile = await imageCompression(file, options);

      // Check if the size is within the specified limit
      if (compressedFile.size / 1024 / 1024 > maxSizeMB) {
        return 'Error: Compressed image size exceeds 1MB';
      }
      return compressedFile;
    } catch (error) {
      return 'Error: Image compression failed';
    }
  }

  if (supportedVideoTypes.includes(file.type)) {

   
  }

  return 'Error: Unsupported file type. Please upload an image or video file.';
};
