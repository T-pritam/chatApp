import mongoose, { Document, Schema } from 'mongoose';

interface IChat extends Document {
  participants: string[];
}

const ChatSchema = new Schema<IChat>({
  participants: [{ type: String, required: true }],
});

const Chat = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
export default Chat;
