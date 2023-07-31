export default class ValidationError extends Error {
  constructor(message: string, readonly data?: Record<string, unknown>, readonly code?: string) {
    super(message);
  }
}
