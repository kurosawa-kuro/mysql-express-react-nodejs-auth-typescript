import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { db } from "../database/prisma/prismaClient.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'JWT_SECRET');

      const user = await db.user.findUnique({ where: { id: decoded.userId } });

      const { password, ...userWithoutPassword } = user;
      req.user = user ? userWithoutPassword : null;

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

