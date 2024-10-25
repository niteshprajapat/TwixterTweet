import multer from 'multer'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import { storage } from '../middlewares/multer.js'


// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });






// Upload Media Function
export const uploadMedia = async (req, res) => {
    try {
        // Handle file upload with Multer
        upload.single('media')(req, res, async (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({ message: 'File size exceeds the limit' });
                    }
                    return res.status(500).json({ message: 'Multer error: ' + err.message });
                } else {
                    return res.status(500).json({ message: 'Internal server error: ' + err.message });
                }
            }

            // If file is not uploaded, return error
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const inputPath = req.file.path;
            const fileType = req.file.mimetype.split('/')[0]; // Extract the type (image or video)
            console.log("File saved to:", inputPath);

            // Determine resource type for Cloudinary
            const resourceType = fileType === 'image' ? 'image' : 'video';

            // Upload the file to Cloudinary
            try {
                const result = await cloudinary.uploader.upload(inputPath, { resource_type: resourceType });
                console.log('Upload to Cloudinary successful:', result);

                // Delete the file from the local 'uploads' directory after uploading to Cloudinary
                fs.unlink(inputPath, (unlinkError) => {
                    if (unlinkError) {
                        console.error('Error deleting local file:', unlinkError);
                    } else {
                        console.log('Local file deleted successfully');
                    }
                });

                return res.status(200).json({
                    success: true,
                    message: `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} uploaded successfully`,
                    url: result.secure_url, // Cloudinary URL
                });

            } catch (uploadError) {
                console.error('Error uploading to Cloudinary:', uploadError);
                return res.status(500).json({ message: 'Error uploading to Cloudinary' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error handling media upload' });
    }
};
