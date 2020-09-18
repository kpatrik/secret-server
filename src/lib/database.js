const config = require('config');
const mongoose = require('mongoose');

module.exports = {
  connect() {
    return new Promise( (resolve, reject) => {
      mongoose.connect(config.get('mongo.url'), {useNewUrlParser: true});
      const db = mongoose.connection;
      db.on('error', (error) => {
        console.log(error);
        reject();
      });
      db.once('open', function() {
        console.log('connected to MongoDB');
        resolve();
      });
    });
  }
}