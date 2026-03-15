import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Setting, Student, Result, GalleryItem, Poster, Notification } from './models.js';
import { upload } from './upload.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bayanululoomsecret';

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only access' });
  next();
};

// Login Route (Admin & Student)
router.post('/login', async (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  
  const trimmedUser = username.trim();
  
  // Try exact match first (for admin/older accounts)
  let user = await User.findOne({ username: trimmedUser });
  
  // Fallback to case-insensitive if not found
  if (!user) {
    user = await User.findOne({ username: { $regex: new RegExp("^" + trimmedUser + "$", "i") } });
  }

  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user._id, role: user.role, studentRef: user.studentRef }, JWT_SECRET);
  res.json({ token, role: user.role, username: user.username, studentRef: user.studentRef });
});

// Check if student can activate account
router.post('/check-activation', async (req, res) => {
  const { studentName, phone } = req.body;
  const student = await Student.findOne({ studentName, phone });
  if (!student) return res.status(404).json({ error: 'Candidate not found. Please check name and phone spelling exactly as given in admission.' });
  
  res.json({ 
    hasCustomCredentials: student.hasCustomCredentials, 
    id: student._id,
    message: student.hasCustomCredentials ? 'Account already active. Please login.' : 'Candidate found. Please set your credentials.'
  });
});

// Activate Account
router.post('/activate-account', async (req, res) => {
  const { studentId, username, password, profilePhoto } = req.body;
  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already taken' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update or create user
    await User.findOneAndUpdate(
      { studentRef: studentId },
      { username, password: hashedPassword, role: 'student', studentRef: studentId },
      { upsert: true }
    );
    
    student.hasCustomCredentials = true;
    if (profilePhoto) student.profilePhoto = profilePhoto;
    await student.save();
    
    res.json({ message: 'Account activated successfully! You can now login.' });
  } catch (err) {
    res.status(500).json({ error: 'Activation failed' });
  }
});

// Update Student Profile (Student)
router.post('/my-profile', auth, async (req, res) => {
  const { bio, aadharFile, sslcFile, profilePhoto, birthCertFile, tcFile, marklistFile, extraCertificates } = req.body;
  try {
    const student = await Student.findOne({ _id: req.user.studentRef });
    if (!student) return res.status(404).json({ error: 'Student profile not found' });
    
    if (bio !== undefined) student.bio = bio;
    if (aadharFile) student.aadharFile = aadharFile;
    if (sslcFile) student.sslcFile = sslcFile;
    if (profilePhoto) student.profilePhoto = profilePhoto;
    if (birthCertFile) student.birthCertFile = birthCertFile;
    if (tcFile) student.tcFile = tcFile;
    if (marklistFile) student.marklistFile = marklistFile;
    if (extraCertificates) student.extraCertificates = extraCertificates;
    
    await student.save();
    res.json({ message: 'Profile updated successfully', student });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Admission Settings
router.get('/settings/admission', async (req, res) => {
  let setting = await Setting.findOne({ key: 'admissionActive' });
  if (!setting) {
    const threeDaysTwoHours = new Date(Date.now() + (3 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000));
    setting = new Setting({
      key: 'admissionActive',
      value: { active: true, message: "Welcome to Al Bayan Kunnath Admission 2026", deadline: threeDaysTwoHours.toISOString() }
    });
    await setting.save();
  }
  res.json(setting.value);
});

router.post('/settings/admission', auth, isAdmin, async (req, res) => {
  const { active, message, deadline } = req.body;
  await Setting.findOneAndUpdate({ key: 'admissionActive' }, { value: { active, message, deadline } }, { upsert: true });
  res.json({ message: 'Settings updated successfully', active });
});

// Public Admission Submission
router.post('/admissions', async (req, res) => {
  const setting = await Setting.findOne({ key: 'admissionActive' });
  const isPastDeadline = setting?.value?.deadline && new Date(setting.value.deadline) < new Date();
  
  if (setting && (setting.value?.active === false || isPastDeadline)) {
    return res.status(400).json({ error: `Admissions are closed. ${isPastDeadline ? 'The deadline has passed.' : (setting.value.message || '')}` });
  }
  
  try {
    const student = new Student(req.body);
    await student.save();
    res.json({ message: 'Admission submitted successfully!', student });
  } catch (err) {
    res.status(500).json({ error: 'Error submitting admission', details: err.message });
  }
});

// Get All Students (Admin)
router.get('/students', auth, isAdmin, async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.json(students);
});

// Move Candidate to Official Student
router.patch('/students/:id/approve', auth, isAdmin, async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, { status: 'approved', isStudent: true }, { new: true });
  res.json({ message: 'Candidate moved to Students list', student });
});

