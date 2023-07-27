export class TooManyRequestsError extends Error {
  constructor(message: string, readonly retryAfterSeconds?: number) {
    super(message);
  }
}
