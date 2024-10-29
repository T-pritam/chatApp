import mongoose, { Document, Mongoose, Schema } from 'mongoose';

interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  documentUrl?: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User'},
  groupId: { type: Schema.Types.ObjectId, ref: 'Group'},
  text: { type: String },
  imageUrl: { type: String },
  videoUrl: { type: String },
  audioUrl: { type: String },
  documentUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
