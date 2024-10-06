import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendRequest extends Document {
  sender: mongoose.Types.ObjectId;   // User ID of the sender
  receiver: mongoose.Types.ObjectId; // User ID of the receiver
  status: 'pending' | 'accepted' | 'declined';
}

const FriendRequestSchema = new Schema<IFriendRequest>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.FriendRequest || mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);