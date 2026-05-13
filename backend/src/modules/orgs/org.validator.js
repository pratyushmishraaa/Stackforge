import Joi from 'joi';

export const createOrgSchema = Joi.object({
  name:     Joi.string().trim().min(2).max(100).required(),
  industry: Joi.string().trim().max(100),
  website:  Joi.string().trim().uri().max(200),
  phone:    Joi.string().trim().max(20),
});

export const updateOrgSchema = Joi.object({
  name:     Joi.string().trim().min(2).max(100),
  industry: Joi.string().trim().max(100),
  website:  Joi.string().trim().uri().max(200),
  phone:    Joi.string().trim().max(20),
}).min(1);
