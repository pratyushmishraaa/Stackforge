import { Router } from 'express';
import * as ctrl from './lead.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import validateId from '../../middlewares/validateId.middleware.js';
import authenticate from '../../middlewares/auth.middlware.js';
import { requirePermission } from '../../middlewares/role.middleware.js';
import { createLeadSchema, updateLeadSchema } from './lead.validator.js';

const router = Router();
router.use(authenticate);

router.get('/',                                                                   ctrl.list);
router.post('/',     requirePermission('leads','write'), validate(createLeadSchema), ctrl.create);
router.get('/:id',   validateId, requirePermission('leads','read'),                  ctrl.getOne);
router.patch('/:id', validateId, requirePermission('leads','write'), validate(updateLeadSchema), ctrl.update);
router.delete('/:id',validateId, requirePermission('leads','delete'),                ctrl.remove);

export default router;
