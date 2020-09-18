const express = require('express');
const database = require('./lib/database');

const app = express();
const port = 3010;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.on('ready', () => {
  app.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});

database.connect().then(() => {
  app.emit('ready');
});
