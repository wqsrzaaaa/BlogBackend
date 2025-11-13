import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Router from './Route/Server.js';
import uploadRoutes from './Route/upload.js';
import 'dotenv/config'; 
import compression from 'compression';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cors());
app.use(compression())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/BlogUploads', express.static(path.join(__dirname, 'BlogUploads')));

app.use(uploadRoutes); 

app.use(Router);    

app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Backend is working!' });
});

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
