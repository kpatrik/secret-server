const express = require('express');
const bodyParser = require('body-parser');

const database = require('./lib/database');
const { decorateSecretAPIEndpoints } = require('./controllers');

const app = express();
const port = 3010;

app.use(bodyParser.json());

decorateSecretAPIEndpoints(app);

app.on('ready', () => {
  app.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});

database.connect().then(() => {
  app.emit('ready');
});
