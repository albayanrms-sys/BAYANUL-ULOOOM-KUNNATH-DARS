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
import { User } from './models.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    initializeAdmin();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Admin setup
const initializeAdmin = async () => {
  const adminExists = await User.findOne({ username: 'ramees baqavi' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('ramees786', 10);
    await User.create({ username: 'ramees baqavi', password: hashedPassword, role: 'admin' });
    console.log('🔑 Default admin created');
  }
};

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'al-bayan-assets',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    resource_type: 'auto'
  }
});
export const upload = multer({ storage });

// API Routes
app.use('/api', apiRoutes);

// Dedicated Upload Route (to ensure it works correctly)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: req.file.path, message: 'File uploaded successfully' });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState }));

// Static Files & SPA
const distPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
