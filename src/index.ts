// // src/index.ts
// import 'dotenv/config';
// import express, { Request, Response, NextFunction } from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import { requireAuth } from '@clerk/clerk-sdk-node'; // Latest Clerk SDK
// import { Todo, ITodo } from './models/Todo'; // Named export for Todo model
// import 'express-async-errors'; // Async error handling for Express

// // Initialize express app
// const app = express();
// app.use(cors());
// app.use(express.json()); // Body parser for JSON

// // MongoDB Connection (with best practices)
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI as string);
//     console.log('MongoDB connected successfully.');
//   } catch (err) {
//     console.error('MongoDB connection error:', err);
//     process.exit(1); // Exit the app if MongoDB connection fails
//   }
// };

// // Extend the Request interface to include Clerk's `auth` object
// interface AuthenticatedRequest extends Request {
//   auth?: {
//     userId: string;
//   };
// }

// // Middleware for authentication using Clerk
// const authenticateUser = requireAuth(); // No custom middleware, Clerk does this directly

// // Fetch all Todos for the authenticated user
// app.get(
//   '/todos',
//   authenticateUser,
//   async (req: AuthenticatedRequest, res: Response) => {
//     const userId = req.auth?.userId;
//     if (!userId) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
//     return res.json(todos);
//   },
// );

// // Create a new Todo
// app.post(
//   '/todos',
//   authenticateUser,
//   async (req: AuthenticatedRequest, res: Response) => {
//     const userId = req.auth?.userId;
//     if (!userId) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const { text, hashtags } = req.body;

//     // Create a new Todo document
//     const newTodo = new Todo({
//       userId,
//       text,
//       completed: false,
//       hashtags,
//     });

//     await newTodo.save(); // Save to database
//     return res.status(201).json(newTodo); // Respond with the created todo
//   },
// );

// // Update a Todo (mark it completed or update text/hashtags)
// app.put(
//   '/todos/:id',
//   authenticateUser,
//   async (req: AuthenticatedRequest, res: Response) => {
//     const userId = req.auth?.userId;
//     const { id } = req.params;

//     if (!userId) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     // Find the todo and update
//     const updatedTodo = await Todo.findOneAndUpdate(
//       { _id: id, userId },
//       req.body,
//       { new: true, runValidators: true },
//     );

//     if (!updatedTodo) {
//       return res
//         .status(404)
//         .json({ error: 'Todo not found or not authorized' });
//     }

//     return res.json(updatedTodo); // Respond with the updated todo
//   },
// );

// // Delete a Todo
// app.delete(
//   '/todos/:id',
//   authenticateUser,
//   async (req: AuthenticatedRequest, res: Response) => {
//     const userId = req.auth?.userId;
//     const { id } = req.params;

//     if (!userId) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId });

//     if (!deletedTodo) {
//       return res
//         .status(404)
//         .json({ error: 'Todo not found or not authorized' });
//     }

//     return res.json({ message: 'Todo deleted successfully' });
//   },
// );

// // Global error handler for async errors
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err.stack);
//   return res.status(500).json({ error: 'Something went wrong!' });
// });

// // Start the server and connect to the database
// const startServer = async () => {
//   await connectDB(); // Connect to MongoDB

//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// };

// startServer(); // Start the app
