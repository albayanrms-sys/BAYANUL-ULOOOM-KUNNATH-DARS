import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({ 
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }, 
  role: { type: String, enum: ['admin', 'student'], default: 'student' }, 
  studentRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' } 
});

const settingSchema = new mongoose.Schema({ 
  key: { type: String, required: true, unique: true }, 
  value: { type: mongoose.Schema.Types.Mixed, required: true } 
});

const studentSchema = new mongoose.Schema({ 
  studentName: { type: String, required: true }, 
  phone: { type: String, required: true }, 
  fatherName: String,
  motherName: String,
  dob: String,
  address: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, 
  isStudent: { type: Boolean, default: false },
  adminNote: String,
  bio: String,
  profilePhoto: String,
  aadharFile: String,
  sslcFile: String,
  birthCertFile: String,
  tcFile: String,
  marklistFile: String,
  extraCertificates: [String],
  createdAt: { type: Date, default: Date.now } 
});

const galleryItemSchema = new mongoose.Schema({ 
  url: { type: String, required: true }, 
  title: String, 
  type: { type: String, default: 'image' },
  uploadedAt: { type: Date, default: Date.now } 
});

const posterSchema = new mongoose.Schema({ 
  url: { type: String, required: true }, 
  title: String, 
  createdAt: { type: Date, default: Date.now } 
});

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'urgent'], default: 'info' },
  createdAt: { type: Date, default: Date.now }
});

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  year: String,
  examType: String,
  subjects: [{ subject: String, mark: Number }],
  totalMarks: Number,
  grade: String,
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
export const GalleryItem = mongoose.models.GalleryItem || mongoose.model('GalleryItem', galleryItemSchema);
export const Poster = mongoose.models.Poster || mongoose.model('Poster', posterSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export const Result = mongoose.models.Result || mongoose.model('Result', resultSchema);
