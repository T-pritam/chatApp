import { NextRequest, NextResponse } from 'next/server';
import pusher from '@/lib/pusher';

export async function POST(req: NextRequest) {
  const { senderId, text } = await req.json();

  await pusher.trigger('chat-room', 'new-message', { senderId, text });
  return NextResponse.json({ status: 'Message sent' });
}
