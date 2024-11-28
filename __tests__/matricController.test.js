const request = require('supertest');
const express = require('express');
const routes = require('../routes');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use('/api', routes);

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    matricNumber: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  })),
}));

describe('MatricController API Tests', () => {
  const mockData = [
    { id: 1, matricNum: '123456', createdAt: new Date() },
    { id: 2, matricNum: '789012', createdAt: new Date() },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save a matric number successfully', async () => {
    const matricNum = '123456';
    prisma.matricNumber.create.mockResolvedValue({
      id: 1,
      matricNum,
      createdAt: new Date(),
    });

    const res = await request(app).post('/api/matric').send({ matricNum });
    expect(res.statusCode).toBe(201);
    expect(res.body.matricNum).toBe(matricNum);
  });

  it('should return an error if matricNum is missing', async () => {
    const res = await request(app).post('/api/matric').send({});
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  it('should return an error if saving to database fails', async () => {
    prisma.matricNumber.create.mockRejectedValue(new Error('Database error'));

    const res = await request(app).post('/api/matric').send({ matricNum: '123456' });
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Database error');
  });

  it('should fetch all matric numbers successfully', async () => {
    prisma.matricNumber.findMany.mockResolvedValue(mockData);

    const res = await request(app).get('/api/matrics');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(mockData.length);
  });

  it('should return an error if fetching from database fails', async () => {
    prisma.matricNumber.findMany.mockRejectedValue(new Error('Database error'));

    const res = await request(app).get('/api/matrics');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Database error');
  });
});
