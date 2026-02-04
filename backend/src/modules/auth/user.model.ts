import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    refreshToken?: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema)