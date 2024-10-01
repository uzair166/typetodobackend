// src/models/Todo.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
  _id: string | number;
  userId: string; // Clerk user ID
  text: string;
  completed: boolean;
  hashtags: string[];
  completedAt?: Date;
}

const TodoSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    hashtags: { type: [String], default: [] },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<ITodo>('Todo', TodoSchema, 'todos');
