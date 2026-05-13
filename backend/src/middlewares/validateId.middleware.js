import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';
import { STATUS } from '../constants/status.js';

// Validates req.params.id is a valid MongoDB ObjectId
// Attach to any route that has /:id before the controller
const validateId = (req, _res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError('Invalid ID format.', STATUS.BAD_REQUEST, 'INVALID_ID'));
  }
  return next();
};

export default validateId;
