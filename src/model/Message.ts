import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
  senderId: string;
  text: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
