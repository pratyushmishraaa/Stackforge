import { Router } from 'express';
import * as ctrl from './user.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import validateId from '../../middlewares/validateId.middleware.js';
import authenticate from '../../middlewares/auth.middlware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { updateUserSchema } from './user.validator.js';
import { ADMIN, MANAGER } from '../../constants/roles.js';

const router = Router();
router.use(authenticate);

router.get('/',                    authorize(ADMIN, MANAGER),                    ctrl.list);
router.get('/:id',                 validateId,                                   ctrl.getOne);
router.patch('/:id',               validateId, validate(updateUserSchema),        ctrl.update);
router.patch('/:id/deactivate',    validateId, authorize(ADMIN),                  ctrl.deactivate);

export default router;
