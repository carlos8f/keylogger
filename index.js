var keypress = require('keypress')
  , FiloBuffer = require('filo-buffer')
  , tty = require('tty')
  , EventEmitter = require('events').EventEmitter
  , inherits = require('util').inherits

function KeyLogger (io, options) {
  EventEmitter.call(this);
  options || (options = {});
  var self = this;
  self.options = options;

  self.buf = self.getBuffer();
  self.captured = [];
  self.data = {};
  keypress(io.stdin);

  ['stdout', 'stderr'].forEach(function (s) {
    var stream = io[s];
    if (stream === process[s]) {
      // since stdio doesn't emit 'data' events, hook onto write function.
      var _write = stream.write;
      stream.write = function (data, encoding, cb) {
        _write.call(io.stdout, data, encoding, cb);
        search(data, encoding);
      };
    }
    else {
      console.log('s', s);
      // we are dealing with a child process, which has 'data' events.
      stream.on('data', search);
    }
  });

  function search (data, encoding) {
    self.buf.put(data.toString(encoding));
    var str = self.buf.toString();
    // search for a prompt
    console.log('str', str);
    var match = str.match(/(?:\n\r?|^\s*)([^\n\:]+)\: ?(?:\([^\n]+\))?$/);
    console.log('match', match);
    if (match) {
      if (self.options.timeout) {
        clearTimeout(self.timeout);
        self.timeout = setTimeout(function () {
          // pause stdin after a timeout if there was no input
          stdin.pause();
        }, self.options.timeout);
      }
      self.listening = true;
      stdin.removeListener('keypress', listen);
      stdin.on('keypress', listen);
      self.current = {
        prompt: match[1],
        input: self.getBuffer()
      };
      self.buf.clear();
      // automatic password detection
      if (str.match(/passphrase|password|token|secret/i)) {
        self.setRawMode(true);
      }
      try {
        stdin.resume();
      }
      catch (e) {}
    }
  }

  function listen (c, key) {
    clearTimeout(self.timeout);
    if (key) {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      }
      else if (key.name === 'return' || key.name === 'enter') {
        stdin.removeListener('keypress', listen);
        self.current.input = self.current.input.toString();
        self.captured.push(self.current);
        self.data[self.current.prompt] = self.current.input;
        self.emit('capture', self.current);
        try {
          stdin.pause();
        }
        catch (e) {}
        if (self.rawMode) {
          self.setRawMode(false);
        }
        return;
      }
      if (key.name === 'backspace') {
        var line = self.current.input.toString();
        line = line.slice(0, -1);
        self.current.input = self.getBuffer(line);
      }
    }
    if (!key || key.name !== 'backspace') self.current.input.put(c);
  }
}
inherits(KeyLogger, EventEmitter);

module.exports = function (stdin, stdout, options) {
  return new KeyLogger(stdin, stdout, options);
};

KeyLogger.prototype.setRawMode = function (mode) {
  this.rawMode = mode;
  if (process.stdin.setRawMode) {
    process.stdin.setRawMode(mode);
  }
  else if (process.stdout.isTTY) {
    tty.setRawMode(mode);
  }
};

KeyLogger.prototype.getBuffer = function (buf) {
  var ret = new FiloBuffer(this.options.bufferSize || 255);
  if (buf) ret.put(String(buf));
  return ret;
};
