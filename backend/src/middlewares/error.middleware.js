import { GENERAL_MESSAGES } from '../constants/messages.js';
import { STATUS } from '../constants/status.js';

/**
 * Centralised error handler — must be registered last in app.js.
 * Handles both operational AppErrors and unexpected errors.
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Default to 500 if no statusCode set
  const statusCode = err.statusCode || STATUS.INTERNAL_SERVER_ERROR;
  const code       = err.code       || 'INTERNAL_ERROR';

  // Mongoose duplicate key error (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(STATUS.CONFLICT).json({
      success: false,
      code:    'DUPLICATE_KEY',
      message: `A record with this ${field} already exists.`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      code:    'VALIDATION_ERROR',
      message: messages.join(' '),
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(STATUS.BAD_REQUEST).json({
      success: false,
      code:    'INVALID_ID',
      message: `Invalid value for field: ${err.path}.`,
    });
  }

  // Operational errors (thrown via AppError) — safe to expose message
  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      code,
      message: err.message,
    });
  }

  // Unknown / programmer errors — don't leak internals
  console.error('UNHANDLED ERROR:', err);

  return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    code:    'INTERNAL_ERROR',
    message: GENERAL_MESSAGES.INTERNAL_ERROR,
  });
};

export default errorHandler;
