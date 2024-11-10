import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  profileImgUrl: string;
  description: string;
  members: mongoose.Types.ObjectId[]; // Array of User IDs
  admins: mongoose.Types.ObjectId[]; // Array of User IDs
  createdBy: mongoose.Types.ObjectId;
}

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  description: { type: String },
  profileImgUrl: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });


export default mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
