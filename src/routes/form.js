const express = require('express');
const router = express.Router();

function form() {
  router.get('/', (req, res) => {
    res.send(`
      <form action="/form/capture-body" method="post">
        <input type="text" name="username" placeholder="Username"/>
        <input type="password" name="password" placeholder="Password"/>
        <input type="submit" value="login in"/>
      </form>
    `);
  });
  router.post('/capture-body', (req, res) => {
    console.log('capture body: ', req.body);
    res.send('capture body');
  });
  return router;
}

module.exports = form;
