import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Poster } from '@/models';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Poster.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}