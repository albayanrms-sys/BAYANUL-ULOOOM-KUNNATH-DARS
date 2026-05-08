const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src', 'app', 'api');

const filesToCreate = {
  'login/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await dbConnect();
    const { username, password } = await req.json();
    const user = await User.findOne({ username });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    
    const token = jwt.sign({ id: user._id, role: user.role, studentRef: user.studentRef }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return NextResponse.json({ token, role: user.role });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'students/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Student } from '@/models';

export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find().sort({ createdAt: -1 });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'students/[id]/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Student } from '@/models';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Student.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'students/[id]/approve/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Student } from '@/models';

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Student.findByIdAndUpdate(id, { status: 'approved', isStudent: true });
    return NextResponse.json({ message: 'Approved' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'students/[id]/note/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Student } from '@/models';

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { adminNote } = await req.json();
    await Student.findByIdAndUpdate(id, { adminNote });
    return NextResponse.json({ message: 'Note updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'posters/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Poster } from '@/models';

export async function GET() {
  try {
    await dbConnect();
    const posters = await Poster.find().sort({ createdAt: -1 });
    return NextResponse.json(posters);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    // Simulate upload, you need Cloudinary or similar
    const file = formData.get('file');
    const title = formData.get('title');
    // Using a fake URL for now, you should implement real upload
    const url = "https://via.placeholder.com/400x400?text=Poster"; 
    const poster = await Poster.create({ title, url });
    return NextResponse.json(poster, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'posters/[id]/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Poster } from '@/models';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Poster.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'gallery/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { GalleryItem } from '@/models';

export async function GET() {
  try {
    await dbConnect();
    const items = await GalleryItem.find().sort({ uploadedAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const url = "https://via.placeholder.com/400x400?text=Gallery"; 
    const item = await GalleryItem.create({ title, url, type: file?.type?.includes('video') ? 'video' : 'image' });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'gallery/[id]/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { GalleryItem } from '@/models';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await GalleryItem.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'results/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Result } from '@/models';

export async function GET() {
  try {
    await dbConnect();
    const results = await Result.find().populate('student').sort({ createdAt: -1 });
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const totalMarks = body.subjects.reduce((sum, s) => sum + Number(s.mark || 0), 0);
    const avg = totalMarks / (body.subjects.length || 1);
    const grade = avg >= 90 ? 'A+' : avg >= 80 ? 'A' : avg >= 70 ? 'B+' : avg >= 60 ? 'B' : avg >= 50 ? 'C' : 'F';
    const result = await Result.create({ ...body, totalMarks, grade });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'my-results/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Result, Student, User } from '@/models';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    await dbConnect();
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    const user = await User.findById(decoded.id);
    const student = await Student.findById(user.studentRef);
    const results = await Result.find({ student: user.studentRef }).sort({ createdAt: -1 });
    
    return NextResponse.json({ student, results });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'notifications/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notification } from '@/models';

export async function GET() {
  try {
    await dbConnect();
    const notes = await Notification.find().sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const note = await Notification.create(body);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'notifications/[id]/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notification } from '@/models';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Notification.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'settings/admission/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Setting } from '@/models';

export async function GET() {
  try {
    await dbConnect();
    const setting = await Setting.findOne({ key: 'admissionSettings' });
    return NextResponse.json(setting ? setting.value : { active: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    await Setting.findOneAndUpdate({ key: 'admissionSettings' }, { value: body }, { upsert: true });
    return NextResponse.json({ message: 'Updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'admin/change-password/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await dbConnect();
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { newPassword } = await req.json();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    return NextResponse.json({ message: 'Password updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'check-activation/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Student, User } from '@/models';

export async function POST(req) {
  try {
    await dbConnect();
    const { studentName, phone } = await req.json();
    const student = await Student.findOne({ studentName, phone, isStudent: true });
    if (!student) return NextResponse.json({ error: 'Candidate not found or not approved' }, { status: 404 });
    
    const existingUser = await User.findOne({ studentRef: student._id });
    if (existingUser) return NextResponse.json({ hasCustomCredentials: true });
    
    return NextResponse.json({ id: student._id, hasCustomCredentials: false });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'activate-account/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Student, User } from '@/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await dbConnect();
    const { studentId, username, password, profilePhoto } = await req.json();
    
    const existingUser = await User.findOne({ username });
    if (existingUser) return NextResponse.json({ error: 'Username taken' }, { status: 400 });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({ username, password: hashedPassword, role: 'student', studentRef: studentId });
    if (profilePhoto) {
      await Student.findByIdAndUpdate(studentId, { profilePhoto });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role, studentRef: user.studentRef }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`,

  'upload/route.js': `import { NextResponse } from 'next/server';
export async function POST(req) {
  try {
    // In a real app, upload to S3 or Cloudinary.
    // We mock it for now.
    return NextResponse.json({ url: 'https://via.placeholder.com/150' });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}`,

  'my-profile/route.js': `import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Student } from '@/models';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await dbConnect();
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    const body = await req.json();
    await Student.findByIdAndUpdate(decoded.studentRef, body);
    
    return NextResponse.json({ message: 'Profile updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`
};

for (const [relativePath, content] of Object.entries(filesToCreate)) {
  const fullPath = path.join(basePath, relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}
console.log('All API endpoints created successfully!');
