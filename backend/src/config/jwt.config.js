const jwtConfig = {
  access: {
    get secret()    { return process.env.JWT_ACCESS_SECRET; },
    get expiresIn() { return process.env.JWT_ACCESS_EXPIRES || '15m'; },
  },
  refresh: {
    get secret()    { return process.env.JWT_REFRESH_SECRET; },
    get expiresIn() { return process.env.JWT_REFRESH_EXPIRES || '7d'; },
  },
};

export default jwtConfig;
