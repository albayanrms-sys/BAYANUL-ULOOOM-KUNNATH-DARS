import { NextResponse } from 'next/server';
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
}