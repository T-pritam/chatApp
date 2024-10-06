import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[]; // Array of User IDs
  messages: mongoose.Types.ObjectId[]; // Array of Message IDs
}

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
}, { timestamps: true });

export default mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
