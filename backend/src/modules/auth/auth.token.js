import jwt from 'jsonwebtoken';
import jwtConfig from '../../config/jwt.config.js';
import AppError from '../../utils/AppError.js';
import { AUTH_MESSAGES } from '../../constants/messages.js';
import { STATUS } from '../../constants/status.js';

export const signAccessToken = (payload) =>
  jwt.sign(payload, jwtConfig.access.secret, {
    expiresIn: jwtConfig.access.expiresIn,
  });

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.access.secret);
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    throw new AppError(
      isExpired ? AUTH_MESSAGES.TOKEN_EXPIRED : AUTH_MESSAGES.TOKEN_INVALID,
      STATUS.UNAUTHORIZED,
      isExpired ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID'
    );
  }
};
