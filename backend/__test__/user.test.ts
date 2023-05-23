import { beforeEach, afterAll, describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

import { app } from '../index';
import { createUser, getUserByEmail } from '../models/userModel';

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
            name: 'Sample',
        };

        await createUser(sampleUser);

        const response = await request(app)
            .post('/api/users/login')
            .send({ email: sampleUser.email, password: sampleUser.password });

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
            name: 'New User',
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(newUser);

        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('email');

        const registeredUser = await getUserByEmail(newUser.email);

        expect(registeredUser).toBeDefined();
        expect(registeredUser!.email).toEqual(newUser.email);
    });

    // Other test cases...
});

describe('GET /api/users/profile', () => {
    it('should return user profile', async () => {
        const sampleUser = {
            email: 'sample@gmail.com',
            password: 'password',
            name: 'Sample',
        };

        const createdUser = await createUser(sampleUser);

        const token = jwt.sign({ userId: createdUser.id }, process.env.JWT_SECRET || 'JWT_SECRET');

        const response = await request(app)
            .get('/api/users/profile')
            .set('Cookie', `jwt=${token}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('email');
        expect(response.body.name).toEqual(sampleUser.name);
        expect(response.body.email).toEqual(sampleUser.email);
    });

    // Other test cases...
});
