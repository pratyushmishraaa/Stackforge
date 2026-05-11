import Joi from 'joi';
import { ADMIN, MANAGER, AGENT } from '../../constants/roles.js';

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  role: Joi.string().valid(ADMIN, MANAGER, AGENT),
}).min(1);
