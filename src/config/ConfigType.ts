const ConfigType = {
  DatabaseUrl: Symbol('DatabaseUrl'),
  Port: Symbol('Port'),
  EmailPassword: Symbol('EmailPassword'),
  EmailUser: Symbol('EmailUser'),
  EmailPort: Symbol('EmailPort'),
  EmailHost: Symbol('EmailHost'),
  RedisUrl: Symbol('RedisUrl'),
  CookieDomain: Symbol('CookieDomain'),
  SessionSignSecret: Symbol('SessionSignSecret'),
};

export default ConfigType;
