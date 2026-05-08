import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Poster } from '@/models';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET() {
  try {
    await dbConnect();
    const posters = await Poster.find().sort({ createdAt: -1 });
    return NextResponse.json(posters);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const url = await uploadToCloudinary(file);
    const poster = await Poster.create({ title, url });
    return NextResponse.json(poster, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}