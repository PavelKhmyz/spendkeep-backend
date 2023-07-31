export default class AuthorizationError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
  }
}
