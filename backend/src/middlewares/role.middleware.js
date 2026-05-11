import { can } from '../constants/permissions.js';
import AppError from '../utils/AppError.js';
import { AUTH_MESSAGES } from '../constants/messages.js';
import { STATUS } from '../constants/status.js';

/**
 * Role-based access control middleware.
 *
 * Usage:
 *   // Allow specific roles
 *   router.get('/users', authenticate, authorize('admin', 'manager'), handler)
 *
 *   // Allow by permission (resource + action)
 *   router.delete('/users/:id', authenticate, requirePermission('users', 'delete'), handler)
 */

/**
 * Restricts access to users whose role is in the allowed list.
 * @param  {...string} roles - Allowed role names
 */
export const authorize = (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(AUTH_MESSAGES.FORBIDDEN, STATUS.FORBIDDEN, 'FORBIDDEN')
      );
    }
    return next();
  };

/**
 * Restricts access based on a specific permission (resource:action).
 * @param {string} resource - e.g. 'users', 'leads'
 * @param {string} action   - e.g. 'read', 'write', 'delete'
 */
export const requirePermission = (resource, action) =>
  (req, res, next) => {
    if (!req.user || !can(req.user.role, resource, action)) {
      return next(
        new AppError(AUTH_MESSAGES.FORBIDDEN, STATUS.FORBIDDEN, 'FORBIDDEN')
      );
    }
    return next();
  };