// Update Student Note (Admin)
router.patch('/students/:id/note', auth, isAdmin, async (req, res) => {
  const { adminNote } = req.body;
  const student = await Student.findByIdAndUpdate(req.params.id, { adminNote }, { new: true });
  res.json({ message: 'Note updated', student });
});

// Delete Student (Admin)
router.delete('/students/:id', auth, isAdmin, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  await User.findOneAndDelete({ studentRef: req.params.id });
  await Result.deleteMany({ student: req.params.id });
  res.json({ message: 'Student and related data deleted completely' });
});

// Publish Result (Admin)
router.post('/results', auth, isAdmin, async (req, res) => {
  try {
    const { student, year, examType, subjects } = req.body;
    const totalMarks = subjects.reduce((sum, s) => sum + (Number(s.mark) || 0), 0);
    
    // Automatically determine grade
    let grade = 'F';
    const percentage = (totalMarks / (subjects.length * 100)) * 100;
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C+';
    else if (percentage >= 40) grade = 'C';

    const result = new Result({ student, year, examType, subjects, totalMarks, grade });
    await result.save();
    res.json({ message: 'Result published successfully', result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to publish result' });
  }
});

// Get All Results (Admin)
router.get('/results', auth, isAdmin, async (req, res) => {
  const results = await Result.find().populate('student', 'studentName phone profilePhoto').sort({ publishedDate: -1 });
  res.json(results);
});

// Get My Results (Student)
router.get('/my-results', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Students only' });
  const results = await Result.find({ student: req.user.studentRef }).sort({ publishedDate: -1 });
  const student = await Student.findById(req.user.studentRef);
  res.json({ results, student });
});

// GET Gallery items
router.get('/gallery', async (req, res) => {
  const items = await GalleryItem.find().sort({ uploadedAt: -1 });
  res.json(items);
});

// Add Gallery items (Admin)
router.post('/gallery', auth, isAdmin, upload.single('file'), async (req, res) => {
  const { title, type } = req.body;
  const url = req.file ? req.file.path : req.body.url;
  if (!url) return res.status(400).json({ error: 'No image provided' });
  
  const item = new GalleryItem({ title, type, url });
  await item.save();
  res.json(item);
});

// Delete Gallery item (Admin)
router.delete('/gallery/:id', auth, isAdmin, async (req, res) => {
  await GalleryItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Gallery item deleted' });
});

// POSTERS
router.get('/posters', async (req, res) => {
  const posters = await Poster.find().sort({ createdAt: -1 });
  res.json(posters);
});

router.post('/posters', auth, isAdmin, upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const url = req.file ? req.file.path : null;
  if (!url) return res.status(400).json({ error: 'No poster image provided' });

  const poster = new Poster({ title, url });
  await poster.save();
  res.json(poster);
});

router.delete('/posters/:id', auth, isAdmin, async (req, res) => {
  await Poster.findByIdAndDelete(req.params.id);
  res.json({ message: 'Poster deleted' });
});

// Change Password (Admin)
router.post('/admin/change-password', auth, isAdmin, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Notifications
router.get('/notifications', async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json(notifications);
});

router.post('/notifications', auth, isAdmin, async (req, res) => {
  const notification = new Notification(req.body);
  await notification.save();
  res.json({ message: 'Notification created', notification });
});

router.delete('/notifications/:id', auth, isAdmin, async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notification deleted' });
});

export default router;
