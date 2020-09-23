const Secret = require('../../lib/repository/secret');
const ValidationError = require('../../lib/errors/validationError');

module.exports = {
  async postSecret(req, res) {
    let data;
    try {
      const secretRepository = Secret.create();
      data = await secretRepository.save(req.body);
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).send(e.message);
      } else {
        console.log(e);
        res.status(500).send('Something went wrong.');
      }
    }
    res.send(data);
  },
};
