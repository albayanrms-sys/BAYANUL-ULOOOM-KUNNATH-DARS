import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { GalleryItem } from '@/models/index.js';

export async function GET() {
  await dbConnect();
  const items = await GalleryItem.find({}).sort({ uploadedAt: -1 });
  return NextResponse.json(items);
}
