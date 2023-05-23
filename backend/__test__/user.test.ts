// backend\__test__\user.test.ts

import { beforeEach, afterAll, describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { app } from '../index';
import { createUser, getUserByEmail } from "../models/userModel";

const prismaClient = new PrismaClient();

beforeEach(async () => {
    await prismaClient.user.deleteMany();
});

afterAll(async () => {
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
});

describe('POST /api/users/login', () => {
    it('should login user', async () => {

        const sampleUser = {
            email: 'sample@gmail.com',
            password: 'password',
            name: 'Sample'
        }

        await createUser({
            email: sampleUser.email,
            password: sampleUser.password,
            name: sampleUser.name
        });

        const response = await request(app)
            .post('/api/users/login')
            .send({ email: sampleUser.email, password: sampleUser.password });

        console.log("Response Body", response.body);
        console.log("response.headers['set-cookie']", response.headers['set-cookie']);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email');
    });

    // Other test cases...
});

describe('POST /api/users', () => {
    it('should register a new user', async () => {

        const newUser = {
            email: 'newUser@gmail.com',
            password: 'password',
            name: 'New User'
        }

        const response = await request(app)
            .post('/api/users/register')
            .send(newUser);

        console.log("Response Body", response.body);

        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email');

        const registeredUser = await getUserByEmail(newUser.email);

        if (registeredUser) {
            expect(registeredUser).toBeDefined();
            expect(registeredUser.email).toEqual(newUser.email);
        }
    });

    // Other test cases...
});

describe('GET /api/users/profile', () => {
    it('should return user profile', async () => {

        const sampleUser = {
            email: 'sample@gmail.com',
            password: 'password',
            name: 'Sample'
        }

        const createdUser = await createUser({
            email: sampleUser.email,
            password: sampleUser.password,
            name: sampleUser.name
        });

        const token = jwt.sign({ userId: createdUser.id }, process.env.JWT_SECRET || 'JWT_SECRET');
        console.log("Generated Token", token);

        const response = await request(app)
            .get('/api/users/profile')
            .set('Cookie', `jwt=${token}`);

        console.log("Profile Response Body", response.body);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('email');
        expect(response.body.name).toEqual(sampleUser.name);
        expect(response.body.email).toEqual(sampleUser.email);
    });

    // Other test cases...
});

