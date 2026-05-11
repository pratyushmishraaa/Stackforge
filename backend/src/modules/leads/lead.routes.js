import { Router } from 'express';
import * as ctrl from './lead.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import authenticate from '../../middlewares/auth.middlware.js';
import { requirePermission } from '../../middlewares/role.middleware.js';
import { createLeadSchema, updateLeadSchema } from './lead.validator.js';

const router = Router();
router.use(authenticate);

router.get('/',      requirePermission('leads','read'),   ctrl.list);
router.post('/',     requirePermission('leads','write'),  validate(createLeadSchema), ctrl.create);
router.get('/:id',   requirePermission('leads','read'),   ctrl.getOne);
router.patch('/:id', requirePermission('leads','write'),  validate(updateLeadSchema), ctrl.update);
router.delete('/:id',requirePermission('leads','delete'), ctrl.remove);

export default router;
