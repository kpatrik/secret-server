const crypto = require('crypto');

module.exports = {
  createRandomHash(time) {
    const randomNumber = Math.random();

    return crypto.createHash('sha256')
      .update(`${time}-${randomNumber}`)
      .digest('hex');
  },
};
