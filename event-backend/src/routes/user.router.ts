import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  getMe,
  savePhoneNumber,
  upcomingEvents,
  updatePhoneNumber,
} from '../controllers/user.controller';

const router = Router();

router.post('/phone', authMiddleware, savePhoneNumber);

router.post('/update-phone', authMiddleware, updatePhoneNumber);

router.get('/me', authMiddleware, getMe);

router.get('/upcoming-events', authMiddleware, upcomingEvents);

export default router;
