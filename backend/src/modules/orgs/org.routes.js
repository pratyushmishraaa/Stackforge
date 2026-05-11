import { Router } from 'express';
import * as ctrl from './org.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import authenticate from '../../middlewares/auth.middlware.js';
import { requirePermission } from '../../middlewares/role.middleware.js';
import { createOrgSchema, updateOrgSchema } from './org.validator.js';

const router = Router();
router.use(authenticate);

router.get('/',     requirePermission('orgs','read'),   ctrl.list);
router.post('/',    requirePermission('orgs','write'),  validate(createOrgSchema), ctrl.create);
router.get('/:id',  requirePermission('orgs','read'),   ctrl.getOne);
router.patch('/:id',requirePermission('orgs','write'),  validate(updateOrgSchema), ctrl.update);
router.delete('/:id',requirePermission('orgs','delete'),ctrl.remove);

export default router;
