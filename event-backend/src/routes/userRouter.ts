import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/phone', authMiddleware, async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number required' });
  }

  if (!req?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await prisma.user.update({
    where: { id: req?.user?.userId },
    data: { phoneNumber },
  });

  res.json({ message: 'Phone number saved successfully' });
});

router.get('/me', authMiddleware, async (req, res) => {
  console.log(req.user);
  if (!req?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

export default router;
