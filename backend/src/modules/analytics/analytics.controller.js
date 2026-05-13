import Lead from '../leads/lead.model.js';
import Deal from '../deals/deal.model.js';
import Task from '../tasks/task.model.js';
import User from '../users/user.model.js';
import { success } from '../../utils/response.js';
import asyncHandler from '../../utils/asyncHandler.js';

// GET /api/v1/analytics/leads
// Lead funnel — count by status
export const leadStats = asyncHandler(async (req, res) => {
  const funnel = await Lead.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  const total = await Lead.countDocuments({ isDeleted: false });
  return success(res, { total, funnel });
});

// GET /api/v1/analytics/deals
// Pipeline value by stage + total won revenue
export const dealStats = asyncHandler(async (req, res) => {
  const pipeline = await Deal.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id:        '$stage',
        count:      { $sum: 1 },
        totalValue: { $sum: '$value' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const wonRevenue = await Deal.aggregate([
    { $match: { isDeleted: false, stage: 'won' } },
    { $group: { _id: null, total: { $sum: '$value' } } },
  ]);
  return success(res, {
    pipeline,
    wonRevenue: wonRevenue[0]?.total || 0,
  });
});

// GET /api/v1/analytics/tasks
// Task breakdown by status + overdue count
export const taskStats = asyncHandler(async (req, res) => {
  const breakdown = await Task.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const overdue = await Task.countDocuments({
    isDeleted: false,
    status:    { $in: ['open', 'in_progress'] },
    dueDate:   { $lt: new Date() },
  });
  return success(res, { breakdown, overdue });
});

// GET /api/v1/analytics/agents
// Per-agent: open leads, open deals, overdue tasks
export const agentStats = asyncHandler(async (req, res) => {
  const [leads, deals, tasks] = await Promise.all([
    Lead.aggregate([
      { $match: { isDeleted: false, assignedTo: { $exists: true } } },
      { $group: { _id: '$assignedTo', openLeads: { $sum: 1 } } },
    ]),
    Deal.aggregate([
      { $match: { isDeleted: false, stage: { $nin: ['won','lost'] }, assignedTo: { $exists: true } } },
      { $group: { _id: '$assignedTo', openDeals: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { isDeleted: false, status: { $ne: 'done' }, dueDate: { $lt: new Date() }, assignedTo: { $exists: true } } },
      { $group: { _id: '$assignedTo', overdueTasks: { $sum: 1 } } },
    ]),
  ]);

  // Merge all three by agentId
  const map = {};
  leads.forEach(({ _id, openLeads })     => { map[_id] = { ...map[_id], openLeads }; });
  deals.forEach(({ _id, openDeals })     => { map[_id] = { ...map[_id], openDeals }; });
  tasks.forEach(({ _id, overdueTasks })  => { map[_id] = { ...map[_id], overdueTasks }; });

  // Populate agent names
  const agentIds = Object.keys(map);
  const users    = await User.find({ _id: { $in: agentIds } }, 'name email');
  const userMap  = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

  const agents = agentIds.map((id) => ({
    agent:        userMap[id] ? { _id: id, name: userMap[id].name, email: userMap[id].email } : { _id: id },
    openLeads:    map[id].openLeads    || 0,
    openDeals:    map[id].openDeals    || 0,
    overdueTasks: map[id].overdueTasks || 0,
  }));

  return success(res, { agents });
});

// GET /api/v1/analytics/summary
// Single dashboard card — totals at a glance
export const summary = asyncHandler(async (req, res) => {
  const [totalLeads, totalDeals, totalTasks, totalOrgs, wonRevenue, overdueTasksCount] = await Promise.all([
    Lead.countDocuments({ isDeleted: false }),
    Deal.countDocuments({ isDeleted: false }),
    Task.countDocuments({ isDeleted: false }),
    (await import('../orgs/org.model.js')).default.countDocuments({ isDeleted: false }),
    Deal.aggregate([{ $match: { isDeleted: false, stage: 'won' } }, { $group: { _id: null, total: { $sum: '$value' } } }]),
    Task.countDocuments({ isDeleted: false, status: { $in: ['open','in_progress'] }, dueDate: { $lt: new Date() } }),
  ]);

  return success(res, {
    totalLeads,
    totalDeals,
    totalTasks,
    totalOrgs,
    wonRevenue:        wonRevenue[0]?.total || 0,
    overdueTasksCount,
  });
});
