import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import apiRoutes from './routes.js';
import { User, Setting } from './models.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Admin setup function
const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'ramees baqavi' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('remees786', 10);
      await User.create({
        username: 'ramees baqavi',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin initialized');
    }
  } catch(err) {
    console.error('Admin init error:', err);
  }
};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/al-bayan-kunnath')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    initializeAdmin();
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let resource_type = 'auto';
    if (file.mimetype.includes('video')) resource_type = 'video';
    return {
      folder: 'al-bayan-assets',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'mp4', 'mkv'],
      resource_type: resource_type
    };
  }
});
const upload = multer({ storage });

app.use('/api', apiRoutes);

// Example Image Upload Route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: req.file.path, message: 'File uploaded successfully' });
});

// Serve static files from Vite's production build (dist folder)
app.use(express.static(path.resolve(__dirname, '..', 'dist')));

// Simple health‑check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    db_uri_status: process.env.MONGODB_URI ? 'present' : 'missing'
  });
});

// For SPA routing – return index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}

export default app;
