import Task from './task.model.js';
import AppError from '../../utils/AppError.js';
import { success, paginate } from '../../utils/response.js';
import { STATUS } from '../../constants/status.js';
import asyncHandler from '../../utils/asyncHandler.js';

// GET /api/v1/tasks
// Filters: search, status, priority, assignedTo, dueBefore, dueAfter, sort, order
export const list = asyncHandler(async (req, res) => {
  const page  = Math.max(1, +req.query.page  || 1);
  const limit = Math.min(+req.query.limit || 20, 100);
  const { search, status, priority, assignedTo, dueBefore, dueAfter, sort = 'dueDate', order = 'asc' } = req.query;

  const filter = { isDeleted: false };
  if (search)   filter.title    = { $regex: search, $options: 'i' };
  if (status)   filter.status   = status;
  if (priority) filter.priority = priority;
  if (assignedTo === 'me') filter.assignedTo = req.user.sub;
  else if (assignedTo)     filter.assignedTo = assignedTo;
  if (dueBefore || dueAfter) {
    filter.dueDate = {};
    if (dueAfter)  filter.dueDate.$gte = new Date(dueAfter);
    if (dueBefore) filter.dueDate.$lte = new Date(dueBefore);
  }

  const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
  const skip    = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    Task.find(filter).populate('assignedTo', 'name email').sort(sortObj).skip(skip).limit(limit),
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
