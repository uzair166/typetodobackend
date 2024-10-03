import express, { Router, Request, Response } from 'express';
import {
  CreateToDoPayload,
  EditToDoPayload,
  ReorderToDoPayload,
  UserTodoList,
} from '../models/userTodoList'; // Import the model
import mongoose from 'mongoose';

const router = Router();

// Helper function to get userId (can be expanded based on your auth system)
const getUserId = (req: any): string => {
  // Assume we get userId from some form of authentication (e.g., JWT, session)
  return req.headers['user-id']; // Modify as per your auth system
};

// Route to get all to-dos for the authenticated user
router.get('/', (async (req: Request, res: Response) => {
  const userId = getUserId(req);

  try {
    // Find the user's to-do list
    const userTodoList = await UserTodoList.findOne({ userId });

    // If the user's to-do list doesn't exist, return an empty list
    if (!userTodoList) {
      return res.json({ success: true, todos: [] });
    }

    // Return the to-do list
    res.json({ success: true, todos: userTodoList.todos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch to-dos' });
  }
}) as express.RequestHandler);

// Route to create a new to-do item
router.post('/', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { text, tags = [] }: CreateToDoPayload = req.body;

  try {
    // Find the user's to-do list
    let userTodoList = await UserTodoList.findOne({ userId });

    // If no list exists, create one
    if (!userTodoList) {
      userTodoList = new UserTodoList({ userId, todos: [] });
    }

    // Add new to-do item to the list
    const newToDo = {
      todoId: new mongoose.Types.ObjectId().toString(), // Generate a new ObjectId for todoId
      text,
      tags,
      completed: false,
      order: userTodoList.todos.length, // Set the order to be last
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userTodoList.todos.push(newToDo);
    await userTodoList.save();

    res.status(201).json({ success: true, todo: newToDo });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: 'Failed to create to-do' });
  }
});

// Route to edit/complete a to-do item
router.put('/:todoId', (async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { todoId } = req.params;
  const { text, completed, tags }: EditToDoPayload = req.body;

  try {
    const userTodoList = await UserTodoList.findOne({ userId });
    if (!userTodoList) return res.status(404).json({ error: 'User not found' });

    const todo = userTodoList.todos.find(
      (todo) => todo.todoId.toString() === todoId,
    );
    if (!todo) return res.status(404).json({ error: 'To-do not found' });

    if (text) todo.text = text;
    if (completed !== undefined) todo.completed = completed;
    if (tags) todo.tags = tags;

    todo.updatedAt = new Date();
    await userTodoList.save();

    res.json({ success: true, todo });
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit to-do' });
  }
}) as express.RequestHandler);

// Route to reorder to-do items
router.put('/reorder/:todoId', (async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { todoId } = req.params;
  const { newPosition }: ReorderToDoPayload = req.body;

  try {
    const userTodoList = await UserTodoList.findOne({ userId });
    if (!userTodoList) return res.status(404).json({ error: 'User not found' });

    const todoIndex = userTodoList.todos.findIndex(
      (todo) => todo.todoId.toString() === todoId,
    );
    if (todoIndex === -1)
      return res.status(404).json({ error: 'To-do not found' });

    // Remove the to-do from the current position
    const [todo] = userTodoList.todos.splice(todoIndex, 1);

    // Insert it into the new position
    userTodoList.todos.splice(newPosition, 0, todo);

    await userTodoList.save();

    res.json({ success: true, todos: userTodoList.todos });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder to-dos' });
  }
}) as express.RequestHandler);

router.delete('/:todoId', (async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { todoId } = req.params;

  try {
    const userTodoList = await UserTodoList.findOne({ userId });
    if (!userTodoList) return res.status(404).json({ error: 'User not found' });

    const todoIndex = userTodoList.todos.findIndex(
      (todo) => todo.todoId.toString() === todoId,
    );
    if (todoIndex === -1)
      return res.status(404).json({ error: 'To-do not found' });

    // Remove the to-do item
    userTodoList.todos.splice(todoIndex, 1);

    // Recalculate the order of remaining todos
    userTodoList.todos.forEach((todo, index) => {
      todo.order = index;
    });

    await userTodoList.save();

    res.json({
      success: true,
      message: 'To-do deleted successfully',
      todos: userTodoList.todos,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete to-do' });
  }
}) as express.RequestHandler);

export default router;
