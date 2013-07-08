var keypress = require('keypress')
  , FiloBuffer = require('filo-buffer')
  , tty = require('tty')
  , EventEmitter = require('events').EventEmitter
  , inherits = require('util').inherits

function KeyLogger (options) {
  EventEmitter.call(this);
  options || (options = {});
  var stdin = options.stdin || (options.stdin = process.stdin);
  var stdout = options.stdout || (options.stdout = process.stdout);
  var stderr = options.stderr || (options.stderr = process.stderr);
  var self = this;
  self.options = options;

  self.buf = self.getBuffer();
  self.captured = [];
  self.data = {};
  keypress(stdin);
  stdin.on('keypress', listen);

  ['stdout', 'stderr'].forEach(function (s) {
    var stream = options[s];
    if (stream !== process[s]) stream.on('data', search);
    // since process[stdio] doesn't emit 'data' events, hook onto write function.
    var _write = stream.write;
    stream.write = function (data, encoding, cb) {
      _write.call(stream, data, encoding, cb);
      search(data, encoding);
    };
  });

  function search (data, encoding) {
    self.buf.put(data.toString(encoding));
    var str = self.buf.toString();
    // search for a prompt
    var match = str.match(/(?:\n\r?|^\s*)([^\n\:]+)\: ?(?:\([^\n]+\))?$/);
    if (match) {
      if (self.options.timeout) {
        clearTimeout(self.timeout);
        self.timeout = setTimeout(function () {
          // pause stdin after a timeout if there was no input
          try {
            stdin.pause();
          }
          catch (e) {}
        }, self.options.timeout);
      }
      self.listening = true;
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
    if (!self.listening) return;
    clearTimeout(self.timeout);
    if (key) {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      }
      else if (key.name === 'return' || key.name === 'enter') {
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
        self.listening = false;
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
