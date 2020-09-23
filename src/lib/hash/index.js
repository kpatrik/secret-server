const crypto = require('crypto');

module.exports = {
  createRandomHash(time) {
    const randomNumber = crypto.randomBytes(16);

    return crypto.createHash('sha256')
      .update(`${time}-${randomNumber}`)
      .digest('hex');
  },
};
