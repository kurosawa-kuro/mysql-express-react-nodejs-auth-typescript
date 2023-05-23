import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { db } from "../database/prisma/prismaClient";

type UserWithoutPassword = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserWithoutPassword | null;
    }
  }
}

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'JWT_SECRET') as JwtPayload & { userId: string };

      const user = await db.user.findUnique({ where: { id: parseInt(decoded.userId) } });

      if (user) {
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      } else {
        req.user = null;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };
