import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken';
import {
  createUser,
  getUserByEmail,
  authenticateUser,
  getUserById,
  updateUserProfileData
} from '../models/userModel';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await authenticateUser({ email, password });

  if (user) {
    generateToken(res, user.id);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await getUserByEmail(email);

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await createUser({ name, email, password, isAdmin: false });

  if (user) {
    generateToken(res, user.id);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
export const logoutUser = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    const user = await getUserById(req.user.id);

    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
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
export const updateUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, no user');
  }

  try {
    const updatedUser = await updateUserProfileData({ userId: req.user.id, name: req.body.name, email: req.body.email });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Failed to update user profile');
  }
});


