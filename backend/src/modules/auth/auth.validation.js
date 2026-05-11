import Joi from 'joi';
import { ADMIN, MANAGER, AGENT } from '../../constants/roles.js';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages({
    'string.min':   'Name must be at least 2 characters.',
    'string.max':   'Name must not exceed 100 characters.',
    'any.required': 'Name is required.',
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string()
    .min(8).max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min':          'Password must be at least 8 characters.',
      'string.pattern.base': 'Password must contain uppercase, lowercase, and a number.',
      'any.required':        'Password is required.',
    }),
  role: Joi.string().valid(ADMIN, MANAGER, AGENT).default(AGENT).messages({
    'any.only': `Role must be one of: ${ADMIN}, ${MANAGER}, ${AGENT}.`,
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});
