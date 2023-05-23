// backend\src\app\models\userModel.js

import bcrypt from "bcryptjs";
import { db } from "../database/prisma/prismaClient";

interface User {
    name: string;
    password: string;
    email: string;
    isAdmin: boolean;
}

interface LoginUser {
    password: string;
    email: string;
}

interface UpdateUser {
    userId: number;
    name: string;
    email: string;
}

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const getUserById = async (id: number) => {
    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

export const registerUser = async (user: User) => {
    const hashedPassword = await hashPassword(user.password);
    const newUser = await db.user.create({
        data: {
            name: user.name,
            password: hashedPassword,
            email: user.email,
            isAdmin: user.isAdmin || false
        },
    });

    return newUser;
};

export const getUserByEmail = async (email: string) => {
    return await db.user.findUnique({ where: { email } });
};

export const loginUser = async (user: LoginUser) => {
    const dbUser = await getUserByEmail(user.email);

    if (!dbUser) {
        throw new Error("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(user.password, dbUser.password);
    if (!isPasswordCorrect) {
        throw new Error("Password is incorrect");
    }

    return dbUser;
};

export const updateUserProfile = async (user: UpdateUser) => {
    const dbUser = await getUserById(user.userId);

    dbUser.name = user.name || dbUser.name;
    dbUser.email = user.email || dbUser.email;

    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: { name: dbUser.name, email: dbUser.email }
    });

    return updatedUser;
};
