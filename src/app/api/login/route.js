import { NextResponse } from 'next/server';
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
}