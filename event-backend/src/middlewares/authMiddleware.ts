import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Accept token from cookie (set after Google OAuth) OR Authorization header
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.user = decodedToken;
    console.log(req.user, 'Middleware Pass');
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
