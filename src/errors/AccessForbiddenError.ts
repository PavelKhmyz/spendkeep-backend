export default class AccessForbiddenError extends Error {
  constructor(message?: string, readonly data?: Record<string, unknown>) {
    super(message);
  }
}
