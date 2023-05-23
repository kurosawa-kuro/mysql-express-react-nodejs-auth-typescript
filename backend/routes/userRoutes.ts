import express, { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser
} from '../controllers/userController';
// import {
//   loginUser,
//   registerUser,
//   logoutUser,
//   getUserProfile,
//   updateUserProfile,
// } from '../controllers/userController';
// import { protect } from '../middleware/authMiddleware.js';

export const router: Router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// router
//   .route('/profile')
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);
