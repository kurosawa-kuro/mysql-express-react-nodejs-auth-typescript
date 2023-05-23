import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken';
import {
  registerUser,
  getUserByEmail,
  loginUser,
  getUserById,
  updateUserProfile
} from '../models/userModel';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
export const loginUserAction = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUser({ email, password });

  if (user) {
    generateToken(res, user.id);

    const { id, name, email } = user;
    res.json({ id, name, email });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUserAction = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await getUserByEmail(email);

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user =
    await registerUser({ name, email, password, isAdmin: false });

  if (user) {
    generateToken(res, user.id);

    const { id, name, email } = user;
    res.status(201).json({ id, name, email });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
export const logoutUserAction = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfileAction = asyncHandler(async (req, res) => {
  if (req.user) {
    const user = await getUserById(req.user.id);

    if (user) {
      const { id, name, email } = user;

      res.json({ id, name, email });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no user');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfileAction = asyncHandler(async (req, res) => {
  if (!req.user) {

    res.status(401);
    throw new Error('Not authorized, no user');
  }

  try {
    const updatedUser = await updateUserProfile({ userId: req.user.id, name: req.body.name, email: req.body.email });
    const { id, name, email } = updatedUser;

    res.json({ id, name, email });
  } catch (error) {
    console.error(error);

    res.status(500);
    throw new Error('Failed to update user profile');
  }
});
