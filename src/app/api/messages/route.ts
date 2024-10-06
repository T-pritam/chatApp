import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/model/Message';

export async function GET(req: NextRequest) {
  await dbConnect();
  const messages = await Message.find({}).sort({ createdAt: 1 });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const { senderId, text } = await req.json();
  await dbConnect();

  const message = new Message({ senderId, text });
  await message.save();

  return NextResponse.json({ status: 'Message saved' });
}
