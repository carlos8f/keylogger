var extra = require('extra');

if (!extra.cmd) {
  console.error('usage: node example/spawn.js -- <cmd> [cmd_options] [cmd_args...]');
  process.exit(1);
}

var proc = extra.spawn();
proc.stderr.on('data', function (data) {
  console.error('stderr', String(data));
});
proc.stdout.on('data', function (data) {
  console.error('stdout', String(data));
});
//var logger = require('../')({stdin: process.stdin, stdout: proc.stdout, stderr: proc.stderr});
//logger.on('capture', console.log);
