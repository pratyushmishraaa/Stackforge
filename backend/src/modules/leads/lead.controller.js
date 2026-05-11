import Lead from './lead.model.js';
import AppError from '../../utils/AppError.js';
import { success, paginate } from '../../utils/response.js';
import { STATUS } from '../../constants/status.js';
import asyncHandler from '../../utils/asyncHandler.js';

// GET /api/v1/leads
export const list = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filter = { isDeleted: false };
  if (search) filter.name = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;
  const [leads, total] = await Promise.all([
    Lead.find(filter).populate('organisation', 'name industry').skip(skip).limit(+limit).sort({ createdAt: -1 }),
    Lead.countDocuments(filter),
  ]);
  return paginate(res, leads, total, page, limit);
});

// POST /api/v1/leads
export const create = asyncHandler(async (req, res) => {
  const lead = await Lead.create({ ...req.body, assignedTo: req.user.sub });
  return success(res, { lead }, STATUS.CREATED);
});

// GET /api/v1/leads/:id
export const getOne = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id, isDeleted: false }).populate('organisation', 'name industry');
  if (!lead) throw new AppError('Lead not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { lead });
});

// PATCH /api/v1/leads/:id
export const update = asyncHandler(async (req, res) => {
  const lead = await Lead.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
  if (!lead) throw new AppError('Lead not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { lead });
});

// DELETE /api/v1/leads/:id  (soft delete)
export const remove = asyncHandler(async (req, res) => {
  const lead = await Lead.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true });
  if (!lead) throw new AppError('Lead not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, null, STATUS.OK, 'Lead deleted.');
});
