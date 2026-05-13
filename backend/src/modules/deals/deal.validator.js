import Joi from 'joi';

export const createDealSchema = Joi.object({
  title:      Joi.string().trim().min(2).max(150).required(),
  value:      Joi.number().min(0).required(),
  stage:      Joi.string().valid('prospecting','proposal','negotiation','won','lost'),
  lead:       Joi.string().hex().length(24).required(),
  assignedTo: Joi.string().hex().length(24),
});

export const updateDealSchema = Joi.object({
  title:      Joi.string().trim().min(2).max(150),
  value:      Joi.number().min(0),
  stage:      Joi.string().valid('prospecting','proposal','negotiation','won','lost'),
  assignedTo: Joi.string().hex().length(24),
}).min(1);
