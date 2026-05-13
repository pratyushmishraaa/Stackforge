import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title:      Joi.string().trim().min(2).max(150).required(),
  dueDate:    Joi.date().required(),
  priority:   Joi.string().valid('low','medium','high'),
  status:     Joi.string().valid('open','in_progress','done'),
  assignedTo: Joi.string().hex().length(24),
  lead:       Joi.string().hex().length(24),
  deal:       Joi.string().hex().length(24),
});

export const updateTaskSchema = Joi.object({
  title:      Joi.string().trim().min(2).max(150),
  dueDate:    Joi.date(),
  priority:   Joi.string().valid('low','medium','high'),
  status:     Joi.string().valid('open','in_progress','done'),
  assignedTo: Joi.string().hex().length(24),
  lead:       Joi.string().hex().length(24),
  deal:       Joi.string().hex().length(24),
}).min(1);
