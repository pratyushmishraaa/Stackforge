import Joi from 'joi';

export const createLeadSchema = Joi.object({
  name:         Joi.string().trim().min(2).max(100).required(),
  email:        Joi.string().email().lowercase().trim().max(150),
  phone:        Joi.string().trim().max(20),
  status:       Joi.string().valid('new','contacted','qualified','lost','converted'),
  source:       Joi.string().valid('manual','web','referral','import'),
  organisation: Joi.string().hex().length(24),
});

export const updateLeadSchema = Joi.object({
  name:         Joi.string().trim().min(2).max(100),
  email:        Joi.string().email().lowercase().trim().max(150),
  phone:        Joi.string().trim().max(20),
  status:       Joi.string().valid('new','contacted','qualified','lost','converted'),
  source:       Joi.string().valid('manual','web','referral','import'),
  organisation: Joi.string().hex().length(24),
  assignedTo:   Joi.string().hex().length(24),
}).min(1);
