import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notification } from '@/models';

export async function GET() {
  try {
    await dbConnect();
    const notes = await Notification.find().sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const note = await Notification.create(body);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}