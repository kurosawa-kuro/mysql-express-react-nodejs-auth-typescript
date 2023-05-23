import express, { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/userController';

export const userRoutes: Router = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.post('/logout', logoutUser);

userRoutes
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

