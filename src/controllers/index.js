const { postSecret } = require('./secret/post');
const { getSecret } = require('./secret/get');

module.exports = {
  decorateSecretAPIEndpoints(app) {
    app.post('/api/secret', postSecret);
    app.get('/api/secret/:hash', getSecret);
  },
};
