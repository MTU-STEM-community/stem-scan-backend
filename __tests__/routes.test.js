const request = require('supertest');
const express = require('express');
const routes = require('../routes');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient(); // Now uses the mocked PrismaClient
const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/matric - Success', async () => {
    prisma.matricNumber.create.mockResolvedValue({ id: 1, matricNum: 'A12345', createdAt: new Date() });

    const res = await request(app).post('/api/matric').send({ matricNum: 'A12345' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 1, matricNum: 'A12345', createdAt: expect.any(String) });
    expect(prisma.matricNumber.create).toHaveBeenCalledWith({ data: { matricNum: 'A12345' } });
  });

  test('GET /api/matrics - Success', async () => {
    prisma.matricNumber.findMany.mockResolvedValue([{ id: 1, matricNum: 'A12345', createdAt: new Date() }]);

    const res = await request(app).get('/api/matrics');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, matricNum: 'A12345', createdAt: expect.any(String) }]);
    expect(prisma.matricNumber.findMany).toHaveBeenCalled();
  });
});
