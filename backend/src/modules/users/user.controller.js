import User from './user.model.js';
import AppError from '../../utils/AppError.js';
import { success, paginate } from '../../utils/response.js';
import { STATUS, ACCOUNT_STATUS } from '../../constants/status.js';
import asyncHandler from '../../utils/asyncHandler.js';

// GET /api/v1/users
// Filters: search, role, status, sort, order
export const list = asyncHandler(async (req, res) => {
  const page  = Math.max(1, +req.query.page  || 1);
  const limit = Math.min(+req.query.limit || 20, 100);
  const { search, role, status, sort = 'createdAt', order = 'desc' } = req.query;

  const filter = {};
  if (search) filter.name   = { $regex: search, $options: 'i' };
  if (role)   filter.role   = role;
  if (status) filter.status = status;

  const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
  const skip    = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).sort(sortObj).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return paginate(res, users, total, page, limit);
});

// GET /api/v1/users/:id
export const getOne = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { user: user.toSafeObject() });
});

// PATCH /api/v1/users/:id
export const update = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) throw new AppError('User not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { user: user.toSafeObject() });
});

// PATCH /api/v1/users/:id/deactivate
export const deactivate = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: ACCOUNT_STATUS.INACTIVE }, { new: true });
  if (!user) throw new AppError('User not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { user: user.toSafeObject() }, STATUS.OK, 'User deactivated.');
});

// PATCH /api/v1/users/me/profile  — update own profile (name, phone, bio, avatar)
export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'bio', 'avatar'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  const user = await User.findByIdAndUpdate(req.user.sub, updates, { new: true, runValidators: true });
  if (!user) throw new AppError('User not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { user: user.toSafeObject() }, STATUS.OK, 'Profile updated.');
});

// PATCH /api/v1/users/me/password  — change own password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new AppError('Current and new password are required.', STATUS.BAD_REQUEST, 'VALIDATION_ERROR');
  }
  if (newPassword.length < 8) {
    throw new AppError('New password must be at least 8 characters.', STATUS.BAD_REQUEST, 'VALIDATION_ERROR');
  }
  const user = await User.findById(req.user.sub).select('+password');
  if (!user) throw new AppError('User not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect.', STATUS.UNAUTHORIZED, 'INVALID_CREDENTIALS');
  user.password = newPassword;
  await user.save();
  return success(res, null, STATUS.OK, 'Password changed successfully.');
});
