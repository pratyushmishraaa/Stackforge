import { verifyAccessToken } from '../modules/auth/auth.token.js';
import AppError from '../utils/AppError.js';
import { AUTH_MESSAGES } from '../constants/messages.js';
import { STATUS } from '../constants/status.js';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(AUTH_MESSAGES.UNAUTHORIZED, STATUS.UNAUTHORIZED, 'UNAUTHORIZED'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { sub, role, iat, exp }
    return next();
  } catch (err) {
    return next(err);
  }
};

export default authenticate;
