// src/models/userTodoList.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define a ToDo type
export type ToDo = {
  todoId: string;
  text: string;
  completed: boolean;
  tags: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

// Define a UserTodoList type
export type UserTodoList = {
  userId: string;
  todos: ToDo[];
};

// Payload type for creating a to-do
export type CreateToDoPayload = {
  text: string;
  tags?: string[];
};

// Payload type for editing a to-do
export type EditToDoPayload = {
  todoId: string;
  text?: string;
  completed?: boolean;
  tags?: string[];
};

// Payload type for reordering to-dos
export type ReorderToDoPayload = {
  newPosition: number;
};

// ToDo schema
export const ToDoSchema = new Schema({
  todoId: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  order: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// UserTodoList schema
export const UserTodoListSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  todos: [ToDoSchema],
});

// Models
export const UserTodoList = mongoose.model<UserTodoList & Document>(
  'UserTodoList',
  UserTodoListSchema,
);
