import Task from './task.model.js';
import AppError from '../../utils/AppError.js';
import { success, paginate } from '../../utils/response.js';
import { STATUS } from '../../constants/status.js';
import asyncHandler from '../../utils/asyncHandler.js';

// GET /api/v1/tasks
export const list = asyncHandler(async (req, res) => {
  const page  = Math.max(1, +req.query.page  || 1);
  const limit = Math.min(+req.query.limit || 20, 100);
  const { assignedTo } = req.query;
  const filter = { isDeleted: false };
  if (assignedTo === 'me') filter.assignedTo = req.user.sub;

  const skip = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    Task.find(filter).populate('assignedTo', 'name email').skip(skip).limit(+limit).sort({ createdAt: -1 }),
    Task.countDocuments(filter),
  ]);
  return paginate(res, tasks, total, page, limit);
});

// POST /api/v1/tasks
export const create = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  return success(res, { task }, STATUS.CREATED);
});

// GET /api/v1/tasks/:id
export const getOne = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, isDeleted: false }).populate('assignedTo', 'name email');
  if (!task) throw new AppError('Task not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { task });
});

// PATCH /api/v1/tasks/:id
export const update = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
  if (!task) throw new AppError('Task not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { task });
});

// DELETE /api/v1/tasks/:id  (soft delete)
export const remove = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true });
  if (!task) throw new AppError('Task not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, null, STATUS.OK, 'Task deleted.');
});
