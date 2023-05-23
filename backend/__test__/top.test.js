// test.js
import request from 'supertest';
import { app } from '../index';

describe('GET /', () => {
    it('responds with "API is running...."', async () => {
        const res = await request(app)
            .get('/')
            .expect('Content-Type', /text/)
            .expect(200);

        expect(res.text).toBe('API is running....');
    });
});