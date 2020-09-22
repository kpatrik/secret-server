const cryptoJS = require('crypto-js');
const config = require('config');

const secret = config.get('crypto.secret');
// const key = crypto.scryptSync(secret, 'salt', 24);

module.exports = {
  encrypt(text) {
    return cryptoJS.AES.encrypt(text, secret).toString();
  },

  decrypt(ciphertext) {
    console.log(ciphertext);
    const bytes = cryptoJS.AES.decrypt(ciphertext, secret);
    const originalText = bytes.toString(cryptoJS.enc.Utf8);
    return originalText;
  },
};
