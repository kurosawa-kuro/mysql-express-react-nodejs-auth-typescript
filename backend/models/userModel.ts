// backend\src\app\models\userModel.js

import bcrypt from "bcryptjs";
import { db } from "../database/prisma/prismaClient";

interface User {
    name?: string;
    password: string;
    email: string;
    isAdmin?: boolean;
}

interface UpdateUser {
    userId: number;
    name?: string;
    email?: string;
}

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const createUser = async ({ name, password, email, isAdmin }: User) => {
    if (name === undefined) {
        throw new Error("Required field is missing");
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await db.user.create({
        data: { name, password: hashedPassword, email, isAdmin },
    });

    return newUser;
};

export const getUserByEmail = async (email: string) => {
    return await db.user.findUnique({ where: { email } });
};

export const authenticateUser = async ({ email, password }: User) => {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error("User does not exist");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new Error("Password is incorrect");
    }

    return user;
};

export const getUserById = async (id: number) => {
    return await db.user.findUnique({ where: { id } });
};

export const updateUserProfileData = async ({ userId, name, email }: UpdateUser) => {
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new Error('User not found');
    }

    user.name = name || user.name;
    user.email = email || user.email;

    const updatedUser = await db.user.update({
        where: { id: user.id },
        data: { name: user.name, email: user.email }
    });

    return updatedUser;
};
