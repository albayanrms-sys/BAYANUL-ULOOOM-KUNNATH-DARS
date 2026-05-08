import { NextResponse } from 'next/server';
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
}