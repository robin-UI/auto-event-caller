import { Request, Response, NextFunction } from 'express';

export const register = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const user = { name, email, password };
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error);
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = { email, password };
    res.status(200).json({ message: 'User logged in successfully', user });
  } catch (error) {
    next(error);
  }
};