import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadPath = 'uploads/';
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

//  Profile Picture
router.post('/upload-profile', upload.single('profile'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const filePath = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ success: true, url: filePath });
});

//  Banner Picture
router.post('/upload-banner', upload.single('banner'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const filePath = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ success: true, url: filePath });
});

router.post('/blog/upload', upload.single('blog'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const filePath = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ success: true, url: filePath });
});




export default router;
