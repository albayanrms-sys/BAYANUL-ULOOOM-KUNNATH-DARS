import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Setting } from '@/models';

export async function GET() {
  try {
    await dbConnect();
    const setting = await Setting.findOne({ key: 'admissionSettings' });
    return NextResponse.json(setting ? setting.value : { active: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    await Setting.findOneAndUpdate({ key: 'admissionSettings' }, { value: body }, { upsert: true });
    return NextResponse.json({ message: 'Updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}