import express from 'express';
import {
  googleAuth,
  googleCallback,
  logout,
  testCalender,
} from '../controllers/auth.controller';
const router = express.Router();

// 1️⃣ Redirect to Google
router.get('/google', googleAuth);

// 2️⃣ Handle callback
router.get('/google/callback', googleCallback);

// 3️⃣ Test calendar events
router.get('/calendar/test', testCalender);

// 4️⃣ Logout
router.get('/logout', logout);

export default router;
