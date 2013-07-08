keylogger
=========

capture input from stdin transparently

[![build status](https://secure.travis-ci.org/carlos8f/keylogger.png)](http://travis-ci.org/carlos8f/keylogger)

## Usage

From inside the same process:

```js
var prompt = require('cli-prompt')
  , logger = require('keylogger')()

prompt.multi([
  {key: 'username', required: true},
  {key: 'password', type: 'password', required: true}
], function (user) {
  console.log('data', logger.data);
  console.log('captured', logger.captured);
});
```

Output:

```
$ node example/basic.js
$ username: carlos8f
$ password:
data { username: 'carlos8f', password: 'blah blah' }
captured [ { prompt: 'username', input: 'carlos8f' },
  { prompt: 'password', input: 'blah blah' } ]
```

From a parent process:
[example/spawn.js](https://github.com/carlos8f/keylogger/blob/master/example/spawn.js)

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Aptos, CA and Washington, D.C.

- - -

### License: MIT

- Copyright (C) 2013 Carlos Rodriguez (http://s8f.org/)
- Copyright (C) 2013 Terra Eclipse, Inc. (http://www.terraeclipse.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
