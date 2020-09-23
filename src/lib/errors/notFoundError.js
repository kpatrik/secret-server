class NotFoundError extends Error {
  constructor() {
    super('Secret not found or expired.');
  }
}

module.exports = NotFoundError;
