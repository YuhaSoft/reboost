import { Request } from 'express';
import multer from 'multer';
import path from 'path';

// Define storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Change this path as needed
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export const uploadProfileImage = upload.single('profileImage');

export const handleUpload = async (req: Request, res: any, next: any) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Continue with further processing, such as saving file info to the database
  // res.json({ success: true, filePath: req.file.path });
  next();
};
