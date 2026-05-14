import Lead from './lead.model.js';
import AppError from '../../utils/AppError.js';
import { success, paginate } from '../../utils/response.js';
import { STATUS } from '../../constants/status.js';
import asyncHandler from '../../utils/asyncHandler.js';

// GET /api/v1/leads
// Filters: search, status, source, assignedTo, organisation, dateFrom, dateTo, sort, order
export const list = asyncHandler(async (req, res) => {
  const page  = Math.max(1, +req.query.page  || 1);
  const limit = Math.min(+req.query.limit || 20, 100);
  const { search, status, source, assignedTo, organisation, dateFrom, dateTo, sort = 'createdAt', order = 'desc' } = req.query;

  const filter = { isDeleted: false };
  if (search)       filter.name         = { $regex: search, $options: 'i' };
  if (status)       filter.status       = status;
  if (source)       filter.source       = source;
  if (organisation) filter.organisation = organisation;
  if (assignedTo === 'me') filter.assignedTo = req.user.sub;
  else if (assignedTo)     filter.assignedTo = assignedTo;
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo)   filter.createdAt.$lte = new Date(dateTo);
  }

  const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
  const skip    = (page - 1) * limit;
  const [leads, total] = await Promise.all([
    Lead.find(filter).populate('organisation', 'name industry').sort(sortObj).skip(skip).limit(limit),
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
