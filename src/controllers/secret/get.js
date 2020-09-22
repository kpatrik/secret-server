const Secret = require('../../lib/repository/secret');

module.exports = {
  async getSecret(req, res) {
    let data;
    try {
      data = await Secret.get(req.params.hash);
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
    res.send(data);
  },
};
