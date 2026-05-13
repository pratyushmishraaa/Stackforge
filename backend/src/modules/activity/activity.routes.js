import { Router } from 'express';
import { list } from './activity.controller.js';
import authenticate from '../../middlewares/auth.middlware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { ADMIN, MANAGER } from '../../constants/roles.js';

const router = Router();
router.use(authenticate);
router.use(authorize(ADMIN, MANAGER)); // agents can't see the audit trail

router.get('/', list);

export default router;
