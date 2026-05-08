import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { GalleryItem } from '@/models';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET() {
  try {
    await dbConnect();
    const items = await GalleryItem.find().sort({ uploadedAt: -1 });
    return NextResponse.json(items);
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
    const item = await GalleryItem.create({ title, url, type: file?.type?.includes('video') ? 'video' : 'image' });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}