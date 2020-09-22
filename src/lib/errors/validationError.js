class ValidationError extends Error {
  constructor(text) {
    super(`Failed to validate the input: ${text}.`);
  }
}

module.exports = ValidationError;
