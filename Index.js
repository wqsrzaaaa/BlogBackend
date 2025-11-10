import express from 'express';
import cors from 'cors';
import Router from './Route/Server.js';
import uploadRoutes from './Route/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();

// --- __dirname fix for ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MongoDB connection ---
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

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

// --- Serve frontend build (optional) ---
app.use(express.static(path.join(__dirname, '../frontend/build')));

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
