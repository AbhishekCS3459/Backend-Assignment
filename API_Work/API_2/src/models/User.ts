import mongoose, { Schema, Document } from "mongoose";
// Define interface for User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

// Define schema for User
const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create and export User model
export const User = mongoose.model<IUser>("User", UserSchema);
