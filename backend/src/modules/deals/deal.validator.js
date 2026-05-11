import Joi from 'joi';

export const createDealSchema = Joi.object({
  title:      Joi.string().trim().required(),
  value:      Joi.number().required(),
  stage:      Joi.string().valid('prospecting','proposal','negotiation','won','lost'),
  lead:       Joi.string().hex().length(24).required(),
  assignedTo: Joi.string().hex().length(24),
});

export const updateDealSchema = Joi.object({
  title:      Joi.string().trim(),
  value:      Joi.number(),
  stage:      Joi.string().valid('prospecting','proposal','negotiation','won','lost'),
  assignedTo: Joi.string().hex().length(24),
}).min(1);
