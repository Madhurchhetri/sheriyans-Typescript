import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
    id: number;
    role: 'user' | 'ai';
    content?: string;
    
    // For normal AI responses (Graph)
    problem?: string;
    solution_1?: string;
    solution_2?: string;
    judge?: {
        solution_1_score: number;
        solution_2_score: number;
        solution_1_reason: string;
        solution_2_reason: string;
    };
    
    // For vision/image upload responses
    isVision?: boolean;
}

export interface IChat extends Document {
    title: string;
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
    id: { type: Number, required: true },
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String },
    
    problem: { type: String },
    solution_1: { type: String },
    solution_2: { type: String },
    judge: {
        solution_1_score: { type: Number },
        solution_2_score: { type: Number },
        solution_1_reason: { type: String },
        solution_2_reason: { type: String },
    },
    
    isVision: { type: Boolean, default: false }
});

const chatSchema = new Schema<IChat>({
    title: { type: String, required: true },
    messages: [messageSchema]
}, { timestamps: true });

export const ChatModel = mongoose.model<IChat>('Chat', chatSchema);
