var fs = require('fs');

fs.createReadStream('/dev/tty', {encoding: 'utf8'})
  .on('data', function (data) {
    console.error('data', data);
  });
