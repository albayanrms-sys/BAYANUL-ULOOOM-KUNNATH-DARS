import { NextResponse } from 'next/server';
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
}