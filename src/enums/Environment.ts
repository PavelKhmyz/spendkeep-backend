enum Environment {
  Production = 'production', // all remote environments
  Test = 'test', // unit/integration tests
  Development = 'development', // local development
}

export const isDevelopment = () =>
  process.env.NODE_ENV === Environment.Development || !process.env.NODE_ENV;
export const isTest = () => process.env.NODE_ENV === Environment.Test;

export default Environment;
