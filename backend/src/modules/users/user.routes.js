import { Router } from 'express';
import * as ctrl from './user.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import authenticate from '../../middlewares/auth.middlware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { updateUserSchema } from './user.validator.js';
import { ADMIN, MANAGER } from '../../constants/roles.js';

const router = Router();
router.use(authenticate);

router.get('/',              authorize(ADMIN, MANAGER),  ctrl.list);
router.get('/:id',           ctrl.getOne);
router.patch('/:id',         validate(updateUserSchema), ctrl.update);
router.patch('/:id/deactivate', authorize(ADMIN),        ctrl.deactivate);

export default router;
