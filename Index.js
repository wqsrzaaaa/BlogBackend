import express from 'express';
import cors from 'cors';
import Router from './Route/Server.js';
import uploadRoutes from './Route/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const app = express();

// --- __dirname fix for ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MongoDB connection ---
mongoose.connect('mongodb://127.0.0.1:27017/Blog')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// --- Middleware ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// --- Routes ---
app.use(Router);
app.use(uploadRoutes);

// --- Static folders ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/BlogUploads', express.static(path.join(__dirname, 'BlogUploads')));

// --- Serve frontend build (React) ---
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all route to serve frontend for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// --- Test route ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is live at port ${PORT}`);
});
