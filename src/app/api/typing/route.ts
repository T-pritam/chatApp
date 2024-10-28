import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    const { senderId,receiverId,isTyping } = await req.json();
    await pusherServer.trigger(`user-${receiverId}`, "typing-event", {
        senderId,
        receiverId,
        isTyping: isTyping,
    });
    return new Response("OK");
}