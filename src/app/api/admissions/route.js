import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Student } from '@/models/index.js';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newStudent = await Student.create({ ...body, status: 'pending' });
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Admission error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET() {
  try { await dbConnect(); const students = await Student.find({}).sort({ createdAt: -1 }); return NextResponse.json(students); }
  catch (error) { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
