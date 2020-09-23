const NotFoundError = require('../../lib/errors/notFoundError');
const Secret = require('../../lib/repository/secret');

module.exports = {
  async getSecret(req, res) {
    let data;
    try {
      const secretRepository = Secret.create();
      data = await secretRepository.get(req.params.hash);
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404).send(e.message);
      } else {
        console.log(e);
        res.status(500).send('Something went wrong.');
      }
    }
    res.send(data);
  },
};
