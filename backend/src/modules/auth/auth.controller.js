import User from '../users/user.model.js';
import { signAccessToken } from './auth.token.js';
import { success } from '../../utils/response.js';
import { AUTH_MESSAGES } from '../../constants/messages.js';
import { STATUS, ACCOUNT_STATUS } from '../../constants/status.js';
import AppError from '../../utils/AppError.js';
import asyncHandler from '../../utils/asyncHandler.js';

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
  if (await User.findOne({ email: req.body.email })) {
    throw new AppError(AUTH_MESSAGES.EMAIL_TAKEN, STATUS.CONFLICT, 'EMAIL_TAKEN');
  }

  const user        = await User.create(req.body);
  const accessToken = signAccessToken({ sub: user._id, role: user.role });

  return success(res, { user: user.toSafeObject(), accessToken }, STATUS.CREATED, AUTH_MESSAGES.REGISTER_SUCCESS);
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, STATUS.UNAUTHORIZED, 'INVALID_CREDENTIALS');
  }
  if (user.status === ACCOUNT_STATUS.INACTIVE) {
    throw new AppError(AUTH_MESSAGES.ACCOUNT_INACTIVE, STATUS.FORBIDDEN, 'ACCOUNT_INACTIVE');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = signAccessToken({ sub: user._id, role: user.role });

  return success(res, { user: user.toSafeObject(), accessToken }, STATUS.OK, AUTH_MESSAGES.LOGIN_SUCCESS);
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req, res) => {
  // With JWT-only auth, logout is handled client-side by discarding the token.
  // Nothing to invalidate on the server.
  return success(res, null, STATUS.OK, AUTH_MESSAGES.LOGOUT_SUCCESS);
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, STATUS.NOT_FOUND, 'USER_NOT_FOUND');
  return success(res, { user: user.toSafeObject() }, STATUS.OK);
});
