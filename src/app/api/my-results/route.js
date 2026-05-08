import { NextResponse } from 'next/server';
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
}