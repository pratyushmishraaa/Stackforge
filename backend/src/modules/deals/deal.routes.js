import { Router } from 'express';
import * as ctrl from './deal.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import validateId from '../../middlewares/validateId.middleware.js';
import authenticate from '../../middlewares/auth.middlware.js';
import { requirePermission } from '../../middlewares/role.middleware.js';
import { createDealSchema, updateDealSchema } from './deal.validator.js';

const router = Router();
router.use(authenticate);

router.get('/',                                                                    ctrl.list);
router.post('/',     requirePermission('deals','write'), validate(createDealSchema), ctrl.create);
router.get('/:id',   validateId, requirePermission('deals','read'),                  ctrl.getOne);
router.patch('/:id', validateId, requirePermission('deals','write'), validate(updateDealSchema), ctrl.update);
router.delete('/:id',validateId, requirePermission('deals','delete'),                ctrl.remove);

export default router;
