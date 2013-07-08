var prompt = require('cli-prompt')
  , logger = require('../')()

prompt.multi([
  {key: 'username', required: true},
  {key: 'password', type: 'password', required: true}
], function (user) {
  console.log('data', logger.data);
  console.log('captured', logger.captured);
});
