// HTTP status codes used across the app
export const STATUS = {
  OK:                    200,
  CREATED:               201,
  NO_CONTENT:            204,
  BAD_REQUEST:           400,
  UNAUTHORIZED:          401,
  FORBIDDEN:             403,
  NOT_FOUND:             404,
  CONFLICT:              409,
  UNPROCESSABLE_ENTITY:  422,
  INTERNAL_SERVER_ERROR: 500,
};

// User / entity active states
export const ACCOUNT_STATUS = {
  ACTIVE:   'active',
  INACTIVE: 'inactive',
};
