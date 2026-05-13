import { Router } from 'express';
import * as ctrl from './task.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import validateId from '../../middlewares/validateId.middleware.js';
import authenticate from '../../middlewares/auth.middlware.js';
import { requirePermission } from '../../middlewares/role.middleware.js';
import { createTaskSchema, updateTaskSchema } from './task.validator.js';

const router = Router();
router.use(authenticate);

router.get('/',                                                                    ctrl.list);
router.post('/',     requirePermission('tasks','write'), validate(createTaskSchema), ctrl.create);
router.get('/:id',   validateId, requirePermission('tasks','read'),                  ctrl.getOne);
router.patch('/:id', validateId, requirePermission('tasks','write'), validate(updateTaskSchema), ctrl.update);
router.delete('/:id',validateId, requirePermission('tasks','delete'),                ctrl.remove);

export default router;
