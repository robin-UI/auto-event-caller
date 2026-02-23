import { Request, Response, NextFunction } from 'express';
import { oauth2Client } from '../config/google';
import { google } from 'googleapis';
import { prisma } from '../lib/prisma';
import User from '../models/User.models';
import { getUpcomingEvents } from '../services/googleCalendar.service';
import jwt from 'jsonwebtoken';

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar.readonly',
];

//re-direct to google auth
export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // IMPORTANT
    prompt: 'consent', // IMPORTANT (to get refresh token)
    scope: SCOPES,
  });

  res.redirect(url);
};

//Handle Call-back
export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).json({ message: 'No code provided' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const userInfo = await oauth2.userinfo.get();

    const email = userInfo.data.email;
    const name = userInfo.data.name;
    const picture = userInfo.data.picture;

    if (!email) {
      return res.status(400).json({ message: 'No email returned from Google' });
    }

    // 🔥 TODO: Save user + refresh_token in DB
    // const user = await prisma.user.upsert({
    //   where: { email },
    //   update: {
    //     refreshToken: tokens.refresh_token!,
    //   },
    //   create: {
    //     email,
    //     name,
    //     refreshToken: tokens.refresh_token!,
    //   },
    // });
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: { refreshToken: tokens.refresh_token! },
        $setOnInsert: {
          email,
          name,
          picture,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true, // enforce schema validation
      },
    );
    // res.json({
    //   message: 'Login successful',
    //   email,
    //   tokens,
    // });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true in production (https)
      sameSite: 'lax',
    });
    res.redirect(process.env.FRONTEND_URL!);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

// Test calendar events
export const testCalender = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await prisma.user.findFirst();

  if (!user?.refreshToken) {
    return res.status(400).json({ message: 'No refresh token found' });
  }

  const events = await getUpcomingEvents(user.refreshToken);
  res.json(events);
};

// Logout
export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // must match how you set the cookie
    path: '/',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
