import Joi from 'joi';

export const createOrgSchema = Joi.object({
  name:     Joi.string().trim().required(),
  industry: Joi.string().trim(),
  website:  Joi.string().trim().uri(),
  phone:    Joi.string().trim(),
});

export const updateOrgSchema = Joi.object({
  name:     Joi.string().trim(),
  industry: Joi.string().trim(),
  website:  Joi.string().trim().uri(),
  phone:    Joi.string().trim(),
}).min(1);
