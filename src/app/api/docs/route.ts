import { NextResponse } from 'next/server';
import Doc from '@/app/models/Doc';
import connectDB from '@/app/lib/mongoose';

export async function GET() {
  await connectDB();
  const doc = await Doc.findOne(); // get the first doc
  return NextResponse.json({ content: doc?.content || '' });
}

export async function POST(request: Request) {
  await connectDB();
  const { content } = await request.json();

  let doc = await Doc.findOne();
  if (!doc) {
    doc = new Doc({ content });
  } else {
    doc.content = content;
  }
  await doc.save();

  return NextResponse.json({ success: true });
}
