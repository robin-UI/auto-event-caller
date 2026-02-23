import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  email: string;
  refreshToken: string;
  phoneNumber: string;
  name: string;
  picture: string;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, required: false },
    refreshToken: { type: String, required: true },
    phoneNumber: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.model<User>('User', userSchema);
