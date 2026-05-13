import Deal from './deal.model.js';
import AppError from '../../utils/AppError.js';
import { success, paginate } from '../../utils/response.js';
import { STATUS } from '../../constants/status.js';
import asyncHandler from '../../utils/asyncHandler.js';

// GET /api/v1/deals
export const list = asyncHandler(async (req, res) => {
  const page  = Math.max(1, +req.query.page  || 1);
  const limit = Math.min(+req.query.limit || 20, 100);
  const { search } = req.query;
  const filter = { isDeleted: false };
  if (search) filter.title = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;
  const [deals, total] = await Promise.all([
    Deal.find(filter).populate('lead', 'name email').skip(skip).limit(+limit).sort({ createdAt: -1 }),
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
