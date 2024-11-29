const mockPrisma = {
    matricNumber: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  module.exports = {
    PrismaClient: jest.fn(() => mockPrisma),
  };
