import express from 'express';
import { oauth2Client } from '../config/google';
import { google } from 'googleapis';
import { prisma } from '../lib/prisma';
import { getUpcomingEvents } from '../services/googleCalendarService';
import jwt from 'jsonwebtoken';
const router = express.Router();

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/calendar.readonly',
];

// 1️⃣ Redirect to Google
router.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // IMPORTANT
    prompt: 'consent', // IMPORTANT (to get refresh token)
    scope: SCOPES,
  });

  res.redirect(url);
});

// 2️⃣ Handle callback
router.get('/google/callback', async (req, res) => {
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

    if (!email) {
      return res.status(400).json({ message: 'No email returned from Google' });
    }

    // 🔥 TODO: Save user + refresh_token in DB
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        refreshToken: tokens.refresh_token!,
      },
      create: {
        email,
        name,
        refreshToken: tokens.refresh_token!,
      },
    });
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
    console.log(user);
    res.redirect('http://localhost:3001');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// 3️⃣ Test calendar events
router.get('/calendar/test', async (req, res) => {
  const user = await prisma.user.findFirst();

  if (!user?.refreshToken) {
    return res.status(400).json({ message: 'No refresh token found' });
  }

  const events = await getUpcomingEvents(user.refreshToken);
  res.json(events);
});

export default router;
