import mongoose, { Schema, Document } from 'mongoose';

export interface UserType extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  profileImgUrl: string;
  verifyCodeExpiry: Date; 
  isVerified: boolean;
  unReadMessages: [{id : string,count: number}];
  passwordResetToken: string;
  passwordResetExpires: Date;
  about: string;
  friends: mongoose.Types.ObjectId[]; 
  groups: mongoose.Types.ObjectId[];  
  friendRequest: mongoose.Types.ObjectId[];
  friendRequestReceived: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<UserType> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: false,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  profileImgUrl: {
    type: String,
  },
  unReadMessages: [{ id: String, count: Number }],
  verifyCode: {
    type: String,
    required: [true, 'Verify Code is required'],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify Code Expiry is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  about: {
    type: String,
  },
  passwordResetToken: {
    type: String,
    required: [true, 'Verify Code is required'],
  },
  passwordResetExpires: {
    type: Date,
    required: [true, 'Verify Code Expiry is required'],
  },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  friendRequest: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequestReceived: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<UserType>) ||
  mongoose.model<UserType>('User', UserSchema);

export default UserModel;