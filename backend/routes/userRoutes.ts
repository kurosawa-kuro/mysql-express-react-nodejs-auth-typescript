import express, { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  registerUserAction,
  loginUserAction,
  logoutUserAction,
  getUserProfileAction,
  updateUserProfileAction
} from '../controllers/userController';

export const userRoutes: Router = express.Router();

userRoutes.post('/register', registerUserAction);
userRoutes.post('/login', loginUserAction);
userRoutes.post('/logout', logoutUserAction);

userRoutes
  .route('/profile')
  .get(protect, getUserProfileAction)
  .put(protect, updateUserProfileAction);

