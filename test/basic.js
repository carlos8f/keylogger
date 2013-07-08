describe('basic test', function () {
  it('works', function (done) {
    suppose('node', ['example/basic.js'])
      .on('username: ').respond('carlos8f\n')
      .on('password: ').respond('blah blah\n')
      .on("data { username: 'carlos8f', password: 'blah blah' }\n").respond('')
      .on(/captured \[ \{ prompt\: 'username', input\: 'carlos8f' \},\s*\{ prompt\: 'password', input\: 'blah blah' \} \]/).respond('')
      .error(assert.ifError)
      .end(function (code) {
        assert.equal(code, 0);
        done();
      });
  });
});
