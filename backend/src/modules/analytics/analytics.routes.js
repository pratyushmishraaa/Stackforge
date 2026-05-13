import { Router } from 'express';
import * as ctrl from './analytics.controller.js';
import authenticate from '../../middlewares/auth.middlware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { ADMIN, MANAGER } from '../../constants/roles.js';

const router = Router();
router.use(authenticate);
router.use(authorize(ADMIN, MANAGER)); // agents don't see analytics

router.get('/summary', ctrl.summary);  // GET /api/v1/analytics/summary
router.get('/leads',   ctrl.leadStats); // GET /api/v1/analytics/leads
router.get('/deals',   ctrl.dealStats); // GET /api/v1/analytics/deals
router.get('/tasks',   ctrl.taskStats); // GET /api/v1/analytics/tasks
router.get('/agents',  ctrl.agentStats);// GET /api/v1/analytics/agents

export default router;
