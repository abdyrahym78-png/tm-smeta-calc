import { Request, Response, NextFunction } from 'express';

export type UserRole = 'ADMIN' | 'ENGINEER' | 'CLIENT';

export interface UserPayload {
  userId: string;
  role: UserRole;
}

export function generateToken(payload: UserPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export function authMiddleware(requiredRoles: UserRole[] = []) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden: Insufficient rights' });
    }

    req.user = user;
    next();
  };
}
