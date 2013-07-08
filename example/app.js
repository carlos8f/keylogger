var prompt = require('cli-prompt');

console.error('blah!');

prompt.multi([
  {key: 'username', required: true},
  {key: 'password', type: 'password', required: true}
], function (user) {
  process.exit();
});
