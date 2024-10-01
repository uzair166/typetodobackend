import express, { Router, Request, Response } from 'express';
import Todo, { ITodo } from '../models/Todo';

const router = Router();

// Get all todos for the authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['user-id'] as string;
    const todos = await Todo.find({ userId });
    res.json(todos);
  } catch (err) {
    // Cast 'err' to 'Error' to access the 'message' property
    res.status(500).json({ error: (err as Error).message });
  }
});

// Add a new todo
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { text } = req.body;

    const hashtags = (text.match(/#\w+/g) || []).map((tag: string) =>
      tag.slice(1),
    );

    const newTodo = new Todo({
      userId,
      text: text.trim(),
      completed: false,
      hashtags,
    });

    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    // Cast 'err' to 'Error' to access the 'message' property
    res.status(500).json({ error: (err as Error).message });
  }
});

// Update a todo
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { id } = req.params;
    const updates = req.body;

    const todo = await Todo.findOneAndUpdate({ _id: id, userId }, updates, {
      new: true,
    });
    res.json(todo);
  } catch (err) {
    // Cast 'err' to 'Error' to access the 'message' property
    res.status(500).json({ error: (err as Error).message });
  }
});

// Delete a todo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { id } = req.params;

    await Todo.findOneAndDelete({ _id: id, userId });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    // Cast 'err' to 'Error' to access the 'message' property
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/reorder', (async (req: Request, res: Response) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { newOrder } = req.body;

    // Validate that newOrder contains all the user's todo IDs
    const userTodos = await Todo.find({ userId });
    const userTodoIds = userTodos.map((todo: ITodo) => todo._id.toString());

    if (!newOrder.every((id: string) => userTodoIds.includes(id))) {
      return res.status(400).json({ error: 'Invalid todo IDs in new order' });
    }

    // Update the order of todos
    await Promise.all(
      newOrder.map((id: string, index: number) =>
        Todo.findByIdAndUpdate(id, { $set: { order: index } }),
      ),
    );

    res.json({ message: 'Todos reordered successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}) as express.RequestHandler);

export default router;
