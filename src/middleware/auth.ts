import { requireAuth } from '@clerk/express';
import { NextFunction, Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    sessionId: string;
  };
}

export const clerkAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  requireAuth()(req, res, (error: any) => {
    if (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.auth && req.auth.userId) {
      req.headers['user-id'] = req.auth.userId;
    }

    next();
  });
};
