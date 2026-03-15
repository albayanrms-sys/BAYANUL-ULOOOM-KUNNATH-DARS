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
  fatherName: String,
  motherName: String,
  dob: String,
  place: String,
  address: String,
  phone: { type: String, required: true },
  guardianPhone: String,
  email: String,
  bloodGroup: String,
  previousEdu: String,
  profilePhoto: String,
  aadharFile: String,
  sslcFile: String,
  birthCertFile: String,
  tcFile: String,
  marklistFile: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isStudent: { type: Boolean, default: false }, // If true, moved from candidate to official student
  hasCustomCredentials: { type: Boolean, default: false },
  bio: String,
  adminNote: String, // Instruction for admission registration
  extraCertificates: [String], // Additional documents/certificates
  createdAt: { type: Date, default: Date.now }
});

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  year: String,
  examType: { type: String, enum: ['Final', 'Midterm', 'Quarterly'], default: 'Midterm' },
  subjects: [{
    subject: String,
    mark: Number
  }],
  totalMarks: Number,
  grade: String,
  publishedDate: { type: Date, default: Date.now }
});

const galleryItemSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  title: String,
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
  type: { type: String, enum: ['info', 'warning', 'result', 'urgent'], default: 'info' },
  target: { type: String, default: 'all' }, // 'all', 'students', 'admins'
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Setting = mongoose.model('Setting', settingSchema);
export const Student = mongoose.model('Student', studentSchema);
export const Result = mongoose.model('Result', resultSchema);
export const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
export const Poster = mongoose.model('Poster', posterSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
