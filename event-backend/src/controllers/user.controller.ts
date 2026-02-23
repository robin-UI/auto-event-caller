import { Request, Response } from 'express';
import User from '../models/User.models';
import { getUpcomingEvents } from '../services/googleCalendar.service';

export const savePhoneNumber = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number required' });
  }

  if (!req?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await User.findOneAndUpdate(
    { _id: req?.user?.userId },
    { phoneNumber },
    { new: true },
  );

  res.json({ message: 'Phone number saved successfully' });
};

//Update phone number
export const updatePhoneNumber = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number required' });
  }

  if (!req?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await User.findOneAndUpdate(
    { _id: req?.user?.userId },
    { phoneNumber },
    { new: true },
  );

  res.json({ message: 'Phone number updated successfully' });
};

export const getMe = async (req: Request, res: Response) => {
  if (!req?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findOne({ _id: req.user.userId });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};

// Get all users upcomming events
export const upcomingEvents = async (req: Request, res: Response) => {
  if (!req?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findOne({ _id: req.user.userId });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const events = await getUpcomingEvents(user.refreshToken);
  res.json(events);
};
