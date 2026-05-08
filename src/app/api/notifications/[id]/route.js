import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notification } from '@/models';

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Notification.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}