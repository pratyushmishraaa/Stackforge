import Deal from './deal.model.js';
import AppError from '../../utils/AppError.js';
import { success, paginate } from '../../utils/response.js';
import { STATUS } from '../../constants/status.js';
import asyncHandler from '../../utils/asyncHandler.js';

// GET /api/v1/deals
// Filters: search, stage, assignedTo, minValue, maxValue, dateFrom, dateTo, sort, order
export const list = asyncHandler(async (req, res) => {
  const page  = Math.max(1, +req.query.page  || 1);
  const limit = Math.min(+req.query.limit || 20, 100);
  const { search, stage, assignedTo, minValue, maxValue, dateFrom, dateTo, sort = 'createdAt', order = 'desc' } = req.query;

  const filter = { isDeleted: false };
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (stage)  filter.stage = stage;
  if (assignedTo === 'me') filter.assignedTo = req.user.sub;
  else if (assignedTo)     filter.assignedTo = assignedTo;
  if (minValue || maxValue) {
    filter.value = {};
    if (minValue) filter.value.$gte = +minValue;
    if (maxValue) filter.value.$lte = +maxValue;
  }
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo)   filter.createdAt.$lte = new Date(dateTo);
  }

  const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
  const skip    = (page - 1) * limit;
  const [deals, total] = await Promise.all([
    Deal.find(filter).populate('lead', 'name email').sort(sortObj).skip(skip).limit(limit),
    Deal.countDocuments(filter),
  ]);
  return paginate(res, deals, total, page, limit);
});



// POST /api/v1/deals
export const create = asyncHandler(async (req, res) => {
  const deal = await Deal.create({ ...req.body, assignedTo: req.user.sub });
  return success(res, { deal }, STATUS.CREATED);
});

// GET /api/v1/deals/:id
export const getOne = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ _id: req.params.id, isDeleted: false }).populate('lead', 'name email');
  if (!deal) throw new AppError('Deal not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { deal });
});

// PATCH /api/v1/deals/:id
export const update = asyncHandler(async (req, res) => {
  const deal = await Deal.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
  if (!deal) throw new AppError('Deal not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, { deal });
});

// DELETE /api/v1/deals/:id  (soft delete)
export const remove = asyncHandler(async (req, res) => {
  const deal = await Deal.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true });
  if (!deal) throw new AppError('Deal not found.', STATUS.NOT_FOUND, 'NOT_FOUND');
  return success(res, null, STATUS.OK, 'Deal deleted.');
});
