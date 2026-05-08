import { NextResponse } from 'next/server';
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
}