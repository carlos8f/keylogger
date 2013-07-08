var prompt = require('cli-prompt');

// run with `node example/spawn.js -- node example/app.js`

prompt.multi([
  {key: 'username', required: true},
  {key: 'password', type: 'password', required: true}
], function (user) {
  process.exit();
});
