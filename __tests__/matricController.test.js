const { saveMatricNumber, getMatricNumbers } = require('../controllers/matricController');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient(); // Now uses the mocked PrismaClient from __mocks__

describe('MatricController', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocked methods between tests
  });

  test('saveMatricNumber - Success', async () => {
    const req = { body: { matricNum: 'A12345' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    prisma.matricNumber.create.mockResolvedValue({ id: 1, matricNum: 'A12345', createdAt: new Date() });

    await saveMatricNumber(req, res);

    expect(prisma.matricNumber.create).toHaveBeenCalledWith({
      data: { matricNum: 'A12345' },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, matricNum: 'A12345', createdAt: expect.any(Date) });
  });

  test('saveMatricNumber - Failure', async () => {
    const req = { body: { matricNum: 'A12345' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    prisma.matricNumber.create.mockRejectedValue(new Error('Database error'));

    await saveMatricNumber(req, res);

    expect(prisma.matricNumber.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
  });

  test('getMatricNumbers - Success', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    prisma.matricNumber.findMany.mockResolvedValue([{ id: 1, matricNum: 'A12345', createdAt: new Date() }]);

    await getMatricNumbers(req, res);

    expect(prisma.matricNumber.findMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, matricNum: 'A12345', createdAt: expect.any(Date) }]);
  });
});
