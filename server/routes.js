import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Setting, Student, Result, GalleryItem } from './models.js';

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
  if (username) username = username.trim();
  
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user._id, role: user.role, studentRef: user.studentRef }, JWT_SECRET);
  res.json({ token, role: user.role, username: user.username, studentRef: user.studentRef });
});

// Update Student Profile (Student)
router.post('/my-profile', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Students only' });
  try {
    const student = await Student.findByIdAndUpdate(req.user.studentRef, req.body, { new: true });
    res.json({ message: 'Profile updated successfully', student });
  } catch(err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Admission Settings
router.get('/settings/admission', async (req, res) => {
  let setting = await Setting.findOne({ key: 'admissionActive' });
  if (!setting) {
    setting = await Setting.create({ key: 'admissionActive', value: { active: true, message: '' } });
  }
  res.json(setting.value);
});

router.post('/settings/admission', auth, isAdmin, async (req, res) => {
  const { active, message } = req.body;
  await Setting.findOneAndUpdate({ key: 'admissionActive' }, { value: { active, message } }, { upsert: true });
  res.json({ message: 'Settings updated successfully', active });
});

// Public Admission Submission
router.post('/admissions', async (req, res) => {
  const setting = await Setting.findOne({ key: 'admissionActive' });
  if (setting && setting.value?.active === false) {
    return res.status(400).json({ error: `Admissions are closed. ${setting.value.message || ''}` });
  }
  
  const existingUser = await User.findOne({ username: req.body.phone });
  if (existingUser) {
    return res.status(400).json({ error: 'This phone number is already registered.' });
  }
  
  try {
    const student = new Student(req.body);
    await student.save();

    // Default student login: Username=Phone, Password=DOB (e.g., YYYY-MM-DD or whatever they entered)
    const hashedPassword = await bcrypt.hash(student.dob, 10);
    const user = new User({
      username: student.phone,
      password: hashedPassword,
      role: 'student',
      studentRef: student._id
    });
    await user.save();

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

// Delete Student (Admin)
router.delete('/students/:id', auth, isAdmin, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  await User.findOneAndDelete({ studentRef: req.params.id });
  // Also delete their results?
  await Result.deleteMany({ student: req.params.id });
  res.json({ message: 'Student and related data deleted completely' });
});

// Publish Result (Admin)
router.post('/results', auth, isAdmin, async (req, res) => {
  const result = new Result(req.body);
  await result.save();
  res.json({ message: 'Result published successfully', result });
});

// Get All Results (Admin)
router.get('/results', auth, isAdmin, async (req, res) => {
  const results = await Result.find().populate('student', 'studentName phone profilePhoto aadharFile sslcFile').sort({ publishedDate: -1 });
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
router.post('/gallery', auth, isAdmin, async (req, res) => {
  const item = new GalleryItem(req.body);
  await item.save();
  res.json(item);
});

// Delete Gallery item (Admin)
router.delete('/gallery/:id', auth, isAdmin, async (req, res) => {
  await GalleryItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Gallery item deleted' });
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

export default router;
