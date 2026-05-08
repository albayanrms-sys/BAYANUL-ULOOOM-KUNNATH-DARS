import { NextResponse } from 'next/server';
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
}