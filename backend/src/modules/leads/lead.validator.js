import Joi from 'joi';

export const createLeadSchema = Joi.object({
  name:         Joi.string().trim().required(),
  email:        Joi.string().email().lowercase().trim(),
  phone:        Joi.string().trim(),
  status:       Joi.string().valid('new','contacted','qualified','lost','converted'),
  source:       Joi.string().valid('manual','web','referral','import'),
  organisation: Joi.string().hex().length(24),
});

export const updateLeadSchema = Joi.object({
  name:         Joi.string().trim(),
  email:        Joi.string().email().lowercase().trim(),
  phone:        Joi.string().trim(),
  status:       Joi.string().valid('new','contacted','qualified','lost','converted'),
  source:       Joi.string().valid('manual','web','referral','import'),
  organisation: Joi.string().hex().length(24),
  assignedTo:   Joi.string().hex().length(24),
}).min(1);
