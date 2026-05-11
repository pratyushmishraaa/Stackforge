import AppError from '../utils/AppError.js';
import { STATUS } from '../constants/status.js';

/**
 * Joi validation middleware factory.
 * Validates req.body against the provided schema.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), controller)
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly:   false, // collect all errors, not just the first
    stripUnknown: true,  // remove fields not in schema
  });

  if (error) {
    const message = error.details.map((d) => d.message).join(' ');
    return next(new AppError(message, STATUS.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR'));
  }

  req.body = value; // replace body with sanitised/coerced values
  return next();
};

export default validate;
