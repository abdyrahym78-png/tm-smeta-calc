import { Router, Request, Response } from 'express';
import { generateToken, UserRole } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response) => {
  const { username, role = 'ENGINEER' } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, error: 'Username is required' });
  }

  const token = generateToken({ userId: `usr_${Date.now()}`, role: role as UserRole });
  res.json({ success: true, token, role });
});
