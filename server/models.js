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
  dob: String,
  address: String,
  phone: String,
  previousEdu: String,
  createdAt: { type: Date, default: Date.now }
});

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  examName: { type: String, required: true },
  subjects: [{ name: String, marks: Number, maxMarks: Number }],
  totalMarks: Number,
  percentage: Number,
  grade: String,
  publishedDate: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Setting = mongoose.model('Setting', settingSchema);
export const Student = mongoose.model('Student', studentSchema);
export const Result = mongoose.model('Result', resultSchema);
