var extra = require('extra');

if (!extra.cmd) {
  console.error('usage: node example/spawn.js -- <cmd> [cmd_options] [cmd_args...]');
  process.exit(1);
}

var proc = extra.spawn();
proc.stdout.pipe(process.stdout);
proc.stderr.pipe(process.stderr);
process.stdin.pipe(proc.stdin);
proc.on('exit', function (code) {
  process.exit(code);
});

var logger = require('../')({stdout: proc.stdout, stderr: proc.stderr});
logger.on('capture', console.log);
