import { NextResponse } from 'next/server';
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
}