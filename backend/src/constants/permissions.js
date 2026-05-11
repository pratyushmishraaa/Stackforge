import { ADMIN, MANAGER, AGENT } from './roles.js';

export const PERMISSIONS = {
  [ADMIN]: [
    'users:read', 'users:write', 'users:delete',
    'leads:read', 'leads:write', 'leads:delete',
    'deals:read', 'deals:write', 'deals:delete',
    'tasks:read', 'tasks:write', 'tasks:delete',
    'orgs:read',  'orgs:write',  'orgs:delete',
  ],
  [MANAGER]: [
    'users:read',
    'leads:read', 'leads:write',
    'deals:read', 'deals:write',
    'tasks:read', 'tasks:write',
    'orgs:read',  'orgs:write',
  ],
  [AGENT]: [
    'leads:read', 'leads:write',
    'deals:read', 'deals:write',
    'tasks:read', 'tasks:write',
    'orgs:read',
  ],
};

export const can = (role, resource, action) =>
  (PERMISSIONS[role] || []).includes(`${resource}:${action}`);
