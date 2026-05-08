import { NextResponse } from 'next/server';
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
}