import multer from "multer";
import path from 'path';

// const storage = multer.memoryStorage();

// export const uploadFile = async (req, res, next) => {
//     multer({ storage }).single("file");

//     next();
// }


// Set up Multer to handle file upload to local storage first
export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure 'uploads/' directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    }
});