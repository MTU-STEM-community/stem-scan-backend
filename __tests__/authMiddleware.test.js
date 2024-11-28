const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('Auth Middleware Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass when a valid token is provided', () => {
    const req = { header: jest.fn().mockReturnValue('Bearer validToken') };
    const res = {};
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { userId: 1 });
    });

    authenticateToken(req, res, next);
    expect(req.user).toEqual({ userId: 1 });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 when no token is provided', () => {
    const req = { header: jest.fn() };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Access Denied');
  });

  it('should return 400 when the token is invalid', () => {
    const req = { header: jest.fn().mockReturnValue('Bearer invalidToken') };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid Token');
    });

    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Invalid Token');
  });

  it('should return 401 when token verification fails', () => {
    const req = { header: jest.fn().mockReturnValue('Bearer invalidToken') };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Token verification failed'), null);
    });

    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Access Denied');
  });
});
