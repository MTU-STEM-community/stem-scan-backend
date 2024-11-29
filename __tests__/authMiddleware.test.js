const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

jest.mock('jsonwebtoken');

describe('authenticateToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { header: jest.fn() };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Valid Token', () => {
    const user = { id: 1, name: 'Test User' };
    const token = 'valid-token';
    req.header.mockReturnValue(`Bearer ${token}`);
    jwt.verify.mockReturnValue(user);

    authenticateToken(req, res, next);

    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  test('No Token', () => {
    req.header.mockReturnValue(undefined);

    authenticateToken(req, res, next);

    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Access Denied');
    expect(next).not.toHaveBeenCalled();
  });

  test('Invalid Token', () => {
    const token = 'invalid-token';
    req.header.mockReturnValue(`Bearer ${token}`);
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticateToken(req, res, next);

    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Invalid Token');
    expect(next).not.toHaveBeenCalled();
  });
});
