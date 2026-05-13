import Activity from '../modules/activity/activity.model.js';
import logger from '../utils/logger.js';

// Maps HTTP method + route pattern to a readable action
const getAction = (method) => {
  if (method === 'POST')   return 'created';
  if (method === 'PATCH')  return 'updated';
  if (method === 'DELETE') return 'deleted';
  return null;
};

// Maps route base path to resource name
const getResource = (url) => {
  if (url.includes('/orgs'))  return 'org';
  if (url.includes('/leads')) return 'lead';
  if (url.includes('/deals')) return 'deal';
  if (url.includes('/tasks')) return 'task';
  if (url.includes('/users')) return 'user';
  return null;
};

/**
 * Attach AFTER a route handler to log the completed action.
 * Only logs on successful responses (2xx).
 *
 * Usage in routes:
 *   router.post('/', ctrl.create, logActivity);
 */
const logActivity = (req, res, next) => {
  const action   = getAction(req.method);
  const resource = getResource(req.originalUrl);

  // Only log write operations on known resources
  if (!action || !resource || !req.user) return next();

  // Hook into res.json to capture the response after it's sent
  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    originalJson(body);

    // Only log successful responses
    if (res.statusCode < 200 || res.statusCode >= 300) return;

    try {
      // resourceId: from params (update/delete) or from response body (create)
      const resourceId = req.params?.id || body?.data?.[resource]?._id;
      if (!resourceId) return;

      await Activity.create({
        user:       req.user.sub,
        userName:   req.user.name || 'Unknown',
        action,
        resource,
        resourceId,
        changes:    action === 'updated' ? req.body : undefined,
      });
    } catch (err) {
      // Never let logging crash the app
      logger.error('Activity log failed', { error: err.message });
    }
  };

  next();
};

export default logActivity;
