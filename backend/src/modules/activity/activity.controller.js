import Activity from './activity.model.js';
import { success, paginate } from '../../utils/response.js';
import asyncHandler from '../../utils/asyncHandler.js';

// GET /api/v1/activity
// Query params: ?resource=lead&resourceId=xxx&userId=xxx&page=1&limit=20
export const list = asyncHandler(async (req, res) => {
  const page  = Math.max(1, +req.query.page  || 1);
  const limit = Math.min(+req.query.limit || 20, 100);
  const skip  = (page - 1) * limit;

  const filter = {};
  if (req.query.resource)   filter.resource   = req.query.resource;
  if (req.query.resourceId) filter.resourceId = req.query.resourceId;
  if (req.query.userId)     filter.user        = req.query.userId;

  const [logs, total] = await Promise.all([
    Activity.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Activity.countDocuments(filter),
  ]);

  return paginate(res, logs, total, page, limit);
});
