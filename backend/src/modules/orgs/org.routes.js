import { Router } from 'express';
import * as ctrl from './org.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import validateId from '../../middlewares/validateId.middleware.js';
import authenticate from '../../middlewares/auth.middlware.js';
import { requirePermission } from '../../middlewares/role.middleware.js';
import { createOrgSchema, updateOrgSchema } from './org.validator.js';
import logActivity from '../../middlewares/logActivity.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/',                                                                           ctrl.list);
router.post('/',     requirePermission('orgs','write'),  validate(createOrgSchema),  logActivity, ctrl.create);
router.get('/:id',   validateId, requirePermission('orgs','read'),                        ctrl.getOne);
router.patch('/:id', validateId, requirePermission('orgs','write'),  validate(updateOrgSchema), logActivity, ctrl.update);
router.delete('/:id',validateId, requirePermission('orgs','delete'), logActivity,         ctrl.remove);

export default router;
