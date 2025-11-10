import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Router from './Route/Server.js';
import uploadRoutes from './Route/upload.js';
import 'dotenv/config'; 
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- Static folders ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/BlogUploads', express.static(path.join(__dirname, 'BlogUploads')));

// --- Upload routes first (avoid conflicts with parameterized routes) ---
app.use(uploadRoutes); // Routes like /upload-profile, /upload-banner, /blog/upload

// --- API routes ---
app.use(Router);      // Routes like /signup, /login, /:blogId/like, etc.

// --- Test route ---
app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Backend is working!' });
});

// --- Serve React frontend ---
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
