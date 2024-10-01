// src/app.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import todoRoutes from './routes/todos';
import { clerkAuth } from './middleware/auth';
import morgan from 'morgan';
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://typetodofrontend-5otc.vercel.app',
  // Add more origins as needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('Incoming Origin:', origin); // Log the origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

app.use(morgan('dev'));

// Database connection
connectDB();

// Routes
app.use('/api/todos', clerkAuth, todoRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
