import { Schema, model, Document, Types } from "mongoose";

export interface IMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface IChat extends Document {
    userId: Types.ObjectId;
    title: string;
    messages: IMessage[];
}

const chatSchema = new Schema<IChat>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        title: { type: String, default: "New Chat" },
        messages: [
            {
                role: { type: String, enum: ["user", "assistant"], required: true },
                content: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

export const Chat = model<IChat>("Chat", chatSchema);
