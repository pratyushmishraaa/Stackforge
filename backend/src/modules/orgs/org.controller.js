import Org from './org.model.js';
import AppError from '../../utils/AppError.js';
import { success, paginate } from '../../utils/response.js';
import { STATUS } from '../../constants/status.js';
import asyncHandler from '../../utils/asyncHandler.js';

// GET /api/v1/orgs
export const list = asyncHandler(async (req, res) => {
  const page  = Math.max(1, +req.query.page  || 1);
  const limit = Math.min(+req.query.limit || 20, 100);
  const { search } = req.query;
  const filter = { isDeleted: false };
  if (search) filter.name = { $regex: search, $options: 'i' };

  const skip  = (page - 1) * limit;
  const [orgs, total] = await Promise.all([
    Org.find(filter).skip(skip).limit(+limit).sort({ createdAt: -1 }),
    Org.countDocuments(filter),
  ]);
  return paginate(res, orgs, total, page, limit);
});

// POST /api/v1/orgs
export const create = asyncHandler(async (req, res) => {
  const org = await Org.create({ ...req.body, createdBy: req.user.sub });
  return success(res, { org }, STATUS.CREATED);
});

// GET /api/v1/orgs/:id
export const getOne = asyncHandler(async (req, res) => {
  const org = await Org.findOne({ _id: req.params.id, isDeleted: false });
  if (!org) throw new AppError('Organisation not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { org });
});

// PATCH /api/v1/orgs/:id
export const update = asyncHandler(async (req, res) => {
  const org = await Org.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
  if (!org) throw new AppError('Organisation not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { org });
});

// DELETE /api/v1/orgs/:id  (soft delete)
export const remove = asyncHandler(async (req, res) => {
  const org = await Org.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true });
  if (!org) throw new AppError('Organisation not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, null, STATUS.OK, 'Organisation deleted.');
});
